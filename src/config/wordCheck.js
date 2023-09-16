export const checkWord = (_wordToCheck) => {
  const s1 = "wedesignanddevelopapplications";
  const s2 = "thatruntheworldand";
  const s3 = "showcasethefuture";
  console.log(_wordToCheck);
  return _wordToCheck === s1 || _wordToCheck === s2 || _wordToCheck === s3;
};

export const sortWordQueue = (wordQueue) => {
  wordQueue.sort((a, b) => b.pos.x - a.pos.x);
  wordQueue.sort((a, b) => b.pos.y - a.pos.y);
  return wordQueue;
};

export const sortLetters = (letters) => {
  letters.sort((a, b) => b.letter.pos.x - a.letter.pos.x);
  letters.sort((a, b) => b.letter.pos.y - a.letter.pos.y);
  return letters;
};
