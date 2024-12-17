import express from 'express';
import database from './database.js';

const router = express.Router();

// Get homework for a specific student ensuring they are enrolled in a class that has homework
router.get('/', (req, res) => {
    const { student_id } = req.query;

    if (!student_id) {
        return res.status(400).json({ message: 'Student ID is required' });
    }

    // Query to fetch homework for the student, filtered by their enrollment in classes
    const query = `
        SELECT 
            h.id AS homework_id, 
            h.title, 
            h.description, 
            h.deadline, 
            h.class_id, 
            h.teacher_id, 
            hs.student_id AS completed_student_id, 
            hs.completed, 
            u.name AS student_name
        FROM 
            homework h
        JOIN 
            class_list cl ON h.class_id = cl.class_id
        LEFT JOIN 
            homework_status hs ON h.id = hs.homework_id AND hs.student_id = cl.student_id
        LEFT JOIN 
            users u ON hs.student_id = u.id
        WHERE 
            cl.student_id = ?
    `;

    // Fetch homework assignments based on the student_id
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
    const { title, description, deadline, class_id, teacher_id, lesson_id } = req.body;

    if (!lesson_id) {
        return res.status(400).json({ message: 'Lesson ID is required' });
    }

    const query = 'INSERT INTO homework (title, description, deadline, class_id, lesson_id, teacher_id) VALUES (?, ?, ?, ?, ?, ?)';
    
    database.query(query, [title, description, deadline, class_id, lesson_id, teacher_id], (error, results) => {
        if (error) {
            console.error('Error while assigning homework:', error);
            return res.status(500).json({ message: 'Error while assigning homework', error });
        }

        res.status(201).json({ message: 'Homework assigned successfully', id: results.insertId });
    });
});

// Route to update homework completion status
router.put('/update', (req, res) => {
    const { homeworkId, userId, completed } = req.body;

    if (homeworkId === undefined || userId === undefined || completed === undefined) {
        return res.status(400).json({ message: 'Required fields missing: homeworkId, userId, and completed' });
    }

    const query = `
        INSERT INTO homework_status (student_id, homework_id, completed)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE completed = ?;
    `;

    database.query(query, [userId, homeworkId, completed, completed], (error, results) => {
        if (error) {
            console.error('Error updating homework status:', error);
            return res.status(500).json({ message: 'Error updating homework status', error });
        }

        res.status(200).json({ message: 'Homework status updated successfully' });
    });
});

export default router;
