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
const $openreport = document.querySelector('#openreport')
const $report_box = document.querySelector('#report_box')
const $report_message = document.querySelector('#report_message')
const $report = document.querySelector('#report')
const $closereport = document.querySelector('#closereport')
const $question_report = document.querySelector('#question_report')
const $openreport2 = document.querySelector('#openreport2')
const $report_ans = document.querySelector('#report_ans')
const $prev = document.querySelector('#prev')
const $next = document.querySelector('#next')

let gameArray = []
let questionsCount
let currentQuestionIndex = -1
let reportIndex
let canPlay = true
const characters = [
  ['t', 'T', '1', 'p', 'P', 'a', 'A'],
  ['f', 'F', '2', 'd', 'D']
]

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
    if (canPlay) {
      canPlay = false
      gameArray[currentQuestionIndex].playerAnswer = 'TAK'
      checkAnswer('TAK', showCorrectAnswer)
    }
  })
  $no.addEventListener('click', e => {
    if (canPlay) {
      canPlay = false
      gameArray[currentQuestionIndex].playerAnswer = 'NIE'
      checkAnswer('NIE', showCorrectAnswer)
    }
  })
  $finish.addEventListener('click', e => {
    showResults()
  })
  $nextquestion.addEventListener('click', e => {
    getNextQuestion()
    $correctanswer.classList.add('hidden')
    $nextquestion.classList.add('hidden')
    canPlay = true
  })
  $submit.addEventListener('click', e => {
    $submit_wrapper.classList.add('hidden')
    submitHighScore()
  })
  $leaderboard.addEventListener('click', e => {
    canPlay = false
    $leaderboard_box.classList.remove('hidden')
    $submit_wrapper.classList.remove('hidden')
    $results_box.classList.add('hidden')
    $qanda_box.classList.add('hidden')
  })
  $showleaderboard.addEventListener('click', e => {
    canPlay = false
    $leaderboard_box.classList.remove('hidden')
    $submit_wrapper.classList.add('hidden')
    $qanda_box.classList.add('hidden')
    $results_box.classList.add('hidden')
    showLeaderboard()
  })
  $back_button.addEventListener('click', e => {
    canPlay = true
    gameArray = generateList()
    currentQuestionIndex = -1
    getNextQuestion()
    $nextquestion.classList.add('hidden')
    $leaderboard_box.classList.add('hidden')
    $qanda_box.classList.remove('hidden')
  })
  $openreport.addEventListener('click', e => {
    canPlay = false
    $report_box.classList.remove('hidden')
    $qanda_box.classList.add('hidden')
    $question_report.innerText = `
      ${gameArray[reportIndex].questionIndex}. ${gameArray[reportIndex].question}`
    $report_ans.innerText = `
    twoja odpowiedź ${gameArray[reportIndex].playerAnswer}
    poprawna odpowiedź ${gameArray[reportIndex].trueAnswer}`
  })
  $openreport2.addEventListener('click', e => {
    canPlay = false
    $report_box.classList.remove('hidden')
    $qanda_box.classList.add('hidden')
    $question_report.innerText = `
      ${gameArray[reportIndex].questionIndex}. ${gameArray[reportIndex].question}`
    $report_ans.innerText = `
      twoja odpowiedź ${gameArray[reportIndex].playerAnswer}
      poprawna odpowiedź ${gameArray[reportIndex].trueAnswer}`
  })
  $closereport.addEventListener('click', e => {
    canPlay = true
    $report_box.classList.add('hidden')
    $qanda_box.classList.remove('hidden')
  })
  $report.addEventListener('click', sendReport)
  $prev.addEventListener('click', e => {
    if (reportIndex > 0) {
      reportIndex--
    }
    $question_report.innerText = `
      ${gameArray[reportIndex].questionIndex}. ${gameArray[reportIndex].question}`
    $report_ans.innerText = `
      twoja odpowiedź ${gameArray[reportIndex].playerAnswer}
      poprawna odpowiedź ${gameArray[reportIndex].trueAnswer}`
  })
  $next.addEventListener('click', e => {
    if (reportIndex < currentQuestionIndex) {
      reportIndex++
    }
    $question_report.innerText = `
      ${gameArray[reportIndex].questionIndex}. ${gameArray[reportIndex].question}`
    $report_ans.innerText = `
      twoja odpowiedź ${gameArray[reportIndex].playerAnswer}
      poprawna odpowiedź ${gameArray[reportIndex].trueAnswer}`
  })
  document.body.addEventListener('keypress', e => {
    if (canPlay) {
      let key = String.fromCharCode(e.keyCode)
      if (characters[0].includes(key)) {
        canPlay = false
        gameArray[currentQuestionIndex].playerAnswer = 'TAK'
        checkAnswer('TAK', showCorrectAnswer)
      } else if (characters[1].includes(key)) {
        canPlay = false
        gameArray[currentQuestionIndex].playerAnswer = 'NIE'
        checkAnswer('NIE', showCorrectAnswer)
      }
    } else {
      getNextQuestion()
      $correctanswer.classList.add('hidden')
      $nextquestion.classList.add('hidden')
      if (currentQuestionIndex < gameArray.length)
        canPlay = true
    }
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
      $correctanswer.innerText = 'poprawna odpowiedź'
    } else {
      gameArray[currentQuestionIndex].points = 0
      $correctanswer.innerText = 'zła odpowiedź'
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
  if (currentQuestionIndex >= gameArray.length - 1) {
    canPlay = false
    return showResults()
  }
  currentQuestionIndex++
  reportIndex = currentQuestionIndex
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
  twój wynik to ${calcPoints()} / ${currentQuestionIndex + 1}
  ${(calcPoints() / (currentQuestionIndex + 1) * 100).toFixed(2)}%
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
      let ratio1 = a.questions ? a.correct / a.questions : -1
      let ratio2 = b.questions ? b.correct / b.questions : -1
      if (ratio1 > ratio2) {
        return -1
      }
      if (ratio1 < ratio2) {
        return 1
      }
      if (a.questions > b.questions) {
        return -1
      }
      if (a.questions < b.questions) {
        return 1
      }
      return 0
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

function sendReport() {
  axios.post('report', {
    message: $report_message.value,
    question: gameArray[reportIndex].questionIndex
  })
  .then(result => {
    $report_box.classList.add('hidden')
    $qanda_box.classList.remove('hidden')
    canPlay = true
  })
  .catch(err => {
    console.error(err)
  })
}

function stripHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}