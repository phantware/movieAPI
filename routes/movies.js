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

//UPDATE

router.put('/:id', verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      return res.status(200).json(updateMovie)
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You are not allowed!')
  }
})

//DELETE

router.delete('/:id', verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id)
      return res.status(200).json('The movie has been deleted....')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You are not allowed!')
  }
})

//GET

router.get('/:id', verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    return res.status(200).json(movie)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router
