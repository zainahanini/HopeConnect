const axios = require('axios');

const GNEWS_API_KEY = "e4ccc173f6c651ce2e4be200dab42cae";  

exports.getOrphansInGazaNews = async (req, res) => {
  try {

    const response = await axios.get(`https://gnews.io/api/v4/search?q=orphan OR orphans gaza&lang=en&max=10&apikey=${GNEWS_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    console.error("news fetch error!:", err.message);
    res.status(500).json({ error: 'failed to get news' });
  }
};
