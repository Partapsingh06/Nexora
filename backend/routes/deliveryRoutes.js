const express = require('express');
const router = express.Router();

// Indian major postal circle regions map for realistic data
const PINCODE_REGIONS = {
  '11': { city: 'New Delhi', state: 'Delhi', speed: 'Next Day Express (within 24 Hours)', cod: true },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana', speed: 'Next Day Express (within 24 Hours)', cod: true },
  '14': { city: 'Ludhiana / Jalandhar', state: 'Punjab', speed: 'Express (1-2 Days)', cod: true },
  '16': { city: 'Chandigarh / Mohali', state: 'Punjab / UT', speed: 'Express (1-2 Days)', cod: true },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', speed: 'Next Day Express (within 24 Hours)', cod: true },
  '30': { city: 'Jaipur', state: 'Rajasthan', speed: 'Express (2 Days)', cod: true },
  '38': { city: 'Ahmedabad', state: 'Gujarat', speed: 'Express (1-2 Days)', cod: true },
  '40': { city: 'Mumbai', state: 'Maharashtra', speed: 'Next Day Express (within 24 Hours)', cod: true },
  '41': { city: 'Pune', state: 'Maharashtra', speed: 'Express (1-2 Days)', cod: true },
  '50': { city: 'Hyderabad', state: 'Telangana', speed: 'Next Day Express (within 24 Hours)', cod: true },
  '56': { city: 'Bengaluru', state: 'Karnataka', speed: 'Same Day / Next Day Express', cod: true },
  '60': { city: 'Chennai', state: 'Tamil Nadu', speed: 'Express (1-2 Days)', cod: true },
  '70': { city: 'Kolkata', state: 'West Bengal', speed: 'Express (2 Days)', cod: true },
  '78': { city: 'Guwahati', state: 'Assam', speed: 'Standard Air (3-4 Days)', cod: true },
  '80': { city: 'Patna', state: 'Bihar', speed: 'Express (2-3 Days)', cod: true },
};

// @desc    Check PIN code serviceability, delivery speed, and COD availability
// @route   GET /api/delivery/check-pincode?pincode=XXXXXX
// @access  Public
router.get('/check-pincode', (req, res) => {
  const { pincode } = req.query;

  if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 6-digit Indian PIN code.',
    });
  }

  const prefix = pincode.trim().slice(0, 2);
  const region = PINCODE_REGIONS[prefix] || {
    city: 'Covered Area',
    state: 'India',
    speed: 'Standard Express (2-4 Business Days)',
    cod: true,
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + (prefix === '56' || prefix === '11' || prefix === '40' ? 1 : 2));
  const estimatedDateStr = tomorrow.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return res.status(200).json({
    success: true,
    data: {
      pincode: pincode.trim(),
      city: region.city,
      state: region.state,
      isServiceable: true,
      deliverySpeed: region.speed,
      estimatedDelivery: `Expected by ${estimatedDateStr}, 8 PM`,
      freeDeliveryThreshold: '₹499',
      shippingCharge: 0,
      codAvailable: region.cod,
      courierPartner: 'Nexora Express & BlueDart Air',
      openBoxDelivery: true,
    },
  });
});

module.exports = router;
