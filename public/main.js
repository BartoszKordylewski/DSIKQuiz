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
const $leaderboard = document.querySelector('#leaderboard')
const $submit = document.querySelector('#submit')
const $submit_wrapper = document.querySelector('#submit_wrapper')
const $nickname = document.querySelector('#nickname')
const $showleaderboard = document.querySelector('#showleaderboard')
const $back_button = document.querySelector('#back_button')
const $percentage = document.querySelector('#percentage')
const $pages = document.querySelector('#pages')
const $result_span = document.querySelector('#result')

let gameArray = []
let questionsCount
let currentQuestionIndex = -1

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
  $submit.addEventListener('click', e => {
    $submit_wrapper.classList.add('hidden')
    submitHighScore()
  })
  $leaderboard.addEventListener('click', e => {
    $leaderboard_box.classList.remove('hidden')
    $submit_wrapper.classList.remove('hidden')
    $results_box.classList.add('hidden')
  })
  $showleaderboard.addEventListener('click', e => {
    $leaderboard_box.classList.remove('hidden')
    $submit_wrapper.classList.add('hidden')
    $qanda_box.classList.add('hidden')
    showLeaderboard()
  })
  $back_button.addEventListener('click', e => {
    $leaderboard_box.classList.add('hidden')
    $qanda_box.classList.remove('hidden')
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
      gameArray[currentQuestionIndex].points = 1
      $correctanswer.innerText = 'poprawna odpowiedz'
    } else {
      gameArray[currentQuestionIndex].points = 0
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
  $pages.innerText = `${currentQuestionIndex + 1} / ${questionsCount}`
  $percentage.innerText = `${(calcPoints() / currentQuestionIndex * 100).toFixed(2)}%`
}

function showResults() {
  const results = gameArray.filter(el => el.playerAnswer != undefined)
  results.forEach(el => {
    let div = document.createElement('div')
    div.innerHTML += `<div>
    <p><b>${el.question}</b></p>
    <p>Twoja odpowiedź: ${el.playerAnswer}</p>
    <p>Poprawna odpowiedź: ${el.trueAnswer}</p>
    </div>`
    $results_box.appendChild(div)
  })
  $result_span.innerText = `
  twój wynik to ${calcPoints()} / ${currentQuestionIndex}
  ${(calcPoints() / currentQuestionIndex * 100).toFixed(2)}%
  `
  $results_box.classList.remove('hidden')
  $qanda_box.classList.add('hidden')
}

function submitHighScore() {
  axios.post('leaderboard', {
    nickname: $nickname.value,
    correct: calcPoints(),
    questions: currentQuestionIndex
  })
  .then(() => {
    gameArray = generateList()
    showLeaderboard()
  })
  .catch(err => {
    console.error(err)
  })
}

function calcPoints() {
  let sum = 0
  gameArray.forEach(el => {
    sum += el.points ? el.points : 0
  })
  return sum
}

function loadLeaderboard(cb) {
  axios.get('leaderboard')
  .then(({ data }) => {
    cb(data)
  })
  .catch(err => {
    console.error(err)
  })
}

function showLeaderboard() {
  loadLeaderboard(records => {
    records.sort((a, b) => {
      let ratio1 = a.questions ? a.correct / a.questions : 0
      let ratio2 = b.questions ? b.correct / b.questions : 0
      return  ratio1 > ratio2 ? -1 : ratio1 < ratio2 ? 1 : 0
    })
    let child = $leaderboard_box.querySelector('table')
    if (child) {
      $leaderboard_box.removeChild(child)
    }
    let table = document.createElement('div').appendChild(document.createElement('table'))
    table.innerHTML += `
      <thead>
      <th>nick</th>
      <th>poprawnych</th>
      <th>pytań</th>
      <th>ratio</th>
      <th>data</th>
      </tr>
      </thead>
    <tbody>`
    records.forEach(el => {
      table.innerHTML += `<tr>
      <td>${stripHTML(el.nickname)}</td>
      <td>${el.correct}</td>
      <td>${el.questions}</td>
      <td>${(el.correct / el.questions).toFixed(2)}</td>
      <td>${new Date(el.date).toLocaleString()}</td>
      </tr>`
    })
    table.innerHTML += `</tbody>`
    $leaderboard_box.appendChild(table)
  })
}

function stripHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}