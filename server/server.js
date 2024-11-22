const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for your API
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Serve static files from the Vue app's dist directory
const distPath = path.join(__dirname, '../skoulendar/dist');
app.use(express.static(distPath));

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// API routes for login
const users = [{ IDnumber: 'number', password: 'password', email: 'caca@caca.com' }];

// API route for signup
app.post('/signup', (req, res) => {
    const { IDnumber, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!IDnumber || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the ID number is already taken
    const existingUser = users.find(u => u.IDnumber === IDnumber);
    if (existingUser) {
        return res.status(409).json({ message: 'ID number is already registered' });
    }

    // Add the new user
    users.push({ IDnumber, email, password });
    res.status(201).json({ message: 'You registered successfully' });
});

app.post('/logged', (req, res) => {
    const { IDnumber, password } = req.body;
    const user = users.find(u => u.IDnumber === IDnumber && u.password === password);
    
    if (user) {
        req.session.user = IDnumber;
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Check session
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'No session' });
    }
});

// Endpoint to retrieve the list of users (for debugging purposes)
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Catch-all Vue routes
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start the server
const PORT = 1234;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
