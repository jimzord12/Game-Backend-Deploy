const loadJsonFiles = require("../../utils/loadJsonFiles");
const path = require("path");
// Function to get a random integer between 0 and max (exclusive)
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateFiveRandomIntegers() {
  const numbers = new Set();

  while (numbers.size < 5) {
    const randomInt = Math.floor(Math.random() * 10); // Generates a number between 0 and 9
    numbers.add(randomInt);
  }

  return Array.from(numbers);
}

const quizQuestionsCntl = (req, res) => {
  const dataDirectory = path.join(__dirname, "..", "..", "quizQuestions");
  const jsonFiles = loadJsonFiles(dataDirectory);
  const randomMainTopicsIndexes = generateFiveRandomIntegers();
  let questions = [];

  randomMainTopicsIndexes.forEach((randCategory) => {
    // Ensure we only add up to 5 questions
    if (questions.length === 5) return;

    const selectedMainCategory = jsonFiles[randCategory];
    const mainTopic = selectedMainCategory.mainTopic;
    const randomSubtopicIndex = getRandomInt(
      selectedMainCategory.subtopics.length
    );
    const subtopic =
      selectedMainCategory.subtopics[randomSubtopicIndex].subtopic;
    const questionsKeys = Object.keys(
      selectedMainCategory.subtopics[randomSubtopicIndex].questions
    );
    const randomQuestionKey = questionsKeys[getRandomInt(questionsKeys.length)];
    const question =
      selectedMainCategory.subtopics[randomSubtopicIndex].questions[
        randomQuestionKey
      ];

    question.mainTopic = mainTopic;
    question.subtopic = subtopic;

    questions.push(question);
  });

  //   jsonFiles.forEach((file) => {
  //     const mainTopic = file.mainTopic;
  //     const randomSubtopicIndex = getRandomInt(file.subtopics.length);
  //     const subtopic = file.subtopics[randomSubtopicIndex].subtopic;
  //     const questionsKeys = Object.keys(
  //       file.subtopics[randomSubtopicIndex].questions
  //     );
  //     const randomQuestionKey = questionsKeys[getRandomInt(questionsKeys.length)];
  //     const question =
  //       file.subtopics[randomSubtopicIndex].questions[randomQuestionKey];

  //     // Enhance question object with mainTopic and subtopic
  //     question.mainTopic = mainTopic;
  //     question.subtopic = subtopic;

  //     questions.push(question);

  //     // Ensure we only add up to 5 questions
  //     if (questions.length === 5) return;
  //   });

  res.json(questions);
};

module.exports = quizQuestionsCntl;
