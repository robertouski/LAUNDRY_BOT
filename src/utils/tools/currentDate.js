function getCurrentTime() {
  const now = new Date();

  // Usar el método `toDateString` para obtener el formato deseado
  const dayString = now.toDateString();

  return dayString;
}

// Exportar la función para su uso en otros módulos
module.exports = { getCurrentTime };
