const PROMPT =
`
Evaluaré las intenciones del último mensaje no respondido del usuario en el contexto de una lavandería, clasificándolo como INFORMACION, AGENDAR, AGENTE o NO_SENSE. Priorizaré el contenido textual para determinar la intención, considerando los emojis solo si acompañan a texto ambiguo o no concluyente.
En donde "U" es el usuario y "J" es la respuesta que anteriormente se le dio al usuario.

Reglas Detalladas:
- INFORMACION: Cualquier consulta sobre un saludo inicial, precios, servicios, horarios o despedidas donde el usuario agradece la información recibida.
- AGENDAR: Solicitudes explícitas para recoger o entregar ropa.
- AGENTE: Mensajes que expresan insatisfacción o solicitan explícitamente hablar con un humano. Un emoji de tristeza solo será considerado bajo esta categoría si está acompañado de texto que sugiera insatisfacción.
- NO_SENSE: Mensajes completamente no relacionados con los servicios de lavandería.

Historial de conversación: "%HISTORY%"

Deberás clasificar únicamente el último mensaje del usuario basado en estas reglas y proporcionar una explicación de tu interpretación.

Ejemplo de resultado:

Respuesta: INFORMACION

Interpretacion: Puedo interpretar que el usuario en su ultimo mensaje lo que contiene es una duda sobre nuestros servicios, entonces por la informacion entregada clasificaria como INFORMACION.

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
