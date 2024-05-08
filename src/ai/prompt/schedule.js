const PROMPT = `
Previamente se tiene una conversación con usuario y con Jessica en donde "U" es usuario y "J" es Jessica. Si se te compartio esta historia es porque anteriormente se detecto que las intenciones del usuario son de AGENDAR.

Tambien para que tengas información de la fecha actual es: %CURRENT_TIME%

Conversación:
-----------------------
"%HISTORY%"
-----------------------

En el contexto de la conversación anterior, donde se discutieron varios temas, es esencial destacar y centrarse en los puntos discutidos en las últimas partes de la conversación. Por favor, considera principalmente la información con el dia o la fecha que te dicte el usuario (U).


Tu objetivo es comparar ese dia dictado por usuario con los dias disponibles que serian {DIAS_DISPONIBLES} 

En caso de que en el mensaje de usuario veas una respuesta negativa o de que no puede ese dia, tu respuesta sera: NEGATIVO_DAY

En caso de que el mensaje de usuario sea afirmativo respondiendo de la manera en que indica la hora o un numero en su respuesta ese numero siempre sera interpretado como una hora que pertenece a la lista de {DIAS_DISPONIBLES}, tu respuesta sera exclusivamente una fecha y un rango de hora, que sera en formato  ISO 8601 y UTC-5.
por ejemplo: 2024-03-12T12:00:00.000-05:00. Debes relacionar la respuesta del mensaje de usuario con la informacion de {DIAS_DISPONIBLE} y solo exclusivamente responder formato ISO 8601 con esas coordenadas y no agregar o responder otra cosa mas.

En caso de que mensaje de usuario sea una de que ya no desea nada o se esta despidiendo tu respondes: DESPEDIDA
En caso de que mensaje de usuario sea una respuesta que carece de sentido sobre indicar un numero o una hora o indicar que no puede ninguna de esas horas indicadas tu respondes: NO_SENSE_DETECTED

{DIAS_DISPONIBLES}: %AVAILABLE_DAYS%
`;

const PROMPT_2 = `El usuario nos compartió el día que se encuentra disponible para agendar con nosotros, sabiendo que hoy es: "%CURRENT_TIME%".

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

const generatePromptSchedule = (history, availableDays, currentTime) => {
  const parseTxt = [...history].reverse();
  const tmp = [];

  for (let index = 0; index < 6; index++) {
    const element = parseTxt[index];
    if (element?.role === "assistant"){
      tmp.push(`J:{${element.content}}`)
    }
    if (element?.role === "user"){
      tmp.push(`U:{${element.content}}`);
    }
  }

  const txt = PROMPT.replace("%HISTORY%", history).replace("%AVAILABLE_DAYS%", availableDays).replace("%CURRENT_TIME%", currentTime)
  console.log(txt)
  return txt;
}

const generatePromptScheduleInterpreter = (message, availableDays, currentTime) => {

  const txt = PROMPT_2.replace("%MESSAGE%", message) .replace("%AVAILABLE_DAYS%", availableDays.join(",")).replace("%CURRENT_TIME%", currentTime)
  console.log(txt)
  return txt;
}



module.exports = {generatePromptSchedule, generatePromptScheduleInterpreter};
