import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  _id: String,
  title: String,
  source: String,
  month: String,
  colors: [String],
  subjects: [String],
});

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;
