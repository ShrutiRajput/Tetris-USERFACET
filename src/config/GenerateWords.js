export const wordsAdjustedPerFrequency = (sentence) => {
  // Split the sentence into words
  const wordsArray = sentence?.split(" ");

  // Count the frequency of each word in the provided sentence
  const wordCount = {};
  wordsArray.forEach((word) => {
    const normalizedWord = word.toLowerCase(); // Normalize to lowercase for counting
    if (wordCount[normalizedWord]) {
      wordCount[normalizedWord]++;
    } else {
      wordCount[normalizedWord] = 1;
    }
  });

  // Create an array of words adjusted by frequency
  const adjustedWordsArray = [];
  Object.entries(wordCount).forEach(([word, count]) => {
    for (let i = 0; i < count; i++) {
      adjustedWordsArray.push(word);
    }
  });

  return shuffleArray(adjustedWordsArray);
};

const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
