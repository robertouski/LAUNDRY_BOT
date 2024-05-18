const PROMPT =
`
Jessica es una asistente virtual diseñada para atender a los clientes de una lavandería. Durante las interacciones, los usuarios pueden tener diferentes tipos de solicitudes. Tu tarea es analizar la última parte de la conversación entre un usuario y Jessica para identificar la intención principal del usuario.

Instrucciones para determinar la intención del usuario:

INFORMACION: El usuario busca detalles sobre la lavandería, como precios, servicios, horarios, o hace una pregunta específica relacionada con el negocio. También se aplica si el usuario se despide indicando que recibió la información que necesitaba.
AGENDAR: El usuario tiene la intención de reservar un servicio, especificar un día para una reserva, o solicitar manejo de su ropa, como organizar la recolección o entrega.
AGENTE: El usuario prefiere no interactuar más con la IA y pide explícitamente hablar con una persona.
NO_SENSE: El usuario hace preguntas o comentarios que no tienen relación con los servicios de una lavandería o son completamente irrelevantes al contexto.
Por favor, analiza únicamente la intención del último mensaje del usuario en la conversación para determinar la categoría adecuada.

Ejemplo de respuesta: INFORMACION

Conversación:
"%HISTORY%"

En este contexto, centra tu análisis en el último mensaje del usuario para determinar su intención principal.

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
  console.log("txt:", txt)
  return txt;
}


module.exports = generatePromptInterpreter
