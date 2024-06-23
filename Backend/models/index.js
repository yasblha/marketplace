'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Read all model files and import them into Sequelize
fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
          file.indexOf('.') !== 0 && // Ignore hidden files
          file !== basename && // Ignore this file
          file.slice(-3) === '.js' && // Only import .js files
          file.indexOf('.test.js') === -1 // Ignore test files
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

// Associate models if the associate function exists
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Add sequelize instance to db object
db.Sequelize = Sequelize; // Add Sequelize class to db object

module.exports = db; // Export the db object
