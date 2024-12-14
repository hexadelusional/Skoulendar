import express from 'express';
import database from './database.js';

const router = express.Router();

// Route to get classes for a specific student
router.get('/', (req, res) => {
    const studentId = req.query.student_id; // Get the student ID from query parameters

    const query = `
        SELECT classes.id, classes.name 
        FROM class_list 
        JOIN classes ON class_list.class_id = classes.id 
        WHERE class_list.student_id = ?
    `;

    database.query(query, [studentId], (error, results) => {
        if (error) {
            console.error('Error fetching classes for student:', error);
            return res.status(500).json({ message: 'Error fetching classes for student', error });
        }

        console.log('Results:', results); 
        res.json(results); 
    });
});

export default router;
