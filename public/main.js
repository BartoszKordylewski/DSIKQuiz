'use strict'
const $question = document.querySelector('#question')
const $yes = document.querySelector('#yes')
const $no = document.querySelector('#no')
const $finish = document.querySelector('#finish')
const $qanda_box = document.querySelector('#qanda_box')
const $results_box = document.querySelector('#results_box')
const $leaderboard_box = document.querySelector('#leaderboard_box')
const $nextquestion = document.querySelector('#nextquestion')
const $correctanswer = document.querySelector('#correctanswer')

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
    assignEventListeners()
    getNextQuestion()
  })
  .catch(err => {
    console.error(err)
  })
}
function assignEventListeners() {
  $yes.addEventListener('click', e => {
    gameArray[currentQuestionIndex].playerAnswer = 'TAK'
    checkAnswer('TAK', showCorrectAnswer)
  })
  
  $no.addEventListener('click', e => {
    gameArray[currentQuestionIndex].playerAnswer = 'NIE'
    checkAnswer('NIE', showCorrectAnswer)
  })
  $finish.addEventListener('click', e => {
    showResults()
  })
  $nextquestion.addEventListener('click', e => {
    getNextQuestion()
    $correctanswer.classList.add('hidden')
    $nextquestion.classList.add('hidden')
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
    if (data == answer) {
      gameArray[currentQuestionIndex].point = 1
      $correctanswer.innerText = 'poprawna odpowiedz'
    } else {
      gameArray[currentQuestionIndex].point = 0
      $correctanswer.innerText = 'zła odpowiedz'
    }
    cb()
  })
  .catch(err => {
    console.error(err)
  })
}

function showCorrectAnswer() {
  $correctanswer.classList.remove('hidden')
  $nextquestion.classList.remove('hidden')
}

function getNextQuestion() {
  currentQuestionIndex++
  if (currentQuestionIndex >= gameArray.length) {
    return showResults()
  }
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
  $question.innerText = `${gameArray[currentQuestionIndex].questionIndex}. ${gameArray[currentQuestionIndex].question}`
}

function showResults() {
  const results = gameArray.filter(el => el.playerAnswer != undefined)
  let htmlString = ''
  results.forEach(el => {
    htmlString += `<div>
    <p>${el.question}</p>
    <p>Twoja odpowiedź: ${el.playerAnswer}</p>
    <p>Poprawna odpowiedź: ${el.trueAnswer}</p>
    </div>`
  })
  $results_box.innerHTML += htmlString
  $results_box.classList.remove('hidden')
  $qanda_box.classList.add('hidden')
}