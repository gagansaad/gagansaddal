const router = require(`express`).Router();

const roomRentsRoutes = require(`./roomRents`),
    PlansRoutes = require("./plans");

router.use(`/room-rents`, roomRentsRoutes);
router.use(`/ads-plan`, PlansRoutes);

module.exports = router;