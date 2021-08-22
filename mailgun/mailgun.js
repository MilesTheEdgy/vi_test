const mailgun = require("mailgun-js");
const dotenv = require('dotenv');

dotenv.config();
process.env.MAILGUN_API_KEY;

const DOMAIN = 'info.obexport.com';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN, host: "api.eu.mailgun.net"});

module.exports = mg