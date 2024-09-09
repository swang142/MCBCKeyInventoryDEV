import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const FacilityKey = sequelize.define('FacilityKey', {
  KeyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  KeyType: DataTypes.STRING,
  Zone: DataTypes.STRING,
  KeyUsage: DataTypes.STRING,
  KeyName: DataTypes.STRING,
  KeyDesc: DataTypes.STRING,
  KeyTag: DataTypes.STRING,
  TotalNumberOfKey: DataTypes.INTEGER,
  NumberOfSpareKey: DataTypes.INTEGER
}, {
  tableName: 'facilitykeys',
  timestamps: false
});

export default FacilityKey;
