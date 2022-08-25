const Movie = require('../models/Movie')
const verify = require('../verifyToken')
const router = require('express').Router()

//CREATE

router.post('/', verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = Movie(req.body)
    try {
      const savedMovie = await newMovie.save()
      return res.status(201).json(savedMovie)
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You are not allowed!')
  }
})

module.exports = router
