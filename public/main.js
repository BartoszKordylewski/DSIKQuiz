'use strict'
const $question = document.querySelector('#question')
const $yes = document.querySelector('#yes')
const $no = document.querySelector('#no')

let gameArray = []
let questionsCount
let currentQuestionIndex = -1
let answers = []
init()

function init() {
  axios.get('question')
  .then(({ data }) => {
    questionsCount = data
    gameArray = generateList()
    $yes.addEventListener('click', e => {
      gameArray[currentQuestionIndex].playerAnswer = 'TAK'
      checkAnswer(1, getNextQuestion)
    })
    
    $no.addEventListener('click', e => {
      gameArray[currentQuestionIndex].playerAnswer = 'NIE'
      checkAnswer(2, getNextQuestion)
    })
    getNextQuestion()
  })
  .catch(err => {
    console.error(err)
  })
}
function generateList() {
  const list = []
  for (let i = 0; i < questionsCount; i++) {
    list.push({
      questionIndex: i 
    })
  }
  function shuffleList(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }
  return shuffleList(list)
}

function checkAnswer(answer, cb) {
  axios.get(`answer/${gameArray[currentQuestionIndex].questionIndex}`)
  .then(({ data }) => {
    gameArray[currentQuestionIndex].trueAnswer = data
    gameArray[currentQuestionIndex].point = data == answer ? 1: 0
    cb()
  })
  .catch(err => {
    console.error(err)
  })
}

function getNextQuestion() {
  currentQuestionIndex++
  axios.get(`question/${gameArray[currentQuestionIndex].questionIndex}`)
  .then(({ data }) => {
    gameArray[currentQuestionIndex].question = data
    render()
  })
  .catch(err => {
    console.error(err)
  })
}

function render() {
  console.log(gameArray)
  $question.innerText = `${gameArray[currentQuestionIndex].questionIndex}. ${gameArray[currentQuestionIndex].question}`
}