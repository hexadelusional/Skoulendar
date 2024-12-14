import express from 'express';
import database from './database.js';

const router = express.Router();

// Get all homework or homework for a specific class
router.get('/', (req, res) => {
    const { class_id } = req.query; // Get class_id from query parameters
    let query = 'SELECT * FROM homework';
    let queryParams = [];

    // If class_id is provided, filter the homework by class_id
    if (class_id) {
        query += ' WHERE class_id = ?';
        queryParams.push(class_id);
    }

    database.query(query, queryParams, (error, results) => {
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

export default router;
