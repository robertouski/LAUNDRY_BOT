const PROMPT =
`
Jessica es una asistente virtual que trabaja en una lavandería. Ella interactúa con los usuarios, quienes pueden tener tres tipos de solicitudes: pedir información sobre el negocio, hacer una reserva, o pedir hablar con una persona en lugar de la IA.

A continuación se presenta una conversación entre un usuario (U) y Jessica (J). Tu tarea es analizar la conversación y determinar la intención del usuario basándote en sus mensajes.

Conversación:
-----------------------
"%HISTORY%"
-----------------------

Hay que resaltar que la prioridad de la conversacion es en las ultimas conversaciones

Instrucciones:
- Si el usuario solicita información sobre precios, servicios, horarios, o cualquier otro detalle del negocio, responde: INFORMACION.
- Si el usuario expresa el deseo de agendar un servicio o especifica un día para una reserva, responde: AGENDAR.
- Si el usuario indica que no quiere seguir interactuando con Jessica o solicita hablar con un humano, responde: AGENTE.
- Si ninguna de las intenciones anteriores es clara, responde: JESSICA.

Escribe tu respuesta basada en el análisis de la conversación proporcionada.

`

const generatePromptInterpreter = (history) => {
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

  const fullTxt = tmp.reverse().join("\n");

  const txt = PROMPT.replace("%HISTORY%", fullTxt);
  console.log(txt)
  return txt;
}


module.exports = generatePromptInterpreter
