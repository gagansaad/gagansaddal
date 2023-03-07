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
const connection = require(`./config/dbConnection`);
connection(mongoose);


app.use(cors())

require(`./model/accounts/users`);
require(`./model/accounts/admin`);
require(`./model/otp`);

// DB Setup
const signUp = require('./routes/api/accounts/user');

const adminSignIp = require('./routes/accounts/admin/admin_login');

const loadHelmet = require(`./loaders/helmets`),
    loadExpressSession = require(`./loaders/expressSession`);


loadHelmet(app, helmet);
loadExpressSession(app, expressSession, MongoStore);

// body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req,res)=>{
    res.json({message: `msbdhsmb`})
});

app.use('/v1/api/', signUp);
app.use('/admin/login',adminSignIp);

// logging http activity
if (process.env.MODE.toLowerCase() === `dev`) {
    app.use(morgan("tiny",))
}

// Server setup
app.listen(process.env.PORT, () => console.log(`[ MENEHARIYA API ] on ${process.env.PORT}`));