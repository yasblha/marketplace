// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgres');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    reset_token: {
        type: DataTypes.STRING,
    },
    reset_token_expiry: {
        type: DataTypes.DATE,
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'Clients',
    timestamps: false,
});

User.getUsers = async () => {
    return User.findAll();
};

User.getUser = async (email, password) => {
    return User.findOne({
        where: {
            email: email,
            password: password,
        },
    });
};

User.getUserById = async (id) => {
    return User.findByPk(id);
};

User.createUser = async ({ firstname, lastname, email, password, role }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            confirmed: false,
        });

        return newUser;
    } catch (error) {
        throw error;
    }
};


User.updateUser = async (id, updates) => {
    const { firstname, lastname, email, role } = updates;

    return User.update({
        firstname,
        lastname,
        email,
        role,
    }, {
        where: {
            id: id,
        },
    });
};

User.deleteUser = async (id) => {
    return User.destroy({
        where: {
            id: id,
        },
    });
};

User.getUserByEmail = async (email) => {
    return User.findOne({
        where: {
            email: email,
        },
    });
};

User.updateUserByEmail = async (email, updates) => {
    const { reset_token, reset_token_expiry } = updates;

    return User.update({
        reset_token,
        reset_token_expiry,
    }, {
        where: {
            email: email,
        },
    });
};

User.updateUserByToken = async (token, updates) => {
    const { confirmed, password, reset_token, reset_token_expiry } = updates;

    return User.update({
        confirmed,
        password,
        reset_token,
        reset_token_expiry,
    }, {
        where: {
            // Changer la condition selon votre modèle de données
            // Ici, nous supposons que vous avez une colonne `confirmation_token`
            // pour gérer la confirmation de compte et la réinitialisation du mot de passe.
            [sequelize.Op.or]: [
                { confirmation_token: token },
                { reset_token: token },
            ],
        },
    });
};

module.exports = User;
