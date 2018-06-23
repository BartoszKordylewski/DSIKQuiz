'use strict'
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const keys = require('./keys')
const questions = require('./questions')
const Record = require('./record')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000

mongoose.connect(keys.mongo)
.then(result => {
  console.log("Connected to database");
})
.catch(err => {
  console.error(err);
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

app.get('/question', (req, res) => {
  return res.json(questions.length)
})

app.get('/question/:id', (req, res) => {
  const id = req.params.id
  if (id >= questions.length || id < 0) {
    return res.status(404)
  }
  return res.json(Object.keys(questions[id])[0])
})

app.get('/answer/:id', (req, res) => {
  const id = req.params.id
  if (id >= questions.length || id < 0) {
    return res.status(404)
  }
  const key = Object.keys(questions[id])[0]
  return res.json(questions[id][key])
})

app.get('/leaderboard', (req, res) => {
  Record.find()
  .then(data => {
    res.json(data.map(el => {
      return {
        date: el.date,
        correct: el.correct,
        questions: el.questions,
        nickname: el.nickname
      }
    }))
  })
  .catch(err => {
    console.error(err)
  })
})

app.post('/leaderboard', (req, res) => {
  let nick = req.body.nickname
  if (nick.length > 64) {
    nick = nick.substring(0, 64)
  }
  const newRecord = new Record({
    nickname: nick,
    correct: req.body.correct,
    questions: req.body.questions
  })
  newRecord.save()
  .then(result => {
    return res.sendStatus(200)
  })
  .catch(err => {
    console.error(err)
  })
})

app.listen(PORT, () => {
  console.log('Server started at port: ', PORT)
})