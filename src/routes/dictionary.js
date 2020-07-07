const router = require('express').Router();
const controller = require('../controllers/dictionary-controller');

router.post('/', controller.getTranslation);
router.get('/langs', controller.getLangs);

module.exports = router;
