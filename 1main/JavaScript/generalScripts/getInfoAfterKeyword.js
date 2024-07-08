function getInfoAfterKeyword(inputString, keyword) {
  var keywordLength = keyword.length;
  var matches = [];
  var index = inputString.indexOf(keyword);

  while (index !== -1) {
    var startIndex = index + keywordLength;
    var endIndex = inputString.indexOf('\n', startIndex);
    if (endIndex === -1) {
      endIndex = inputString.length;
    }
    var info = inputString.substring(startIndex, endIndex).trim();
    matches.push(info);
    index = inputString.indexOf(keyword, endIndex);
  }

  return matches;
}
