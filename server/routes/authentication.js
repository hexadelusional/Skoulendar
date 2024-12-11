import express from 'express';
import database from './database.js'; 
import bcrypt from 'bcrypt';


const router = express.Router();

// login route
router.post('/login', (req, res) => {
    const { id, password } = req.body;
    // check if user exists
    database.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error querying DB:', err.message);
            return res.sendStatus(500);
        }
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Login has failed.😬' });
        }
        const user = rows[0];
        // compare given password with hashed password from database
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.sendStatus(500);
            }
            if (!match) {
                return res.status(401).json({ success: false, message: 'Login has failed.😬' });
            }
            res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    surname: user.surname
                }
            });
        });
    });
});

// sign up route
router.post('/signup', (req, res) => {
    const { id, password, name, surname } = req.body;
    bcrypt.hash(password, 6, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err.message);
            return res.status(500).json({ success: false, message: 'Error processing request.' }); // Clear error message
        }
        database.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
            if (err) {
                console.error('Error querying DB:', err.message);
                return res.status(500).json({ success: false, message: 'Database error.' });
            }

            if (rows.length > 0) {
                return res.status(409).json({ success: false, message: 'User already exists.' });
            }
            database.query('INSERT INTO users (id, password, name, surname) VALUES (?, ?, ?, ?)',
                [id, hashedPassword, name, surname],
                (err) => {
                    if (err) {
                        console.error('Error inserting into DB', err.message);
                        return res.status(500).json({ success: false, message: 'Error saving user.' });
                    }
                    res.status(201).json({ success: true, message: 'You\'re all signed up!😁' });
                }
            );
        });
    });
});


export default router;
