import express from 'express';
import database from './database.js';
import bcrypt from 'bcrypt';

const router = express.Router();


// Login route
router.post('/login', (req, res) => {
    const { id, password } = req.body;

    // Check if user exists
    database.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error querying DB:', err.message);
            return res.sendStatus(500); // Internal Server Error
        }

        if (rows.length === 0) {
            // No user found with that ID
            return res.status(401).json({ success: false, message: 'Login has failed... user does not exist.😬' });
        }

        const user = rows[0];

        // Compare given password with hashed password from database
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.sendStatus(500); // Internal Server Error
            }

            // Logging for debugging purposes
            console.log("Input Password:", password); // Log input password
            console.log("Stored Password Hash:", user.password); // Log stored password hash

            if (!match) {
                // Passwords do not match
                return res.status(401).json({ success: false, message: 'Login has failed... wrong password😬' });
            }

            // Successful login
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


export default router;
