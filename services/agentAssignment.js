const axios = require('axios');
const DeliveryAgent = require('../models/deliveryAgent.model');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.API_KEY;

async function assignNearestAgent(donorLat, donorLng) {
  const agents = await DeliveryAgent.findAll({ where: { is_available: true } });
  if (agents.length === 0) return null;

  const origin = `${donorLat},${donorLng}`;
  const destinations = agents.map(a => `${a.current_lat},${a.current_lng}`).join('|');

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations,
        key: GOOGLE_API_KEY,
      },
    });

    console.log('Full Google API response:', response.data);

    if (
      !response.data.rows ||
      !response.data.rows.length ||
      !response.data.rows[0].elements
    ) {
      console.error('Invalid response from Distance Matrix API:', response.data);
      return null;
    }

    const distances = response.data.rows[0].elements.map((el, i) => ({
      agent: agents[i],
      distanceValue: el.distance?.value || Number.MAX_SAFE_INTEGER,
      distanceText: el.distance?.text || '',
      durationText: el.duration?.text || '',
    }));

    const nearest = distances.reduce((prev, curr) =>
      curr.distanceValue < prev.distanceValue ? curr : prev
    );

    return {
      agent: nearest.agent,
      distanceText: nearest.distanceText,
      durationText: nearest.durationText,
    };

  } catch (err) {
    console.error('Error calling Distance Matrix API:', err.message);
    return null;
  }
}

module.exports = assignNearestAgent;
