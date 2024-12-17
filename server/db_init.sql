CREATE DATABASE IF NOT EXISTS skoulendar;

DROP TABLE IF EXISTS skoulendar.homework_status;
DROP TABLE IF EXISTS skoulendar.class_list;
DROP TABLE IF EXISTS skoulendar.homework;
DROP TABLE IF EXISTS skoulendar.lessons;
DROP TABLE IF EXISTS skoulendar.users;
DROP TABLE IF EXISTS skoulendar.classes;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS lessons (
    lesson_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    class_id VARCHAR(5),
    name VARCHAR(255) NOT NULL,
    teacher_id INT NOT NULL,
    time TIME,
    room_number INT NOT NULL,
    duration_time TIME NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS class_list (
    student_id INT NOT NULL,
    lesson_id INT NOT NULL,
    class_id VARCHAR(5) NOT NULL,
    PRIMARY KEY (student_id, lesson_id, class_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS homework (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    deadline DATE NOT NULL,
    lesson_id INT NOT NULL,
    class_id VARCHAR(5) NOT NULL,
    teacher_id INT NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS homework_status (
    student_id INT NOT NULL,
    homework_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (student_id, homework_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (homework_id) REFERENCES homework(id) ON DELETE CASCADE
);

-- New table for class database
CREATE TABLE IF NOT EXISTS classes (
    lesson_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id VARCHAR(5) NOT NULL
);


DELIMITER //

CREATE TRIGGER before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.name = TRIM(NEW.name);
    SET NEW.surname = TRIM(NEW.surname);
    SET NEW.password = TRIM(NEW.password);
    SET NEW.status = TRIM(NEW.status);
END; //

CREATE TRIGGER before_update_users
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.name = TRIM(NEW.name);
    SET NEW.surname = TRIM(NEW.surname);
    SET NEW.password = TRIM(NEW.password);
    SET NEW.status = TRIM(NEW.status);
END; //

CREATE TRIGGER before_insert_homework
BEFORE INSERT ON homework
FOR EACH ROW
BEGIN
    SET NEW.title = TRIM(NEW.title);
    SET NEW.description = TRIM(NEW.description);
END; //

CREATE TRIGGER before_update_homework
BEFORE UPDATE ON homework
FOR EACH ROW
BEGIN
    SET NEW.title = TRIM(NEW.title);
    SET NEW.description = TRIM(NEW.description);
END; //

DELIMITER ;
