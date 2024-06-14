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
    now.setHours(0, 0, 0, 0); // Start of the day
    const endOfDay = new Date();
    endOfDay.setDate(endOfDay.getDate() + 10);
    endOfDay.setHours(23, 59, 59, 999); // End of the day
    const response = await calendar.events.list({
      calendarId: calendarId,
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

// Helper function to convert a Date object to the desired time zone
function convertToTimeZone(date, timeZone) {
  return new Date(date.toLocaleString("en-US", { timeZone }));
}

// Main function to find and print free slots
async function freeCalendarSlots() {
  const busySlots = await getCalendarEvents();
  const availableSlots = {};

  // Start from 8 AM local time
  const now = convertToTimeZone(new Date(), "America/Mexico_City");
  now.setHours(8, 0, 0, 0);

  // End at 6 PM local time, seven days from today
  const endOfDay = new Date(now);
  endOfDay.setDate(endOfDay.getDate() + 7);
  endOfDay.setHours(18, 0, 0, 0);

  // Initialize available slots for each day within the range
  let currentDay = new Date(now);
  while (currentDay <= endOfDay) {
    if (currentDay.getDay() !== 0) { // Avoid Sundays
      availableSlots[currentDay.toDateString()] = [];
    }
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // Iterate each hour from 8 AM to 6 PM local time
  let currentTime = new Date(now);
  while (currentTime <= endOfDay) {
    const currentDayKey = currentTime.toDateString();
    if (currentTime.getDay() !== 0 && currentDayKey in availableSlots) {
      if (currentTime.getHours() >= 8 && currentTime.getHours() < 18) {
        const currentSlotEnd = new Date(currentTime);
        currentSlotEnd.setHours(currentTime.getHours() + 1);

        // Check if the slot is free
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
    // Advance to the next hour
    currentTime.setHours(currentTime.getHours() + 1);
  }

  return availableSlots;
}

async function createEvent(name, description, eventDate, location) {
  try {
    const event = {
      summary: "Cliente: " + name,
      location: `${location}`,
      description: `${description}`,
      start: {
        dateTime: eventDate,
        timeZone: "America/Guayaquil",
      },
      end: {
        dateTime: new Date(
          new Date(eventDate).getTime() + 60 * 60 * 1000
        ).toISOString(), // End time 1 hour after start time
        timeZone: "America/Guayaquil",
      },
      colorId: getRandomColor(),
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    });

    console.log("Event created:", response.data.htmlLink);
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

module.exports = { freeCalendarSlots, createEvent };
