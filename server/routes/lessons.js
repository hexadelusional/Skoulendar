import express from 'express';
import database from './database.js';

const router = express.Router();

// Route to get lessons
router.get('/', (req, res) => {
    const query = 'SELECT * FROM lessons';
    database.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching lessons', error });
        }
        res.json(results);
    });
});

export default router;
