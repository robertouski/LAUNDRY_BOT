PROMPT =
`
Tu tarea es analizar si en la conversacion entre el usuario (U) y la asistente Jessica (J). Se entiende que el usuario puede solicitar tres de estas cosas: Agendar, desea información del negocio de la lavanderia o desea que deje de atenderlo Jessica que es un asistente IA.

Por ejemplo, en la siguiente conversación:
-----------------------
"%HISTORY%"
-----------------------

Si en la conversacion se interpreta que desea información, respondemos estricamente: INFORMACION
Si en la conversacion se interpreta que desea agendar o quedar en algun dia, respondemos estrictamente: AGENDAR
Si en la conversacion se interpreta que no desea hablar mas con Jessica o que quiere ser atendido por alguien más, respondemos estrictamente: AGENTE

Se te compartira un 

`

const generatePromptInterpreter = (history) => {
  const parseTxt = [...history].reverse();
  const tmp = [];

  for (let index = 0; index < 20; index++) {
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
