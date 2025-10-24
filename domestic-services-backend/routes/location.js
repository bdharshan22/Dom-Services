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
    
    // Try multiple geocoding services
    let formattedAddress = null;
    
    // Try OpenStreetMap first
    try {
      const osmResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DomesticServices/1.0'
          }
        }
      );
      
      if (osmResponse.ok) {
        const osmData = await osmResponse.json();
        if (osmData.display_name) {
          formattedAddress = osmData.display_name;
        }
      }
    } catch (osmError) {
      console.log('OSM geocoding failed, trying alternative');
    }
    
    // Try alternative geocoding service if OSM fails
    if (!formattedAddress) {
      try {
        const altResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        
        if (altResponse.ok) {
          const altData = await altResponse.json();
          if (altData.locality || altData.city) {
            const parts = [];
            if (altData.locality) parts.push(altData.locality);
            if (altData.city) parts.push(altData.city);
            if (altData.principalSubdivision) parts.push(altData.principalSubdivision);
            if (altData.countryName) parts.push(altData.countryName);
            formattedAddress = parts.join(', ');
          }
        }
      } catch (altError) {
        console.log('Alternative geocoding also failed');
      }
    }
    
    res.json({
      address: formattedAddress || `Location: ${lat}, ${lng}`,
      coordinates: `${lat}, ${lng}`,
      success: !!formattedAddress
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