'use strict'
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'questions.json')

const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))

module.exports = questions;