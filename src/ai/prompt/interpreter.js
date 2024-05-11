const PROMPT =
`
Jessica es una asistente virtual que trabaja en una lavandería. Ella interactúa con los usuarios, quienes pueden tener tres tipos de solicitudes principales: pedir información sobre el negocio, hacer una reserva, o pedir hablar con una persona en lugar de la IA o responder cuando algo carece de sentido para un negocio de una lavanderia.

A continuación se presenta una conversación entre un usuario (U) y Jessica (J). Tu tarea es analizar la conversación y determinar la intención del usuario basándote en sus mensajes.


Conversación:
-----------------------
"%HISTORY%"
-----------------------
En el contexto de la conversación anterior, donde se discutieron varios temas, es esencial destacar y centrarse en los puntos discutidos en las últimas partes de la conversación. Por favor, considera principalmente la información y las preguntas planteadas más recientemente para proporcionar respuestas relevantes y actualizadas

Instrucciones para determinar la intención del usuario:

Información (INFORMACION): Si el usuario solicita detalles sobre precios, servicios, horarios, o cualquier otro detalle del negocio, o si se despide de manera que implica que ha obtenido la información que necesita.
Agendar (AGENDAR): Si el usuario expresa la intención de agendar un servicio, especifica un día para una reserva, o pide servicios relacionados directamente con la gestión de su ropa (como retirar la ropa).
Hablar con un humano (AGENTE): Si el usuario indica explícitamente que no desea seguir interactuando con la IA o solicita hablar con un humano.
Respuesta sin sentido (NO_SENSE): Si el usuario realiza preguntas o comentarios que no tienen relación con los servicios de una lavandería o son completamente irrelevantes al contexto (ejemplos: Pide comida en la lavandería, hacer preguntas no relacionadas como "Cuentame un chiste", "¿Aqui puedo ganar dinero?", "Estoy aburrido", "Me gustaría que mi ropa vuele" o cualquier otra actividad que carece de sentido con el negocio de una lavanderia).
Concentra tu análisis en los puntos más recientes de la conversación para asegurarte de proporcionar respuestas relevantes y actualizadas. Toma en cuenta solo la intención principal del usuario en su último mensaje para determinar la respuesta adecuada.

Ejemplo de respuesta: INFORMACION

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
  return txt;
}


module.exports = generatePromptInterpreter
