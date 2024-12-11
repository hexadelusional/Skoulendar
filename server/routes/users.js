import express from 'express';
import database from './database.js'; 

const router = express.Router();

router.get('/', (req, res) => {
    database.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

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

// for editing user
router.put('/:id', (req, res) => {
    const { id } = req.params; 
    const { name, surname, password } = req.body; 

    database.query(
        'UPDATE users SET name = ?, surname = ?, password = ? WHERE id = ?',
        [name, surname, password, id],
        (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.status(200).json({ id, name, surname, password });
        }
    );
});


export default router;
