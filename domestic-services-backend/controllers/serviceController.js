import Service from "../models/Service.js";
// PATCH /api/services/:id/availability
export const toggleServiceAvailability = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    service.available = req.body.available;
    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET /api/services
export const getServices = async (_req, res) => {
  try {
    const items = await Service.find().sort({ createdAt: -1 });
    console.log(`getServices: found ${items.length} services`);
    if (items.length > 0) {
      console.log('getServices items:', items);
    }
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET /api/services/:id
export const getServiceById = async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Service not found" });
    res.json(doc);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// POST /api/services
export const addService = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const created = await Service.create({ name, description, price, category, image });
    res.status(201).json(created);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// PUT /api/services/:id
export const updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE /api/services/:id
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};