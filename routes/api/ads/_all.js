const router = require(`express`).Router();

const roomRentsRoutes = require(`./roomRents`),
  PlansRoutes = require("./plans"),
  PlansRoutes1 = require("./plans copy");

router.use(`/room-rents`, roomRentsRoutes);
router.use(`/ads-plan`, PlansRoutes);
router.use(`/ads-plan-copy`, PlansRoutes1);
module.exports = router;
