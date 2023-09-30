const router = require(`express`).Router(),
  controllers = require(`../../controllers/admin/configuration`);

router.post(`/create-configurations_abouts`, controllers.create_aconfiguration);
router.post(`/create-configurations_terms`, controllers.create_tconfiguration);
router.post(
  `/create-configurations_privacy`,
  controllers.create_pconfiguration
);
router.get(`/get-configurations`, controllers.get_configuation);

module.exports = router;
