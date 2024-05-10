function getCurrentTime() {
  const now = new Date();

  // Usar el método `toDateString` para obtener la fecha
  const dayString = now.toDateString();

  // Usar `toLocaleTimeString` para obtener la hora con minutos y segundos
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // Usar formato de 12 horas (AM/PM)
  });

  // Combinar el día y la hora en un solo string
  const dayAndTime = `${dayString} ${timeString}`;

  return dayAndTime;
}

// Exportar la función para su uso en otros módulos
module.exports = { getCurrentTime };
