const express = require('express');
const router = express.Router();

// Define your POST route for login
router.post('/login', (req, res) => {
    res.send({ message: `hello ${req.body.email} logged cacapipi` });
});

module.exports = router; // Export the router
