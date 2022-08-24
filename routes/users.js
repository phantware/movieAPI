const User = require('../models/User')
const router = require('express').Router()

router.get('/', async (req, res) => {
  const users = await User.findAll()

  res.status(200).json(users)
})

module.exports = router
