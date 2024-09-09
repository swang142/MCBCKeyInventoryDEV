import { DataTypes } from "sequelize";
import sequelize from '../db/connection.js';

const Keyholder = sequelize.define('Keyholder', {
    HolderID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    HolderName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'keyholders',
    timestamps: false
})

export default Keyholder