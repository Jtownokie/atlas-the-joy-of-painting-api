import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  _id: String,
  title: String,
  source: String,
  month: String,
  subjects: [String],
  colors: [String]
});

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;
