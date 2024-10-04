const express = require('express');
const router = express.Router();

const { createEquipment, getEquipment, getEquipments, updateEquipment, deleteEquipment } = require('../controller/equipmentController');

// Route to create a new equipment
router.post('/add-equipment', createEquipment);

// Route to get equipment by ID
router.get('/getEquipment/:id', getEquipment);

// Route to get all equipment
router.get('/getEquipment', getEquipments);

// Route to update equipment by ID
router.put('/upequipment/:id', updateEquipment);

// Route to delete equipment by ID
router.delete('/delequipment/:id', deleteEquipment);

module.exports = router;
