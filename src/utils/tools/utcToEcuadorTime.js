function convertToEcuadorTime(datesArray) {
  // Desplazamiento de Ecuador es UTC-5
  const ecuadorOffset = -5 * 60 * 60 * 1000;

  return datesArray.map(({ start, end }) => {
    // Convertir las fechas a objetos Date
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Ajustar las fechas a UTC-5
    const startEcuador = new Date(startDate.getTime() + ecuadorOffset);
    const endEcuador = new Date(endDate.getTime() + ecuadorOffset);

    // Formatear las fechas para que vuelvan al formato ISO
    return {
      start: startEcuador.toISOString(),
      end: endEcuador.toISOString(),
    };
  });
}

module.exports = convertToEcuadorTime