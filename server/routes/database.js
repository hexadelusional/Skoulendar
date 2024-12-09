import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const database = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});


database.connect((err) => {
    if (err) {
        console.error('Error connecting to DB:', err.message); 
        return;
    } else {
        console.log('Connected to DB');
    }
});

export default database;