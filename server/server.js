const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); 
const routes = require('./routes');

const app = express();

app.use(cors()); // Enable CORS for API
app.use(morgan('tiny')); // Log HTTP requests
app.use(bodyParser.json());

const PORT = 1234;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
