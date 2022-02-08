const mongoose = require('mongoose');

const saveNote = (person, url) => {

    mongoose.connect(url);
    person
        .save()
        .then(res => {
            let msg = `Added: '${res.name}', number: ${res.number} to database`;
            console.log(msg);
            mongoose.connection.close();
        });
};

const readNotes = (model, url) => {

    mongoose.connect(url);

    model
        .find({})
        .then(res => {

            let str = 'Phonebook\n';
            res.forEach(obj => {
                str = str + `${obj.name} ${obj.number}\n`;
            });

            console.log(str);



            mongoose.connection.close();
        });
};

/*
 * Skeema kertoo Mongooselle kuinka oliot tulee tallettaa tietokantaan
 */
const personSchema = {
    name: String,
    number: String
};

/*
 * Modelilla määritetään:
 * - kokoelma johon skeeman mukaiset oliot talletetaan
 * - olioiden talletus tapahtuu modelin avulla
 */
const Person = mongoose.model('Person', personSchema);

/**
 * Vähintään pitää löytyä kolme argumenttia, koska ohjelman toimiminen edellyttää,
 * että salasana syötetään kolmantena käynnistysargumenttina
 */
if(process.argv.length < 3) {
    console.log('Syötä salasana argumenttina');
    process.exit(1);
}

let dbName = 'mongo-puhelinluettelo';
let password = process.argv[2];

let url = `mongodb+srv://fullstack_2020:${password}@cluster0.dkwjc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

let person;

switch (process.argv.length) {

case 5:

    person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    saveNote(person,url);
    break;

case 3:

    readNotes(Person, url);
    break;

default:
    console.log('Parametrien määrä ei vastaa tehtävänantoa.');
    break;

}
