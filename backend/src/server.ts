/* eslint-disable no-console */
import config from './config';
import app from './app';
import { seedDefaultAdmin } from './DB';
import { connectDB } from './DB/connect';

async function main() {
  try {
    await connectDB();
    console.log('database connect success');
    await seedDefaultAdmin();

    app.listen(config.PORT, () => {
      console.log(`server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
