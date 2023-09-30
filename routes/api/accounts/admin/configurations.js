const router = require(`express`).Router(),
  controllers = require(`../../../../controllers/api/accounts/admin/configurations`);

router.post("/", controllers.postconfigurations);
router.post("/type", controllers.posttypeconfigurations);
router.get("/type", controllers.gettypeconfigurations);

module.exports = router;
