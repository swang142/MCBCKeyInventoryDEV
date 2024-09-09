import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const FacilityKeyTransaction = sequelize.define('FacilityKeyTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  HolderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  KeyID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  HolderID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TransactionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TransactionTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Count: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'facilitykeytransactions',
  timestamps: false
});

export default FacilityKeyTransaction;
