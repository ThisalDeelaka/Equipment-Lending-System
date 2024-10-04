const express = require('express');
const router = express.Router();
const equipmentController = require('../controller/equipmentController');
const multer = require('multer');
const path = require('path');

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Store images in 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the file uniquely with current timestamp
  },
});

// Set up the multer middleware with the storage configuration
const upload = multer({ storage: storage });

// Route to create new equipment with image upload
router.post('/add-equipment', upload.single('image'), equipmentController.createEquipment);

// Route to get a specific equipment by ID
router.get('/getEquipment/:id', equipmentController.getEquipment);

// Route to get all equipment
router.get('/getEquipment', equipmentController.getEquipments);

// Route to update equipment by ID (including image upload)
router.put('/upequipment/:id', upload.single('image'), equipmentController.updateEquipment);

// Route to delete equipment by ID
router.delete('/delequipment/:id', equipmentController.deleteEquipment);

module.exports = router;
