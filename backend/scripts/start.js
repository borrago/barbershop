const waitForDB = require('./wait-for-db');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function start() {
  try {
    console.log('Starting backend...');
    
    // Wait for database to be ready
    const dbReady = await waitForDB();
    if (!dbReady) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Run migrations
    console.log('Running database migrations...');
    try {
      const { stdout, stderr } = await execAsync('node scripts/migrate.js');
      if (stderr) console.error('Migration warnings:', stderr);
      if (stdout) console.log('Migration output:', stdout);
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Error running migrations:', error.message);
      if (error.stdout) console.log('Migration stdout:', error.stdout);
      if (error.stderr) console.error('Migration stderr:', error.stderr);
      process.exit(1);
    }

    // Start the application
    console.log('Starting the application...');
    require('../src/index.js');
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

start(); 