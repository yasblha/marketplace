const fs = require("fs");
const path = require("path");
const readFile = require("util").promisify(fs.readFile);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    try {
      const queryPath = path.resolve(__dirname, "../queries/createTable.sql");
      const query = await readFile(queryPath, "utf8");
      await queryInterface.sequelize.query(query);
    } catch (err) {
      console.error("Unable to create tables: ", err);
      return Promise.reject(err); // Rejetez explicitement la promesse
    }
  },
  down: async (queryInterface) => {
    try {
      const queryPath = path.resolve(__dirname, "../queries/drop.sql");
      const query = await readFile(queryPath, "utf8");
      await queryInterface.sequelize.query(query);
    } catch (err) {
      console.error("Unable to drop tables: ", err);
      return Promise.reject(err); // Rejetez explicitement la promesse
    }
  },
};
