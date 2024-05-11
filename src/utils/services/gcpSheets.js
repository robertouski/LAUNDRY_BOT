require("dotenv").config();
const { google } = require("googleapis");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const credentials = JSON.parse(process.env.credentials);
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

class GoogleSheetService {
  constructor(sheetId = undefined) {
    this.jwtFromEnv = undefined;
    this.doc = undefined;
    if (!sheetId) {
      throw new Error("ID_UNDEFINED");
    }

    this.jwtFromEnv = new JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });

    this.sheetId = sheetId;
    this.doc = new GoogleSpreadsheet(sheetId, this.jwtFromEnv);
    this.auth = auth;
  }


  getFormattedDate() {
    const now = new Date();
    return (
      now.getFullYear() +
      "-" +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + now.getDate()).slice(-2) +
      " " +
      ("0" + now.getHours()).slice(-2) +
      ":" +
      ("0" + now.getMinutes()).slice(-2) +
      ":" +
      ("0" + now.getSeconds()).slice(-2)
    );
  }

  async getClientInfoByNumber(phoneNumber) {
    try {
      await this.doc.loadInfo();

      if (this.doc.sheetsByIndex.length <= 0) {
        console.error("Índice fuera de rango.");
        return null;
      }

      const sheet = this.doc.sheetsByIndex[0];
      const rows = await sheet.getRows();

      const matchingRow = rows.find((row) => row._rawData[2] === phoneNumber);

      if (matchingRow) {
        return {
          name: matchingRow._rawData[1] || "",
          number: matchingRow._rawData[2] || "",
        };
      } else {
        console.error("Número no encontrado.");
        return null;
      }
    } catch (err) {
      console.error("Error al obtener información:", err);
      return undefined;
    }
  }

  async saveClientData(data = {}) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0];

      const order = await sheet.addRow({
        date: this.getFormattedDate(),
        name: data.name || "",
        number: data.number || "",
        direction: data.direction || "",
        description: data.description || "",
      });

      return order;
    } catch (err) {
      console.error("Error al guardar datos:", err);
      return undefined;
    }
  }
}

module.exports = GoogleSheetService;
