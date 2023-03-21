const router = require(`express`).Router();

const roomRentsRoutes = require(`./roomRents`)

router.use(`/room-rents`, roomRentsRoutes);

module.exports = router;