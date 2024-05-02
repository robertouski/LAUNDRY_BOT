function isVoiceNote(text) {
  const pattern = /event_voice_note_/;

  return pattern.test(text);
}

module.exports = { isVoiceNote };
