'use strict'
const $question = document.querySelector('#question')
const $yes = document.querySelector('#yes')
const $no = document.querySelector('#no')

let questionsCount
let randomList
init()

function init() {
  axios.get('question')
  .then(({ data }) => {
    questionsCount = data
    randomList = generateList()
    $yes.addEventListener('click', e => {
      checkAnswer(1, getNextQuestion)
    })
    
    $no.addEventListener('click', e => {
      checkAnswer(2, getNextQuestion)
    })
  })
  .catch(err => {
    console.error(err)
  })
}
function generateList() {
  const list = []
  for (let i = 0; i < questionsCount; i++) {
    list.push(i)
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
  
  cb()
}

function getNextQuestion() {

}