// Mongoose Connection
import mongoose from 'mongoose';

export default function connectDB() {
  mongoose.connect("mongodb+srv://jtownokie:H9knshJ49BvXXAro@files-manager-cluster.rqhsejc.mongodb.net/?retryWrites=true&w=majority&appName=Files-Manager-Cluster")
    .then(() => console.log('connected to database'))
    .catch(err => console.log(err));
}

