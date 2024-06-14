const handlerMessage = async (
  dataIn = { phone: "", name: "", message: "", mode: "", attachment: [] },
  chatwoot
) => {
  try {
		console.log('Esto recibo en index, handlerMessage:', dataIn)
    const inbox = await chatwoot.findOrCreateInbox({
      name: "LAUNDRY_CHIC-BOTWS",
    });
    if (!inbox) throw new Error("Failed to find or create inbox");

    const contact = await chatwoot.findOrCreateContact({
      from: dataIn.phone,
      name: dataIn.name,
      inbox: inbox.id
    });
    if (!contact) throw new Error("Failed to find or create contact");
    const conversation = await chatwoot.findOrCreateConversation({
      inbox_id: inbox.id,
      contact_id: contact.id,
      phone_number: dataIn.phone,
    });
    if (!conversation) throw new Error("Failed to find or create conversation");

    await chatwoot.createMessage({
      msg: dataIn.message,
      mode: dataIn.mode, // incoming o outgoing
      conversation_id: conversation.id,
      attachment: dataIn.attachment,
    });
  } catch (error) {
    console.error("Error during handlerMessage:", error);
  }
};

const handlerContact  = async (dataIn = { phone: "", name: "" },
chatwoot) => {
  const contact = await chatwoot.findOrCreateContact({
    from: dataIn.phone,
    name: dataIn.name,
  });
  console.log('contact:', contact)
  if (!contact) throw new Error("Failed to find or create contact");
  return contact
}

module.exports = { handlerMessage, handlerContact };
