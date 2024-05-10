require("dotenv").config();
const { google } = require("googleapis");
const getRandomColor = require("../tools/randomColor");

// Load the credentials JSON file
const credentials = JSON.parse(process.env.credentials);
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendarId = process.env.calendarId || "primary";
// Set up authentication from the JSON credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
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
// Helper function to convert a Date object to the desired time zone
function convertToTimeZone(date, timeZone) {
  return new Date(date.toLocaleString("en-US", { timeZone }));
}

async function getCalendarEvents() {
  try {
    // Establecer inicio y fin del rango de fechas en UTC
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0, 0, 0, 0); // Inicio del día
    const endOfDay = new Date(now);
    endOfDay.setDate(endOfDay.getDate() + 10);
    endOfDay.setHours(23, 59, 59, 999); // Fin del décimo día

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    // Convertir los horarios ocupados a UTC-5
    const timeZone = "America/Mexico_City"; // Reemplazar con la zona horaria correcta
    return response.data.items.map((event) => ({
      start: convertToTimeZone(new Date(event.start.dateTime), timeZone),
      end: convertToTimeZone(new Date(event.end.dateTime), timeZone),
    }));
  } catch (error) {
    console.error("Error retrieving events:", error);
    return [];
  }
}

// Main function to find and print free slots
async function freeCalendarSlots() {
  try {
    const busySlots = await getCalendarEvents();
    const availableSlots = {};

    // Iniciar desde las 8 AM hora local
    const now = convertToTimeZone(new Date(), "America/Mexico_City");
    now.setHours(8, 0, 0, 0);

    // Finalizar hasta las 3:59 PM hora local, siete días a partir de hoy
    const endOfDay = new Date(now);
    endOfDay.setDate(endOfDay.getDate() + 7);
    endOfDay.setHours(15, 59, 59, 999);

    // Inicializar slots disponibles para cada día dentro del rango
    let currentDay = new Date(now);
    while (currentDay <= endOfDay) {
      if (currentDay.getDay() !== 0) {
        // Evitar los domingos (0 es domingo)
        availableSlots[currentDay.toDateString()] = [];
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Iterar cada hora desde las 8 AM hasta las 4 PM hora local
    let currentTime = new Date(now);
    while (currentTime <= endOfDay) {
      const currentDayKey = currentTime.toDateString();
      if (currentTime.getDay() !== 0 && currentDayKey in availableSlots) {
        if (currentTime.getHours() >= 8 && currentTime.getHours() < 16) {
          const currentSlotEnd = new Date(currentTime);
          currentSlotEnd.setHours(currentSlotEnd.getHours() + 1);

          // Verificar si la franja está ocupada
          const isSlotFree = !busySlots.some((busySlot) => {
            return (
              busySlot.start <= currentTime && busySlot.end >= currentSlotEnd
            );
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
    return {};
  }
}

async function createEvent(name, description, eventDate, location) {
  try {
    //"2024-03-12T07:00:00";
    const event = {
      summary: "Cliente: " + name,
      location: `${location}`,
      description: `${description}`,
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
      colorId: getRandomColor(),
    };

    const response = await calendar.events.insert({
      calendarId: calendarId, // Specify the calendar ID
      resource: event,
    });

    console.log("Event created:", response.data.htmlLink);
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

module.exports = { freeCalendarSlots, createEvent };
