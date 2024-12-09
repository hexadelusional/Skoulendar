import mysql from 'mysql2';

const database = mysql.createConnection({
    host: 'localhost',
    database: 'skoulendar',
    user: 'root',
    password: 'root'
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