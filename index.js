'use strict'
const express = require('express')
const app = express()
const keys = require('./keys.js')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server started at port: ', PORT)
})