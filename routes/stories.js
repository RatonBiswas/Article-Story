//dashboard|auth|story

const express = require('express')

const {ensureAuth} = require('../middleware/auth');
const Story = require('../models/Story');
const router = express.Router()



// ! @desc Login/Landing page
// ! @route Get/ 
router.get('/add', ensureAuth, (req,res)=> { 
    res.render('stories/add');
})

module.exports = router