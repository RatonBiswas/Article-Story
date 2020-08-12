//dashboard|auth|story

const express = require('express')

const {ensureAuth,ensureGuest} = require('../middleware/auth');
const Story = require('../models/Story');
const router = express.Router()



// ! @desc Login/Landing page
// ! @route Get/ 
router.get('/', ensureGuest, (req,res)=> { 
    res.render('login',{
        layout:'login',
    });
})


// ! @desc Dashboard
// ! @route Get/dashboard
router.get('/dashboard', ensureAuth, async(req,res)=>{

    try {
        const stories = await Story.find({user:req.user.id}).lean()
        res.render('dashboard',{
            name: req.user.firstName,
            stories
        });
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = router