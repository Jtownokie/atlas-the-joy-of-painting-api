// Defined Routes
import Episode from '../utils/models/episode.js';

// Routes Object
const routes = (app) => {
  // GET Primary Query (Month, Subject(s), Color(s))
  app.get('/episodes', async (req, res) => {
    const { month, colors, subjects } = req.query;

    try {
      const query = {};

      if (month) {
        query.month = month;
      }

      if (colors) {
        query.colors = { $all: colors.split(',') };
      }

      if (subjects) {
        query.subjects = { $all: subjects.split(',') };
      }

      const episodes = await Episode.find(query);
      res.status(200).send(episodes);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Data not found' });
    }
  });
};

// Export 
export default routes;
