import express from 'express';
import database from './database.js'; // Ensure you have set this up correctly

const router = express.Router();

// GET all users API route
router.get('/', (req, res) => { // Change from '/users' to '/'
    database.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message); // Log error
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results); // Return users in JSON format
    });
});

export default router;
