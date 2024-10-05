const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');


router.get('/getAll', reportController.getEquipmentUsageReport);

module.exports = router;
