const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to:', url);

mongoose.connect(url)
    .then(res => {// eslint-disable-line no-unused-vars
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

/*
 * Skeema kertoo Mongooselle kuinka oliot tulee tallettaa tietokantaan
 *
 * - 3.19 Laajenna validaatiota siten, että tietokantaan talletettavan nimen on oltava pituudeltaan vähintään kolme merkkiä.
 */
const personSchema = new mongoose.Schema({
    name: {
        type : String,
        unique: true,
        required : true,
        minlength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[0-9]{2}-[0-9]{5,}$|^[0-9]{3}-[0-9]{4,}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        },
        unique: true
    }
});

/*
 * props => `${props.value} is not a valid phone number`
 * Muokataan tietokannan palauttaman objektin kentät frontEndin käyttämään muotoon
 * - poistetaan samalla kenttä, jota ei haluta välittää eteenpäin
 */
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

/*
 * Modelilla määritetään:
 * - kokoelma johon skeeman mukaiset oliot talletetaan
 * - olioiden talletus tapahtuu modelin avulla
 */
module.exports = mongoose.model('Person', personSchema);