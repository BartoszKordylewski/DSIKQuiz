'use strict'
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'keys.json')
let keys = null

if (fs.existsSync(filePath)) {
  keys = JSON.parse(fs.readFileSync(filePath, 'utf8'))
} else {
  keys = {
    mongo: process.env.MONGO_KEY
  }
}

module.exports = keys;