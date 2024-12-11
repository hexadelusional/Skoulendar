/* Run this file to create the tables of the Skoulendar database */

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    surname VARCHAR(50),
    password VARCHAR(100),
    status VARCHAR(10)
);

