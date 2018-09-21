const express = require('express')
// const dotenv = require('dotenv').config() 
const app = express()
var cors = require('cors') 
// var request = require('request');

app.use(cors())

app.get('/api/callback', (req, res) => {
    console.log(req)
    console.log(req.query.access_token)
    res.send(req.query.access_token)
})

app.listen(3001, () => console.log('We gonna find some genres. 🎵'))