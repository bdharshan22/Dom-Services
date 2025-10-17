import express from 'express';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Location service is working!' });
});

// Reverse geocoding endpoint
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    console.log(`Fetching address for coordinates: ${lat}, ${lng}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DomesticServices/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geocoding response:', data);
    
    // Format a more readable address
    let formattedAddress = data.display_name;
    if (data.address) {
      const addr = data.address;
      const parts = [];
      if (addr.house_number) parts.push(addr.house_number);
      if (addr.road) parts.push(addr.road);
      if (addr.neighbourhood) parts.push(addr.neighbourhood);
      if (addr.suburb) parts.push(addr.suburb);
      if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
      if (addr.state) parts.push(addr.state);
      if (addr.postcode) parts.push(addr.postcode);
      
      if (parts.length > 0) {
        formattedAddress = parts.join(', ');
      }
    }
    
    res.json({
      address: formattedAddress || `${lat}, ${lng}`,
      coordinates: `${lat}, ${lng}`,
      success: true
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    res.json({
      address: `${req.query.lat}, ${req.query.lng}`,
      coordinates: `${req.query.lat}, ${req.query.lng}`,
      success: false,
      error: 'Could not fetch address'
    });
  }
});

export default router;