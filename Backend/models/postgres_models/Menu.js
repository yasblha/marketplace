import { DataTypes } from 'sequelize';
import sequelize from '../../config/postgres.js';

const Section = sequelize.define('Section', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Section',
    timestamps: false,
});



export default Section;
