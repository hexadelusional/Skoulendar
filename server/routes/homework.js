import express from 'express';
import database from './database.js';

const router = express.Router();

// Get all homework or homework for a specific class, including completion status
router.get('/', (req, res) => {
    const { student_id } = req.query; // Get student_id from query parameters

    if (!student_id) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    // Your query to fetch homework for the student, including completion status
    const query = `
        SELECT h.id AS homework_id, h.title, h.description, h.due_date, h.class_id, h.teacher_id, 
               hs.student_id, hs.completed, u.name AS student_name
        FROM homework h
        LEFT JOIN homework_status hs ON h.id = hs.homework_id
        LEFT JOIN users u ON hs.student_id = u.id
        LEFT JOIN class_list cl ON h.class_id = cl.class_id
        WHERE cl.student_id = ?
    `;

    database.query(query, [student_id], (error, results) => {
        if (error) {
            console.error('Error fetching homework:', error);
            return res.status(500).json({ message: 'Error fetching homework', error });
        }

        res.status(200).json(results);
    });
});


// Route to post new homework
router.post('/', (req, res) => {
    const { title, description, due_date, class_id, teacher_id } = req.body;
    const query = 'INSERT INTO homework (title, description, due_date, class_id, teacher_id) VALUES (?, ?, ?, ?, ?)';

    database.query(query, [title, description, due_date, class_id, teacher_id], (error, results) => {
        if (error) {
            console.error('Error while assigning homework:', error);
            return res.status(500).json({ message: 'Error while assigning homework', error });
        }

        res.status(201).json({ message: 'Homework assigned successfully', id: results.insertId });
    });
});

// Route to update homework completion status
router.put('/update', (req, res) => {
    const { homeworkId, studentId, completed } = req.body;

    if (homeworkId === undefined || studentId === undefined || completed === undefined) {
        return res.status(400).json({ message: 'Required fields missing: homeworkId, studentId, and completed' });
    }

    const query = `
        INSERT INTO homework_status (student_id, homework_id, completed) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE completed = ?;
    `;

    database.query(query, [studentId, homeworkId, completed, completed], (error, results) => {
        if (error) {
            console.error('Error updating homework status:', error);
            return res.status(500).json({ message: 'Error updating homework status', error });
        }

        res.status(200).json({ message: 'Homework status updated successfully' });
    });
});

export default router;
