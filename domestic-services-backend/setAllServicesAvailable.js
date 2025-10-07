// Script to set all services as available in MongoDB
import mongoose from 'mongoose';
import Service from './models/Service.js';
import dotenv from 'dotenv';
dotenv.config();

async function setAllServicesAvailable() {
  await mongoose.connect(process.env.MONGO_URI);
  await Service.updateMany({}, { available: true });
  console.log('All services set to available.');
  await mongoose.disconnect();
}

setAllServicesAvailable();
