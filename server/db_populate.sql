/* Clear existing data */
DELETE FROM homework_status;
DELETE FROM homework;
DELETE FROM class_list;
DELETE FROM lessons;
DELETE FROM users;

/* Insert data into `users` table */
INSERT INTO users (id, name, surname, password, status) VALUES
(1, 'Adele', 'Chamoux', '160305', "Admin"),
(2, 'Elodie', 'Duflaut', '050304', "Admin"),
(3, 'Coline', 'Sorin', '151104', "Student"),
(4, 'Iri', 'Rasoloarivalona', '161616', "Student"),
(5, 'Paul', 'Leflon', '252525', "Student"),
(6, 'Matteo', 'Launay', '121314', "Student"),
(7, 'Valentin', 'Lebras', '123456', "Student"),
(8, 'Zahraa', 'Mohsen', '56789', "Teacher"),
(9, 'Elias', 'Hatem', '98137', "Teacher"),
(10, 'Clara', 'Boissier', '98720', "Teacher"),
(11, 'Nicolas', 'Flasque', '66331', "Teacher"),
(12, 'Christina', 'Dias', '90877', "Teacher");

/* Insert data into `lessons` table */
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time) VALUES
(1, 'SM503', 'Calculus', 8, '08:00:00', 101, '01:30:00'),           -- 1 hour 30 minutes
(2, 'SM402', 'Multivariate Analysis', 8, '10:00:00', 101, '02:00:00'),  -- 2 hours
(3, 'SM601', 'Graph Theory', 8, '10:00:00', 101, '01:45:00'),         -- 1 hour 45 minutes
(4, 'TI402', 'General Electricity', 9, '09:00:00', 102, '02:00:00'), -- 2 hours
(5, 'TI609', 'From the Atom to the Microchip', 9, '17:00:00', 102, '02:30:00'), -- 2 hours 30 minutes
(6, 'TI702', 'Modern Physics', 9, '17:00:00', 102, '01:45:00'), -- 1 hour 45 minutes
(7, 'FH601', 'Communication skills', 10, '13:00:00', 103, '01:00:00'), -- 1 hour
(8, 'TI505', 'Java Programming', 11, '10:00:00', 104, '02:00:00'), -- 2 hours
(9, 'TI507', 'Web Programming', 11, '16:00:00', 110, '01:30:00'), -- 1 hour 30 minutes
(10, 'FL102', 'English second years', 12, '10:00:00', 105, '01:15:00'), -- 1 hour 15 minutes
(11, 'FL101', 'English first years', 12, '13:00:00', 105, '01:00:00'); -- 1 hour


/* Insert data into `class_list` table */
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(3, 1, 'SM503'),  -- Coline Sorin enrolled in Calculus (lesson_id = 1)
(3, 10, 'FL102'),  -- Coline Sorin enrolled in English second years (lesson_id = 10)
(4, 3, 'SM601'),  -- Iri Rasoloarivalona enrolled in Graph Theory (lesson_id = 3)
(4, 5, 'TI609'),  -- Iri Rasoloarivalona enrolled in From the Atom to the Microchip (lesson_id = 5)
(5, 7, 'FH601'),  -- Paul Leflon enrolled in Communication skills (lesson_id = 7)
(5, 9, 'TI507'),  -- Paul Leflon enrolled in Web Programming (lesson_id = 9)
(6, 4, 'TI402'),  -- Matteo Launay enrolled in General Electricity (lesson_id = 4)
(6, 8, 'TI505'),  -- Matteo Launay enrolled in Java Programming (lesson_id = 8)
(7, 11, 'FL101'); -- Valentin Lebras enrolled in English first years (lesson_id = 11)


/* Insert data into `homework` table */
INSERT INTO homework (id, title, description, deadline, class_id, lesson_id, teacher_id) VALUES
(1, 'Taylor series', "Solve the 10 last finite expansion problems.", '2024-12-20', 'SM503', 1, 8),  -- Calculus (lesson_id = 1, teacher_id = 8)
(2, 'Physics Lab Report', "Write a report about resistance in a circuit.", '2024-12-22', 'TI402', 4, 9),  -- General Electricity (lesson_id = 4, teacher_id = 9)
(3, 'Dossier Thematique', "Complete the thematic essay on Montaigne.", '2024-12-25', 'FH601', 7, 10);  -- Communication skills (lesson_id = 7, teacher_id = 10)

/* Insert data into `homework_status` table */
INSERT INTO homework_status (student_id, homework_id, completed) VALUES
(3, 1, TRUE),
(4, 2, FALSE),
(5, 3, TRUE);
