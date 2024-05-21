const handlerMessage = async (dataIn = { phone: '', name: '', message: '', mode: '', attachment: [] }, chatwoot) => {
  const inbox = await chatwoot.findOrCreateInbox({ name: 'CHIC-BOTWS' });
  const contact = await chatwoot.findOrCreateContact({ from: dataIn.phone, name: dataIn.name });
  const conversation = await chatwoot.findOrCreateConversation({
      inbox_id: inbox.id,
      contact_id: contact.id,
      phone_number: dataIn.phone
  });
  await chatwoot.createMessage({
      msg: dataIn.message,
      mode: dataIn.mode,
      conversation_id: conversation.id,
      attachment: dataIn.attachment
  });
}

module.exports = { handlerMessage };
