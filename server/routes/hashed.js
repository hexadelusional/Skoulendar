import bcrypt from 'bcrypt';
import database from './database.js';

const HASH_ROUNDS = 10;

export async function checkAndHashPasswords() { 
    return new Promise((resolve, reject) => {
        database.query('SELECT id, password FROM users', async (err, users) => {
            if (err) {
                console.error('Error fetching users from DB:', err.message);
                return reject(err);
            }

            for (const user of users) {
                const { id, password } = user;

                // Check if password needs hashing
                if (password && (password.length < 60 || !isPasswordHashed(password))) {
                    try {
                        const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);
                        await new Promise((resolve, reject) => {
                            database.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id], (err) => {
                                if (err) {
                                    console.error(`Error updating user ${id}:`, err.message);
                                    return reject(err);
                                }
                                resolve();
                            });
                        });
                        console.log(`User ${id}: password hashed and updated.`);
                    } catch (hashError) {
                        console.error(`Error hashing password for user ${id}:`, hashError.message);
                        return reject(hashError);
                    }
                }
            }
            resolve(); // All users processed
        });
    });
}

function isPasswordHashed(password) {
    return password.startsWith('\$2a$') || password.startsWith('\$2b$') || password.startsWith('\$2y$');
}
