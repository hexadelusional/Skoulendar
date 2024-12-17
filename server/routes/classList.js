import express from 'express';
import database from './database.js';

const router = express.Router();

// Route to fetch class list for a specific student
router.get('/', (req, res) => {
    const studentId = req.query.student_id;

    if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required.' }); 
    }

    const query = `
        SELECT 
            cl.class_id, 
            l.lesson_id, 
            l.name AS lesson_name 
        FROM 
            class_list cl
        JOIN 
            lessons l ON cl.lesson_id = l.lesson_id
        WHERE 
            cl.student_id = ?;`; 

    database.query(query, [studentId], (error, results) => {
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

    if (!student_id || !lesson_id || !class_id) {
        return res.status(400).json({ message: 'student_id, lesson_id, and class_id are required.' });
    }

    const query = `INSERT INTO class_list (student_id, lesson_id, class_id) VALUES (?, ?, ?);`;

    database.query(query, [student_id, lesson_id, class_id], (error, results) => {
        if (error) {
            console.error('Error adding lesson to class_list:', error);
            return res.status(500).json({ message: 'Error adding lesson' });
        }
        if (results.affectedRows > 0) {
            res.status(201).json({ message: 'Lesson added successfully!' });
        } else {
            res.status(400).json({ message: 'Failed to add lesson due to unknown reason.' });
        }
    });
});

export default router;
