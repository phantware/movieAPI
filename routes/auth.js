const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')

//Register
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  })
  try {
    const user = await newUser.save()
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})

//Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json('Wrong Credential')
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8)
    if (originalPassword !== req.body.password) {
      return res.status(401).json('Wrong Credentials')
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: '5d' }
    )
    //extracting password
    const { password, ...info } = user._doc

    return res.status(200).json(...info, accessToken)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
