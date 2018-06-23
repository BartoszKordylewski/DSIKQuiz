'use strict'
const path = require('path')
const express = require('express')
const app = express()
const keys = require('./keys')
const questions = require('./questions')

const PORT = process.env.PORT || 3000

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

app.listen(PORT, () => {
  console.log('Server started at port: ', PORT)
})