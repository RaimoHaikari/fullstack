const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});

/*
 * transformedResponse.map(({ drugName, ...rest }) => rest)

 */
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.blogs = returnedObject.blogs.map(({likes, user, ...blog}) => blog)


        delete returnedObject._id;
        delete returnedObject.__v;
        // (koodattua) salasanaa ei pidä paljastaa
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;