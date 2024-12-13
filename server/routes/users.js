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
    const { name, surname, password } = req.body;  // Removed status from destructuring

    try {
        // Hash the password only if it is provided
        let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Build the update query
        const queryParts = ['UPDATE users SET name = ?, surname = ?,'];
        const values = [name, surname];
        
        // Conditional inclusion of hashed password
        if (hashedPassword) {
            queryParts.push('password = ?'); // Add password update part
            values.push(hashedPassword); // Add hashed password to values
        }

        // Always add the WHERE clause 
        queryParts.push('WHERE id = ?'); 
        values.push(id);  // Include the user ID 

        const query = queryParts.join(' '); // Join without the trailing comma

        // Execute the update query
        database.query(query, values, (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Responding back with the updated user info (excluding status)
            res.status(200).json({ id, name, surname });
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
    const { query } = req; // Extract query parameters from the request
    const nameOrSurname = query.nameOrSurname; // Use `nameOrSurname` as the search parameter

    // If no search term is provided, return an error
    if (!nameOrSurname) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    // SQL query to search for users by name or surname
    const sqlQuery = `
        SELECT * FROM users 
        WHERE name LIKE ? OR surname LIKE ?`;
    
    // Escaping the user input to prevent SQL injection
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

