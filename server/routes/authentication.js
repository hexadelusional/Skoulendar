import express from 'express';
import database from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken package

const router = express.Router();

// Secret key for JWT - make sure to keep this secret
const SECRET_KEY = 'your_secret_key'; // Ideally, set this in an environment variable

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
                return res.status(401).json({ success: false, message: 'Login has failed... wrong password😬' });
            }

            // Successful login, generate a token
            const token = jwt.sign({ id: user.id, status: user.status }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    status: user.status,
                },
            });
        });
    });
});

export default router;
