/* Run this file to create the tables of the Skoulendar database */

CREATE TABLE users IF NOT EXISTS(
    id INT PRIMARY KEY,
    name VARCHAR(50),
    password VARCHAR(20),
    surname VARCHAR(50)
);

