import { DataTypes } from "sequelize";
import sequelize from '../db/connection.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    username: {
        type: DataTypes.STRING,
        allowNull: false
      },
    password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'users',
      timestamps: false
})

export default User