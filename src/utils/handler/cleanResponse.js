function cleanResponse(text) {
  const citationPattern = /【\d+:\d+†source】/g;
  return text.replace(citationPattern, '');
}

module.exports = cleanResponse