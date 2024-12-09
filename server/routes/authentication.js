import express from 'express';
import database from './database.js'; 

const router = express.Router();

//login route
router.post('/login', (req, res) => {
    const { id, password } = req.body; 
    console.log('login for:', id, 'with password:', password);

    // if user exists in the database
    database.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error querying DB:', err.message);
            return res.sendStatus(500);
        }
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Login has failed.😬' });
        }
        const user = rows[0];

        // compare given password with database password
        if (password !== user.password) {
            return res.status(401).json({ success: false, message: 'Login has failed.😬' });
        }
        res.status(200).json({ success: true, user: { id: user.id, name: user.name, surname: user.surname } });
    });
});

// sign up route
router.post('/signup', (req, res) => {
    const { id, password, name, surname } = req.body; 
    database.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error querying DB:', err.message);
            return res.sendStatus(500);
        }

        if (rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Someone has already signed up with these credentials...😬' });
        }

        // insert new user into the database
        database.query('INSERT INTO users (id, password, name, surname) VALUES (?, ?, ?, ?)',
            [id, password, name, surname],
            (err) => {
                if (err) {
                    console.error('Error inserting into DB', err.message);
                    return res.sendStatus(500);
                }
                res.status(201).json({ success: true, message: 'You\'re all signed up!😁' });
            }
        );
    });
});

export default router;
