const Service = require("../Models/Service_Model");

// GET /api/services  (public)
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort("price");
    res.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/services  (admin)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Name and price are required" });
    }

    const service = await Service.create({
      name,
      description,
      price,
      duration,
    });

    res.status(201).json({
      success: true,
      message:"Services create Successfully",
      data:service
    });
    
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/services/:id  (admin)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      message:"Services Updated Successfully",
      data:service
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/services/:id  (admin - soft delete)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deactivated Successfully"});
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};

