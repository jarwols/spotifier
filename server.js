const express = require('express')
const dotenv = require('dotenv').config() 
const app = express()
var cors = require('cors') 
var request = require('request');

app.use(cors())

app.get('/callback', (req, res) => {
    res.send(req.query.access_token)
})

app.listen(3001, () => console.log('We gonna find some genres. 🎵'))