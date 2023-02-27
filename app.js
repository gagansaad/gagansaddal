require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
    cors = require('cors'),
    app = express(),
    helmet = require(`helmet`),
    morgan = require(`morgan`),
    mongoose = require(`mongoose`),
    expressSession = require(`express-session`),
    MongoStore = require(`connect-mongo`);


// DB Setup
const signUp = require('./routes/accounts/client/signup_login')

const connection = require(`./config/dbConnection`);
connection(mongoose);

const loadHelmet = require(`./loaders/helmets`),
    loadExpressSession = require(`./loaders/expressSession`);


loadHelmet(app, helmet);
loadExpressSession(app, expressSession, MongoStore);

// body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/signUp',signUp);

// logging http activity
if (process.env.MODE.toLowerCase() === `dev`) {
    app.use(morgan("tiny",))
}


// Server setup
app.listen(process.env.PORT, () => console.log(`[ MENEHARIYA API ] on ${process.env.PORT}`));