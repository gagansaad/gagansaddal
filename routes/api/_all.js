const router = require(`express`).Router();

const adsRoutes = require(`./ads/_all`);

router.use(`/ads`, adsRoutes);

module.exports = router;
