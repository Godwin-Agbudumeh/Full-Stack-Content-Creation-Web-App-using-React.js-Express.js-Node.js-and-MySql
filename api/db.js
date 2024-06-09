import mysql from "mysql2";
import 'dotenv/config';

export const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.db_password,
    database: process.env.database,
    waitForConnections: true,
    connectionLimit: 10
});