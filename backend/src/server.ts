/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './config';
import app from './app';
import { seedDefaultAdmin } from './DB';

async function main() {
  try {
    app.listen(config.PORT, () => {
      console.log(`server is running on port ${config.PORT} 🏃‍♂️‍➡️`);
    });
    await mongoose.connect(config.DB_URL as string);
    console.log('database connect success 🚀');
    await seedDefaultAdmin();
  } catch (error) {
    console.log(error);
  }
}

main();
