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

require(`./model/accounts/users`);
require(`./model/accounts/admin`);
require(`./model/otp`);

// post
require(`./model/posts/Types`);
require(`./model/posts/roomRents`);
//Event
require(`./model/posts/event`)

// configuration
require(`./model/configurations/privacy`);
require(`./model/configurations/termAndCondition`);
require(`./model/plan/plan`);
require(`./model/plan/plan copy`);
require(`./model/posts/jobs`);
require(`./model/posts/buy&sell`);
require(`./model/posts/bizAndServices`);
require(`./model/posts/babbysitter & nannis`);
require(`./model/image/image`);
require(`./model/posts/payment_logs`);
require('./model/posts/tagline')
require(`./model/posts/adsCategories`);
require('./model/posts/adsSubCategories')
// admin configuration
require(`./model/accounts/admin/configuration`);


app.use(cors())
// DB Setup
const signUp = require('./routes/api/accounts/user');

const adminSignIp = require('./routes/accounts/admin/admin_login');
const adminconfigurationsRoute = require('./routes/api/accounts/admin/configurations');
const adminconfigurationsRoute2 = require('./routes/api/accounts/admin/configurations copy');
const dashboardRoute = require('./routes/admin/dashboard');
const usercontrol = require('./routes/accounts/admin/users_control');
const configurationsRoute = require('./routes/api/configurations');

const adminconfigurationsRoute1 = require('./routes/admin/configurations');

const postTypeRoutes = require('./routes/api/ads/types');
const roomRentsRoutes = require('./routes/api/ads/roomRents');
const bizRoutes = require('./routes/api/ads/bizAndServices');
const jobsRoutes = require('./routes/api/ads/jobs');
const buySellRoutes = require('./routes/api/ads/buysell');
const babysitterRoutes = require('./routes/api/ads/babbysitter & nannis');
const eventRoutes = require(`./routes/api/ads/event`)
const paymentRoutes = require(`./routes/api/ads/payment`)
const AllAdsRoutes = require(`./routes/api/ads/fetchAllAds`)
const All_Tags = require(`./routes/api/ads/tagline`)
//admin
const adsCategoriesRoutes = require('./routes/admin/categories');
const adsSubCategoriesRoutes = require('./routes/admin/sub_categories');
const adminroomRentsRoutes = require('./routes/admin/roomRents');
const adminbizRoutes = require('./routes/admin/bizAndServices');
const adminjobsRoutes = require('./routes/admin/jobs');
const adminbuySellRoutes = require('./routes/admin/buysell');
const adminbabysitterRoutes = require('./routes/admin/babbysitter & nannis');
const admineventRoutes = require(`./routes/admin/event`)
//
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

app.use('/v1/api/configurations', configurationsRoute);
app.use('/admin/v1/api/configurations1', adminconfigurationsRoute);
app.use('/admin/v1/api/configurations', adminconfigurationsRoute1);
app.use('/admin/v1/api/configurations', adminconfigurationsRoute2);
app.use('/admin/v1/api/ads/dashboard',dashboardRoute);
app.use('/admin/v1/api/ads/room-rents',adminroomRentsRoutes);
app.use('/admin/v1/api/ads/biz',adminbizRoutes);
app.use('/admin/v1/api/ads/jobs',adminjobsRoutes);
app.use('/admin/v1/api/ads/buysell',adminbuySellRoutes);
app.use('/admin/v1/api/ads/babysitter',adminbabysitterRoutes);
app.use('/admin/v1/api/ads/events',admineventRoutes);
app.use('/admin/v1/api/ads/categories',adsCategoriesRoutes);
app.use('/admin/v1/api/ads/sub-categories',adsSubCategoriesRoutes);

app.use('/v1/api/posts/', All_Tags);
app.use('/v1/api/posts/types', postTypeRoutes);
app.use('/v1/api/posts/room-rents', roomRentsRoutes);
app.use('/v1/api/posts/events',eventRoutes);
app.use('/v1/api/posts/jobs', jobsRoutes);
app.use('/v1/api/posts/buysell', buySellRoutes);
app.use('/v1/api/posts/babysitter', babysitterRoutes);
app.use('/v1/api/posts/biz', bizRoutes);
app.use('/v1/api/posts/payment', paymentRoutes)
app.use('/v1/api/posts/ads', AllAdsRoutes)
// logging http activity
if (process.env.MODE.toLowerCase() === `dev`) {
    app.use(morgan("tiny",))
}


// Routes
const routes = require(`./routes/_all`);
app.use(routes);

// add the error handler middleware function to the app
app.use((err, req, res, next) => {
    console.log(err)
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
        message:'Sorry,end point not found.'
    });
});


// Error handling
// for (let key in centralErrorHandlers) {
//     app.use(centralErrorHandlers[key]);
// }

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ error: 'seriously something went wrong ' });
});


// Server setup
app.listen(process.env.PORT, () => console.log(`[ MENEHARIYA API ] on ${process.env.PORT}`));