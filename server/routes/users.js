import express from 'express';
import database from './database.js'; 
import bcrypt from 'bcrypt';

const router = express.Router();

// fetching all users
router.get('/', (req, res) => {
    database.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

// editing users
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, surname, password, status } = req.body;

    try {
        let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const query = `
            UPDATE users
            SET name = ?, surname = ?, ${hashedPassword ? 'password = ?, ' : ''} status = ?
            WHERE id = ?
        `;
        
        const values = hashedPassword ? [name, surname, hashedPassword, status, id] : [name, surname, status, id];

        database.query(query, values, (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.status(200).json({ id, name, surname, status });
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

export default router;



