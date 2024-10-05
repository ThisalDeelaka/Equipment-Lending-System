const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');


router.get('/data', dashboardController.getDashboardData);

module.exports = router;
