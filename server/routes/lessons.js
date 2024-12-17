import express from 'express';
import database from './database.js';

const router = express.Router();

// Route to get all lessons, optionally filtered by teacher ID
router.get('/', (req, res) => {
    const teacherId = req.query.teacher_id; 

    const query = teacherId
        ? 'SELECT * FROM lessons WHERE teacher_id = ?'
        : 'SELECT * FROM lessons';

    database.query(query, teacherId ? [teacherId] : [], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching lessons', error });
        }

        res.json(results);
    });
});

// Route to add a new lesson
router.post('/', (req, res) => {
    const { class_id, name, teacher_id, time, room_number, duration_time, lesson_date } = req.body;
    if (!class_id || !name || !teacher_id || !time || !room_number || !duration_time || !lesson_date) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const query = `
        INSERT INTO lessons (class_id, name, teacher_id, time, room_number, duration_time, lesson_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    database.query(query, [class_id, name, teacher_id, time, room_number, duration_time, lesson_date], (error, results) => {
        if (error) {
            console.error('Error adding lesson:', error);
            return res.status(500).json({ message: 'Error adding lesson', error });
        }

        res.status(201).json({ message: 'Lesson added successfully', lesson_id: results.insertId });
    });
});

// Route to update a lesson by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { class_id, name, teacher_id, time, room_number, duration_time, lesson_date } = req.body;

    if (!class_id || !name || !teacher_id || !time || !room_number || !duration_time || !lesson_date) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = `
        UPDATE lessons
        SET class_id = ?, name = ?, teacher_id = ?, time = ?, room_number = ?, duration_time = ?, lesson_date = ?
        WHERE lesson_id = ?`;

    database.query(query, [class_id, name, teacher_id, time, room_number, duration_time, lesson_date, id], (error, results) => {
        if (error) {
            console.error('Error updating lesson:', error);
            return res.status(500).json({ message: 'Error updating lesson', error });
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Lesson updated successfully' });
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    });
});

// Route to delete a lesson by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params; 

    const query = 'DELETE FROM lessons WHERE lesson_id = ?';

    database.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting lesson:', error);
            return res.status(500).json({ message: 'Error deleting lesson', error });
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Lesson deleted successfully' });
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    });
});

export default router;
