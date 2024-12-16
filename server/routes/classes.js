import express from 'express';
import database from './database.js'; // Import your database connection

const router = express.Router();

// Route to get all available classes
router.get('/', (req, res) => {
    const query = `
        SELECT lesson_id, class_id, name
        FROM classes;  
    `;

    database.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching classes:', error);
            return res.status(500).json({ message: 'Error fetching classes' });
        }

        res.json(results); // Return the list of classes
    });
});

// Export router to use it in your main app
export default router;
