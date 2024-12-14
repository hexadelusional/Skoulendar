import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sql from 'mysql2';
import database from './routes/database.js';
import authentication from './routes/authentication.js';
import users from './routes/users.js';
import { checkAndHashPasswords } from './routes/hashed.js'; 


const app = express();

app.use(cors()); // Enable CORS for API
app.use(morgan('tiny')); // Log HTTP requests
app.use(express.json());

app.use('/api/auth', authentication); 
app.use('/api/users', users);

checkAndHashPasswords()
    .then(() => {
        console.log('Password check and hash process completed.');
        
        // Start server only after checking passwords
        const PORT = 1234;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error during password check/update:', err);
        // Optionally, you might choose to stop server start if there's an error
    });