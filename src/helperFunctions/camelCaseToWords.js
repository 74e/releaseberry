function camelCaseToWords(camelCaseString) {
  let normalWords = camelCaseString.replace(/([A-Z])/g, ' $1').toLowerCase()
  normalWords = normalWords.charAt(0).toUpperCase() + normalWords.slice(1)
  return normalWords
}

export default camelCaseToWords
