import express from 'express';
import database from './database.js'; 
import bcrypt from 'bcrypt';

const router = express.Router();

// Fetching all users with corresponding lesson names
router.get('/', (req, res) => {
    const query = `
        SELECT users.*, class_list.class_id, lessons.name AS lesson_name 
        FROM users 
        LEFT JOIN class_list ON users.id = class_list.student_id
        LEFT JOIN lessons ON class_list.lesson_id = lessons.lesson_id
    `;
    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        const usersWithClassesAndLessons = results.reduce((acc, result) => {
            const { id, name, surname, password, status, class_id, lesson_name } = result; 

            let user = acc.find(user => user.id === id);

            if (!user) {
                user = { id, name, surname, password, status, classes: [] };
                acc.push(user);
            }

            if (class_id) {
                user.classes.push({ class_id, lesson_name });
            }

            return acc;
        }, []);

        res.json(usersWithClassesAndLessons);
    });
});

// getting teachers
router.get('/teachers', (req, res) => {
    const query = `
        SELECT id, name, surname 
        FROM users 
        WHERE status = 'Teacher'
    `;

    database.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching teachers:', err.message);
            return res.status(500).json({ message: 'Error fetching teachers' });
        }

        // Return the list of teachers
        res.json(results);
    });
});

// to get lessons based on user id
router.get('/:id/lessons', (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT lessons.*, class_list.class_id
        FROM lessons
        INNER JOIN class_list ON lessons.lesson_id = class_list.lesson_id
        WHERE class_list.student_id = ? OR lessons.teacher_id = ?
    `;

    database.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching lessons for user:', err.message);
            return res.status(500).json({ message: 'Error fetching lessons' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No lessons found for this user' });
        }

        res.json(results);
    });
});

// Route to get user details by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT name, surname, id
        FROM users
        WHERE id = ?
    `;

    database.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user details:', err.message);
            return res.status(500).json({ message: 'Error fetching user details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    });
});

// editing users
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, surname, password } = req.body; 

    try {
        const queryParts = ['UPDATE users SET'];
        const values = [];
        const updates = [];

        // Only add the name if it is provided
        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        // Only add the surname if it is provided
        if (surname) {
            updates.push('surname = ?');
            values.push(surname);
        }

        // Only hash and include the password if it was provided
        if (password) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update.' });
        }

        queryParts.push(updates.join(', ')); 
        queryParts.push('WHERE id = ?'); 
        values.push(id); 

        const query = queryParts.join(' ');

        database.query(query, values, (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const updatedUserResponse = {
                id,
                ...(name && { name }),  // Return name if it was updated
                ...(surname && { surname }) // Return surname if it was updated
            };

            res.status(200).json(updatedUserResponse);
        });

    } catch (error) {
        console.error('Hashing error:', error);
        res.status(500).json({ message: 'Error hashing password' });
    }
});


// creating users
router.post('/', async (req, res) => {
    const { name, surname, password, status } = req.body;

    if (!name || !surname || !password || status === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, surname, password, status) VALUES (?, ?, ?, ?)';
        
        database.query(query, [name, surname, hashedPassword, status], (err, results) => {
            if (err) {
                console.error('Error adding user:', err.message);
                return res.status(500).json({ message: 'Error adding user' });
            }
            res.status(201).json({ id: results.insertId, name, surname, status }); 
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Error hashing password' });
    }
});


// deleting users
router.delete('/:id', (req, res) => {
    const { id } = req.params; 

    console.log(`Received request to delete user with ID: ${id}`); 

    database.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    });
});


// Searching users by name or surname
router.get('/search', (req, res) => {
    const { query } = req; 
    const nameOrSurname = query.nameOrSurname; 

    if (!nameOrSurname) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    const sqlQuery = `
        SELECT * FROM users 
        WHERE name LIKE ? OR surname LIKE ?`;
    
    const searchTerm = `%${nameOrSurname}%`;

    database.query(sqlQuery, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ message: 'Error fetching users' });
        }

        res.json(results);
    });
});


export default router;

