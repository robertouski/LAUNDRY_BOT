let slotsInfo = "";

function availableSlotsHandler(availableSlots, dayKey) {
  // Verificamos si el día proporcionado está en la lista de llaves del objeto
  if (!availableSlots.hasOwnProperty(dayKey)) {
    console.log('El día proporcionado no tiene información disponible.');
    return;
  }

  // Convertimos el día a un objeto Date para formatear correctamente
  const date = new Date(dayKey);
  const formattedDay = date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Reiniciamos la variable para evitar acumulación
  slotsInfo = formattedDay + "\n";

  // Zona horaria de la que deseas obtener los horarios locales
  const timeZone = "America/Mexico_City"; // Cambia esto si necesitas otra zona horaria

  // Iteramos sobre las franjas horarias para construir el string de información
  availableSlots[dayKey].forEach((slot) => {
    slotsInfo += `Inicio: ${new Date(slot.start).toLocaleTimeString("en-US", {
      timeZone: timeZone,
    })}, Fin: ${new Date(slot.end).toLocaleTimeString("en-US", {
      timeZone: timeZone,
    })}\n`;
  });

  return slotsInfo;
}


  function extractDaysWithAvailableSlots(availableSlots) {
    // Obtener solo los nombres de los días (las claves del objeto)
    return Object.keys(availableSlots);
  }

module.exports = {availableSlotsHandler, extractDaysWithAvailableSlots};
