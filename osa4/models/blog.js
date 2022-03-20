const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

/*
 * 4.9*: blogilistan testit, step2
 * Tee testi, joka varmistaa että palautettujen blogien identifioivan kentän 
 * tulee olla nimeltään id.
 */
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.user.blogs;
      }    
});


module.exports = mongoose.model('Blog', blogSchema);