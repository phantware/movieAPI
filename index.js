const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')

const app = express()
dotenv.config()
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to mongoDB.')
  } catch (error) {
    throw error
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!')
})

app.use(express.json())
app.use('/api/auth', authRoute)

app.listen(8800, () => {
  connect()
  console.log('Connected to backend.')
})
