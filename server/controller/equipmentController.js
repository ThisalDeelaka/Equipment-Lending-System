const Equipment = require('../models/equipment');

// Create new equipment
exports.createEquipment = async (req, res) => {
  const { name, type, condition, status } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Get the image URL from the uploaded file, if provided

  try {
    const newEquipment = new Equipment({
      name,
      type,
      condition,
      status,
      imageUrl, // Store the image path in the database
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json({ equipment: savedEquipment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create equipment', error });
  }
};

// Get equipment by ID
exports.getEquipment = async (req, res) => {
  const { id } = req.params;

  try {
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json({ equipment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch equipment', error });
  }
};

// Get all equipment
exports.getEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.status(200).json({ equipments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch equipment', error });
  }
};

// Update equipment by ID
exports.updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, type, condition, status } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Get the new image URL if a new image is uploaded

  try {
    const updatedData = {
      name,
      type,
      condition,
      status,
    };

    if (imageUrl) {
      updatedData.imageUrl = imageUrl; // Update the image if a new one was uploaded
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEquipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json({ equipment: updatedEquipment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update equipment', error });
  }
};

// Delete equipment by ID
exports.deleteEquipment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(id);
    if (!deletedEquipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete equipment', error });
  }
};
