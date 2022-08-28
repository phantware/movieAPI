const { aggregate } = require('../models/List')
const List = require('../models/List')
const verify = require('../verifyToken')
const router = require('express').Router()

//CREATE

router.post('/', verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = List(req.body)
    try {
      const savedList = await newList.save()
      return res.status(201).json(savedList)
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
      await List.findByIdAndDelete(req.params.id)
      return res.status(201).json('The list has been deleted')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You are not allowed!')
  }
})

//GET

router.get('/', verify, async (req, res) => {
  const typeQuery = req.query.type
  const genryQuery = req.query.genry
  let list = []
  try {
    if (typeQuery) {
      if (genryQuery) {
        list = await aggregate([
          { $sample: { size: 10 } },
          { $math: { type: typeQuery, genre: genryQuery } },
        ])
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $math: { type: typeQuery } },
        ])
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }])
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})
module.exports = router
