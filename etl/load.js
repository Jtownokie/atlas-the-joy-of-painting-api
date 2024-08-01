// Load objects into database
import connectDB from '../utils/db.js';
import objectArray from './transform.js';
import Episode from '../utils/models/episode.js';

connectDB();

Episode.insertMany(objectArray)
  .then(() => {
    console.log("Data Insertion Complete");
  }).catch((err) => {
    console.error(err);
  });
