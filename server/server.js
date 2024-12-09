import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sql from 'mysql2';
import database from './routes/database.js';
import authentication from './routes/authentication.js';
import users from './routes/users.js';


const app = express();

app.use(cors()); // Enable CORS for API
app.use(morgan('tiny')); // Log HTTP requests
app.use(express.json());

app.use('/api/auth', authentication); 
app.use('/api/users', users);

const PORT = 1234;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
