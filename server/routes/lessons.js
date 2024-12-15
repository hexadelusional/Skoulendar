import express from 'express';
import database from './database.js';

const router = express.Router();

// Route to get lessons for a specific teacher
router.get('/', (req, res) => {
    const teacherId = req.query.teacher_id; // Get teacher ID from query params

    // Validate teacherId
    if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required' });
    }
    
    // Prepare a query to select lessons for the specified teacher
    const query = 'SELECT * FROM lessons WHERE teacher_id = ?';
    
    database.query(query, [teacherId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching lessons', error });
        }

        res.json(results);
    });
});

export default router;
