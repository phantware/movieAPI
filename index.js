const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const movieRoute = require('./routes/movies')
const listRoute = require('./routes/lists')
const cors = require('cors')

// const bodyParser = require('body-parser')

const corsOption = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

// app.use(cors())
// app.use((req, res, next) => {
//   res.header(
//     'Access-Control-Allow-Headers, *, Access-Control-Allow-Origin: *',
//     'Origin, X-Requested-with, Content_Type,Accept,Authorization',
//     'http://localhost:3000'
//   )
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
//     return res.status(200).json({})
//   }
//   next()
// })

const app = express()
dotenv.config()
const PORT = process.env.PORT || 8800
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

//enables cors
// app.use(
//   cors({
//     allowedHeaders: ['sessionId', 'Content-Type'],
//     exposedHeaders: ['sessionId'],
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// )

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/movies', movieRoute)
app.use('/api/lists', listRoute)

app.get('/', (req, res) => {
  res.send('Welcome to movie API.')
})

app.listen(PORT, () => {
  connect()
  console.log('Connected to backend.')
})
