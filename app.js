const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
app.use('/api/user', authRoute)
app.use('/api/posts', postsRoute)

mongoose.connect(process.env.DB_CONNECTOR)

app.listen(3009, ()=>{
    console.log('Server is running')
})