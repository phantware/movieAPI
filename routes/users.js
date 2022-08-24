const User = require('../models/User')
const verify = require('../verifyToken')
const router = require('express').Router()

//UPDATE

router.put('/:id', verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString()
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      return res.status(200).json(updatedUser)
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You can update only your account')
  }
})

//DELETE

router.delete('/:id', verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id)
      return res.status(200).json('User has been deleted...')
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You can delete only your account')
  }
})

//GET

router.get('/find/:id', async (req, res) => {
  try {
    const user = await User.findBy(req.params.id)
    const { password, ...info } = user._id
    return res.status(200).json(info)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET ALL

router.get('/', verify, async (req, res) => {
  const query = req.query.new
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find()
      return res.status(200).json(users)
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('You not allowed to see all users!')
  }
})

module.exports = router
