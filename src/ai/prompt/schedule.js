const PROMPT = `El usuario nos compartió el día que se encuentra disponible para agendar con nosotros, sabiendo que hoy es: "%CURRENT_TIME%".

**Aclaración de Días de la Semana**:
- Lunes = Mon
- Martes = Tue
- Miércoles = Wed
- Jueves = Thu
- Viernes = Fri
- Sábado = Sat

Esta es la lista de los días disponibles: "%AVAILABLE_DAYS%".

Y la respuesta del usuario es: "%MESSAGE%".

Tu tarea es identificar el día solicitado por el usuario en relación con el día de hoy y proporcionar la fecha en el mismo formato en que aparece en la lista de días disponibles.

**Ejemplos**:

1.- Hoy es "Wed May 08 2024", y el cliente respondió: "Hoy puedo".
Tu respuesta debe ser: "Wed May 08 2024", porque hoy es el día indicado.

2.- Hoy es "Tue May 07 2024", y el cliente respondió: "Puedo a partir de este viernes".
Tu respuesta debe ser: "Fri May 10 2024", ya que esa es la fecha que corresponde a lo que el usuario indica y está en la lista de días disponibles.

**Instrucciones Importantes**:
- Si el día indicado por el usuario no está disponible en la lista, responde: NO_AVAILABLE.
- Si el usuario responde algo que no tiene sentido como entregarte una fecha o mencionarte un dia, responde: NO_SENSE.
- Solo puedes responder con la fecha que está disponible, como indican las instrucciones, o con NO_AVAILABLE o NO_SENSE.
- Proporciona tu respuesta en el formato exacto: "[fecha]".
- No proporciones ninguna explicación adicional.

Ejemplo de respuesta correcta: Mon May 13 2024.
`

const PROMPT_2 = `
Se te va a entregar {DIAYHORA} que posee el dia con las horas disponibles que se le entrego al usuario para que elija una hora con respecto a esa lista y {MENSAJE DE USUARIO} es la respuesta del usuario con respecto a las horas que se le compartio para ese dia, tu estas a cargo de interpretar si se eligio un numero que corresponderia al "Inicio" de la hora que eligio el usuario en relacion a ese dia. 

En caso de que {MENSAJE DE USUARIO} sea afirmativo respondiendo de la manera en que indica la hora o un numero en su respuesta ese numero siempre sera interpretado como una hora que pertenece a la lista de {DIAYHORA}, tu respuesta sera exclusivamente una fecha y un rango de hora, que sera en formato  ISO 8601 y UTC-5.
por ejemplo: 2024-03-12T12:00:00.000-05:00. Debes relacionar la respuesta del {MENSAJE DE USUARIO} con la informacion de {DIAYHORA} y solo exclusivamente responder formato ISO 8601 con esas coordenadas y no agregar o responder otra cosa mas.

En caso de que {MENSAJE DE USUARIO} sea una respuesta que carece de sentido sobre indicar un numero o una hora o indicar que no puede ninguna de esas horas indicadas tu respondes: TARAD@_DETECTED

{DIAYHORA}: %AVAILABLE_HOURS%
{MENSAJE DE USUARIO}: %MESSAGE%
`

const generatePromptScheduleDayInterpreter = (message, availableDays, currentTime) => {

  const txt = PROMPT.replace("%MESSAGE%", message) .replace("%AVAILABLE_DAYS%", availableDays.join(",")).replace("%CURRENT_TIME%", currentTime)
  return txt;
}
const generatePromptScheduleHourInterpreter = (message, availableHours, currentTime) => {

  const txt = PROMPT_2.replace("%MESSAGE%", message) .replace("%AVAILABLE_HOURS%", availableHours).replace("%CURRENT_TIME%", currentTime)
  return txt;
}



module.exports = {generatePromptScheduleDayInterpreter, generatePromptScheduleHourInterpreter};
