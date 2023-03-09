require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
    cors = require('cors'),
    app = express(),
    helmet = require(`helmet`),
    morgan = require(`morgan`),
    mongoose = require(`mongoose`),
    centralErrorHandlers = require(`./utils/centralErrorHandlers`),
    expressSession = require(`express-session`),
    MongoStore = require(`connect-mongo`);


// DB Setup
const connection = require(`./config/dbConnection`);
connection(mongoose);


app.use(cors())

require(`./model/accounts/users`);
require(`./model/accounts/admin`);
require(`./model/otp`);

// configuration
require(`./model/configurations/privacy`);
require(`./model/configurations/termAndCondition`);

// DB Setup
const signUp = require('./routes/api/accounts/user');

const adminSignIp = require('./routes/accounts/admin/admin_login');
const usercontrol = require('./routes/accounts/admin/users_control');

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
app.use('/api/admin/users',usercontrol);

// logging http activity
if (process.env.MODE.toLowerCase() === `dev`) {
    app.use(morgan("tiny",))
}

// add the error handler middleware function to the app
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        
        // handle the error in a custom way
        res.status(400).send({ 
            status: 400,
            error: 'Invalid JSON'
         });
    }
});

// Error handling
// handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message:'Sorry,end point found.'
    });
});



// Error handling
// for (let key in centralErrorHandlers) {
//     app.use(centralErrorHandlers[key]);
// }

// Server setup
app.listen(process.env.PORT, () => console.log(`[ MENEHARIYA API ] on ${process.env.PORT}`));