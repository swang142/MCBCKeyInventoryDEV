import mysql from 'mysql2';
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(process.env.db, process.env.user, process.env.password, {
    host: process.env.host,       
    dialect: 'mariadb',           
    port: process.env.dbport
});

export default sequelize


