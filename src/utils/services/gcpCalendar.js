require('dotenv').config();
const { google } = require("googleapis");

// Load the credentials JSON file
const credentials = JSON.parse(process.env.credentials);
const SCOPES = ["https://www.googleapis.com/auth/calendar"]
const calendarId = process.env.calendarId || "primary"
// Set up authentication from the JSON credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES ,
});

// Create the Calendar API client
const calendar = google.calendar({ version: "v3", auth });

// Function to retrieve events from the calendar

async function getCalendarEvents() {
  try {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0, 0, 0, 0); // Set time to beginning of the day
    const endOfDay = new Date();
    endOfDay.setDate(endOfDay.getDate() + 10);
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day
    const response = await calendar.events.list({
      calendarId: calendarId, // Specify the calendar ID
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    return response.data.items;
  } catch (error) {
    console.error("Error retrieving events:", error);
    return [];
  }
}

// Main function to print free slots
async function freeCalendarSlots() {
  try {
    const events = await getCalendarEvents();
    console.log("events:", events);
    const busySlots = events.map((event) => ({
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    }));

    const availableSlots = {};

    // Iniciar el cálculo desde el día actual a las 5 am
    const now = new Date();
    now.setHours(5, 0, 0, 0); // Iniciar desde las 5 am el día actual
    const endOfDay = new Date(now);
    endOfDay.setDate(endOfDay.getDate() + 7); // Contar hasta 7 días a partir de hoy
    endOfDay.setHours(23, 59, 59, 999); // Establecer el tiempo al final del día

    let currentDay = new Date(now);
    while (currentDay <= endOfDay) {
      // Si el día actual es domingo (0), no se debe registrar
      if (currentDay.getDay() !== 0) {
        availableSlots[currentDay.toDateString()] = [];
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Iterar sobre cada hora de cada día desde las 10 am hasta las 4 pm
    let currentTime = new Date(now);

    while (currentTime <= endOfDay) {
      // Verificar si el día es domingo (0)
      const currentDayKey = currentTime.toDateString();
      if (currentTime.getDay() !== 0 && currentDayKey in availableSlots) {
        if (currentTime.getHours() >= 10 && currentTime.getHours() <= 16) {
          const currentSlotEnd = new Date(currentTime);
          currentSlotEnd.setHours(currentSlotEnd.getHours() + 1); // Fin de la hora actual

          // Verificar si la franja actual está ocupada por algún evento
          const isSlotFree = !busySlots.some((busySlot) => {
            return busySlot.start <= currentTime && busySlot.end >= currentSlotEnd;
          });

          if (isSlotFree) {
            availableSlots[currentDayKey].push({
              start: new Date(currentTime),
              end: new Date(currentSlotEnd),
            });
          }
        }
      }

      // Avanzar a la siguiente hora
      currentTime.setHours(currentTime.getHours() + 1);
    }
    return availableSlots;
  } catch (error) {
    console.error("Error finding free slots:", error);
  }
}



async function createEvent(name, description, eventDate, mail) {
  try {
    //"2024-03-12T07:00:00";
    const event = {
      summary: "Reunion con " + name,
      location: "Guayaquil",
      description: `${description} "su correo" ${mail}`,
      start: {
        dateTime: eventDate,
        timeZone: "America/Guayaquil", // Specify your timezone here
      },
      end: {
        dateTime: new Date(
          new Date(eventDate).getTime() + 60 * 60 * 1000
        ).toISOString(), // End time 1 hour after start time
        timeZone: "America/Guayaquil", // Specify your timezone here
      },
    };

    const response = await calendar.events.insert({
      calendarId: calendarId , // Specify the calendar ID
      resource: event,
    });

    console.log("Event created:", response.data.htmlLink);
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

module.exports = { freeCalendarSlots, createEvent };
