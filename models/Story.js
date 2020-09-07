const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A story must have a title'],
        trim: true
    },
    body: {
        type: String,
        required: [true, 'A story must have a body']
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Story = mongoose.model('Story', StorySchema);
module.exports = Story;