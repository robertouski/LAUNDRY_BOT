let slotsInfo = "";

function availableSlotsHandler(availableSlots, numberDay) {
  const days = Object.keys(availableSlots);
  const selectedDayKey = days[numberDay];

  if (!selectedDayKey) {
    console.log('El número del día proporcionado no es válido.');
    return;
  }

  const date = new Date(selectedDayKey);
  const formattedDay = date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  slotsInfo += formattedDay + "\n";

  availableSlots[selectedDayKey].forEach((slot) => {
    slotsInfo += `Inicio: ${slot.start.toLocaleTimeString("en-US", {
      timeZone: "UTC",
    })}, Fin: ${slot.end.toLocaleTimeString("en-US", {
      timeZone: "UTC",
    })}\n`;
  });


  return slotsInfo;
}


function extractDaysWithAvailableSlots(availableSlots) {
  // Obtener solo los nombres de los días (las claves del objeto)
  return Object.keys(availableSlots);
}

module.exports = {availableSlotsHandler, extractDaysWithAvailableSlots};
