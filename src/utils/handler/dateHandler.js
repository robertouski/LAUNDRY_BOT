function translateDateToSpanish(dateString) {
  // Diccionarios para días de la semana y meses
  const days = {
    "Mon": "Lunes",
    "Tue": "Martes",
    "Wed": "Miércoles",
    "Thu": "Jueves",
    "Fri": "Viernes",
    "Sat": "Sábado",
    "Sun": "Domingo"
  };

  const months = {
    "Jan": "Enero",
    "Feb": "Febrero",
    "Mar": "Marzo",
    "Apr": "Abril",
    "May": "Mayo",
    "Jun": "Junio",
    "Jul": "Julio",
    "Aug": "Agosto",
    "Sep": "Septiembre",
    "Oct": "Octubre",
    "Nov": "Noviembre",
    "Dec": "Diciembre"
  };

  // Separar las partes de la cadena de fecha
  const [day, month, dayNumber, year] = dateString.split(" ");

  // Traducir usando los diccionarios
  const daySpanish = days[day];
  const monthSpanish = months[month];

  // Devolver el resultado en español
  return `${daySpanish} ${dayNumber} de ${monthSpanish} de ${year}`;
}

module.exports = translateDateToSpanish