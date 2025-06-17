
require('dotenv').config(); // Load .env variables
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // spiffy_production_db 
  process.env.DB_USER,     // prasanna
  process.env.DB_PASSWORD, // Prasanna@spiffy 
  {
    host: process.env.DB_HOST, // 147.93.97.20
    port: process.env.DB_PORT, // 5432
    dialect: 'postgres',
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
})();

module.exports = sequelize;


