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
