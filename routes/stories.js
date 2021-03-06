//dashboard|auth|story

const express = require('express')
const {
    ensureAuth
} = require('../middleware/auth');
const Story = require('../models/Story');
const router = express.Router()



// ! @desc Show add page
// ! @route Get/stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
})


// ! @desc Show single page
// ! @route Get/stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean();
        if (!story) {
            return res.render('error/404')
        }
        res.render('stories/show', {
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})


// ! @desc process the add form
// ! @route POST/stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        // console.log(stories);
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})


// ! @desc Show stories page
// ! @route Get/stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story
            .find({
                status: 'public'
            })
            .populate('user')
            .sort({
                createdAt: -1
            })
            .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')

    }
})

// ! @desc Show edit page
// ! @route Get/stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            return res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
        }
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }

})

// ! @desc Update story
// ! @route put/stories/id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({
                _id: req.params.id
            }, req.body, {
                new: true,
                runValidators: true,
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }

})

// ! @desc delete story
// ! @route delete/stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({
            _id: req.params.id
        })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

// ! @desc list of user story 
// ! @route Get/stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
                user: req.params.userId,
                status: 'public'
            })
            .populate('user')
            .lean()
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

// ! @desc search any content 
// ! @route Get/stories/search
router.post('/search', ensureAuth, async (req, res) => {
    try {
        const {
            search
        } = req.body;
        const stories = await Story.find({
            $or: [{
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    status: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'user.displayName': {
                        $regex: search,
                        $options: 'i'
                    }
                },
            ],
            status: 'public'
        }).populate('user').sort({
            createdAt: -1
        }).lean();
        console.log(stories);
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})


module.exports = router