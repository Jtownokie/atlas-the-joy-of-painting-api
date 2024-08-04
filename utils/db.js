// Mongoose Connection
import mongoose from 'mongoose';

export default function connectDB() {
  mongoose.connect("mongodb+srv://<username>:<password>@<database-cluster>/bob_ross_api?retryWrites=true&w=majority&appName=<appname>")
    .then(() => console.log('connected to database'))
    .catch(err => console.log(err));
}
