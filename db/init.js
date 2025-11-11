/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const initKnex = require('knex');

const knexfile = require('./knexfile');

console.log('Initializing database connection...');
console.log('Database client:', knexfile.client);
console.log('Has DATABASE_URL:', !!process.env.DATABASE_URL);
console.log('PGSSLMODE:', process.env.PGSSLMODE);

// Extract and log hostname for debugging (without credentials)
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Database hostname:', url.hostname);
    console.log('Database port:', url.port || '5432');
    console.log('Database name:', url.pathname.substring(1));
  } catch (err) {
    console.error('Failed to parse DATABASE_URL:', err.message);
  }
}

const knex = initKnex(knexfile);

(async () => {
  try {
    console.log('Running database migrations...');
    await knex.migrate.latest();
    console.log('Database migrations completed successfully');
    
    console.log('Running database seeds...');
    await knex.seed.run();
    console.log('Database seeds completed successfully');
  } catch (error) {
    console.error('Database initialization failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    process.exitCode = 1;
    throw error;
  } finally {
    knex.destroy();
  }
})();
