const axios = require('axios');

exports.getProjectsForGaza = async (req, res) => {
  try {
   const response = await axios.get('https://www.betterplace.org/api_v4/projects.json?q=gaza&page=1&locale=en');


    console.log('Betterplace response:', response.data);

    const allProjects = response.data.data; // Based on actual structure
    if (!Array.isArray(allProjects)) {
      return res.status(500).json({ error: 'Unexpected response structure from Betterplace' });
    }

    const gazaProjects = allProjects.filter(project =>
      (project.title?.toLowerCase().includes('gaza') ||
      project.description?.toLowerCase().includes('gaza'))&&
      project.donations_prohibited === false
    );

    res.status(200).json(gazaProjects);
  } catch (error) {
    console.error('Betterplace fetch error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to get projects from Betterplace' });
  }
};
