/*
 * - ympäristömuuttujien lukeminen tiedostosta
 */
require('dotenv').config();

let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_NAME = process.env.DB_NAME;
let PORT = process.env.PORT;

module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    PORT
}