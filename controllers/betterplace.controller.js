
const axios = require('axios');

exports.getProjectsForGaza = async (req, res) => {
  try {
    const response = await axios.get('https://www.betterplace.org/api_v4/projects.json');

    const gazaProjects = response.data.projects.filter(project =>
      project.title.toLowerCase().includes('gaza') ||
      project.description.toLowerCase().includes('gaza')
    );

    res.status(200).json(gazaProjects);
  } catch (error) {
    console.error('Betterplace fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get projects from Betterplace' });
  }
};
