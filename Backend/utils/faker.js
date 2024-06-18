const { faker } = require('@faker-js/faker');
const db = require('../config/postgres');

// Fonction pour générer des données utilisateur
function generateUserData() {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.person.jobTitle()
    };
}

// Fonction pour insérer des données dans la base de données
async function insertUserData(userData) {
    const query = `
        INSERT INTO "User" (firstname,lastname, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
    `;
    const values = [userData.firstName, userData.lastName , userData.email, userData.password, userData.role];
    try {
        const result = await db.query(query, values);
        console.log('Data inserted:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
}

// Fonction pour générer et insérer des données au démarrage de l'application
async function generateAndInsertData(numUsers) {
    const insertedUsers = [];
    for (let i = 0; i < numUsers; i++) {
        const userData = generateUserData();
        const insertedUser = await insertUserData(userData);
        insertedUsers.push(insertedUser);
    }
    return insertedUsers;
}

module.exports = generateAndInsertData;
