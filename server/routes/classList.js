import express from 'express';
import database from './database.js';

const router = express.Router();



// In your classList.js
router.get('/', (req, res) => {
    const query = `SELECT * FROM class_list`; // Ensure this actually fetches lesson IDs and supply data.
    
    database.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching lessons:', error);
            return res.status(500).json({ message: 'Error fetching lessons.' });
        }
        res.json(results);
    });
});



// Route to add a class for a student
router.post('/', (req, res) => {
    const { student_id, lesson_id, class_id } = req.body;

    // Validate that all required fields are present
    if (!student_id || !lesson_id || !class_id) {
        return res.status(400).json({ message: 'student_id, lesson_id, and class_id are required.' });
    }

    const query = `INSERT INTO class_list (student_id, lesson_id, class_id) VALUES (?, ?, ?)`;
    
    database.query(query, [student_id, lesson_id, class_id], (error, results) => {
        if (error) {
            console.error('Error adding lesson to class_list:', error);
            return res.status(500).json({ message: 'Error adding lesson' });
        }

        // Provide more descriptive messaging
        if (results.affectedRows > 0) {
            res.status(201).json({ message: 'Lesson added successfully' });
        } else {
            res.status(400).json({ message: 'Failed to add lesson due to unknown reason.' });
        }
    });
});

export default router;
