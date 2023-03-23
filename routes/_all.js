const router = require(`express`).Router(),
    apiRoutes = require(`./api/_all`);
   
router.use(`/v1/api/`, apiRoutes);

module.exports = router;