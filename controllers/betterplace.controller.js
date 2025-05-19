const axios = require('axios');
const  Project  = require('../models/project.model');

exports.syncProjectsFromBetterplace = async (req, res) => {
  try {
    const response = await axios.get('https://www.betterplace.org/api_v4/projects.json?q=gaza&page=1&locale=en');
    const allProjects = response.data.data;

    if (!Array.isArray(allProjects)) {
      return res.status(500).json({ error: 'Unexpected Betterplace response format' });
    }

    const gazaProjects = allProjects.filter(project =>
      (project.title?.toLowerCase().includes('gaza') ||
       project.description?.toLowerCase().includes('gaza')) &&
       project.donations_prohibited === false
    );

for (const p of gazaProjects) {
  await Project.upsert({
    id: p.id.toString(),
    title: p.title,
    short_description: p.summary,
    permalink: `https://www.betterplace.org/en/projects/${p.id}`,
    image_url: p.carrier?.picture?.links?.find(link => link.rel === 'original')?.href || null,
    donations_prohibited: p.donations_prohibited,
    organization_name: p.carrier?.name || null,
    created_at: new Date(p.start_date),
    updated_at: new Date(p.updated_at),
    country: p.location || null
  });
}


    res.status(200).json({ message: `${gazaProjects.length} projects synced.` });
  } catch (error) {
    console.error('Betterplace fetch error:', error.message);
    res.status(500).json({ error: 'Failed to sync projects from Betterplace' });
  }
};
exports.getAvailableProjectsFromDb = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects from DB:', error.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
