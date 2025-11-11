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
