const express = require("express");
const cors = require("cors");
const { join } = require("path");
const { createReadStream } = require("fs");
const chatwootRoutes = require('../routes/chatwootRoutes');

class ServerHttp {
  app;
  port;
  providerWs;

  constructor(_port = 4000, _providerWs) {
    this.port = _port;
    this.providerWs = _providerWs;
  }

  qrCtrl = (req, res) => {
    const pathQrImage = join(process.cwd(), "bot.qr.png");
    const fileStream = createReadStream(pathQrImage);

    res.writeHead(200, { "Content-Type": "image/png" });
    fileStream.pipe(res);
  };

  chatwootCtrl = (req, res) => {
    res.send('ok');
  };

  initialization = (bot) => {
    if (!bot) {
      throw new Error('DEBES_DE_PASAR_BOT');
    }
    this.app = express();
    this.app.use(cors());
    this.app.use((req, _, next) => {
      req.providerWs = this.providerWs; 
      req.bot = bot;
      next();
    });
    this.app.use(express.json()); // Para manejar JSON en las solicitudes

    // Ruta de prueba para verificar que el servidor está funcionando
    this.app.get('/test', (req, res) => {
      res.send('Server is running!');
    });

    // Rutas de Chatwoot
    this.app.use('/api/chatwoot', chatwootRoutes);

    // Otras rutas
    this.app.post('/chatwoot', this.chatwootCtrl);
    this.app.get('/scan-qr', this.qrCtrl);

    this.app.listen(this.port, () => {
      console.log(``);
      console.log(`🤯 http://localhost:${this.port}/scan-qr`);
      console.log(`Server is running on port ${this.port}`);
      console.log(``);
    });
  };
}

module.exports = ServerHttp;
