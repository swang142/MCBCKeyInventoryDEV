import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const AccessCode = sequelize.define('AccessCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'access_codes',
  timestamps:  true,
  createdAt: 'created_at',
  updatedAt: false
});

export default AccessCode;
