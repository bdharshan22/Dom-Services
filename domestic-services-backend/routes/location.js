import express from 'express';

const router = express.Router();

// Reverse geocoding endpoint
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`);
    const data = await response.json();
    
    res.json({
      address: data.display_name || `${lat}, ${lng}`,
      coordinates: `${lat}, ${lng}`
    });
  } catch (error) {
    res.json({
      address: `${req.query.lat}, ${req.query.lng}`,
      coordinates: `${req.query.lat}, ${req.query.lng}`
    });
  }
});

export default router;