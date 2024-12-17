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
(8, 'Assila', 'Ait Said', '210668', 'Student'),
(9, 'Romuald', 'Amrein', '104970', 'Student'),
(10, 'Luc', 'Ayeto', '177373', 'Student'),
(11, 'Mathis', 'Berger', '208950', 'Student'),
(12, 'Thibault', 'Beurotte', '208970', 'Student'),
(13, 'Camille', 'Chen', '206430', 'Student'),
(14, 'Guillaume', 'Cottura', '206470', 'Student'),
(15, 'Camille', 'Dommergue', '206620', 'Student'),
(16, 'Samuel', 'Doyen', '206640', 'Student'),
(17, 'Tiphaine', 'Fournier', '206730', 'Student'),
(18, 'Alexandre', 'Gobé', '218950', 'Student'),
(19, 'Ethan', 'Guingand', '211570', 'Student'),
(20, 'John', 'Jin', '213010', 'Student'),
(21, 'Josselin', 'Keib', '212190', 'Student'),
(22, 'Soulamaine', 'Laarissi', '219300', 'Student'),
(23, 'Tom', 'Sancesario', '306990', 'Student'),
(24, 'Maxime', 'Tang', '207630', 'Student'),
(25, 'Nicolas', 'Zhang', '209520', 'Student'),
(26, 'Clara', 'Boissier', '987200', 'Teacher'),
(27, 'Nicolas', 'Flasque', '663310', 'Teacher'),
(28, 'Christina', 'Dias', '908770', 'Teacher'),
(29, 'Zahraa', 'Mosen', '229900', 'Teacher'),
(30, 'Ziad', 'Adem', '987530', 'Teacher');

/* Insert data into `lessons` table */
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time) VALUES
(1, 'SM503', 'Calculus', 29, '08:00:00', 101, '01:30:00'),           -- 1 hour 30 minutes
(2, 'SM402', 'Multivariate Analysis', 29, '10:00:00', 101, '02:00:00'),  -- 2 hours
(3, 'SM601', 'Graph Theory', 29, '10:00:00', 101, '01:45:00'),         -- 1 hour 45 minutes
(4, 'TI402', 'General Electricity', 30, '09:00:00', 102, '02:00:00'), -- 2 hours
(5, 'TI609', 'From the Atom to the Microchip', 27, '17:00:00', 102, '02:30:00'), -- 2 hours 30 minutes
(6, 'TI702', 'Modern Physics', 30, '17:00:00', 102, '01:45:00'), -- 1 hour 45 minutes
(7, 'FH601', 'Communication skills', 26, '13:00:00', 103, '01:00:00'), -- 1 hour
(8, 'TI505', 'Java Programming', 27, '10:00:00', 104, '02:00:00'), -- 2 hours
(9, 'TI507', 'Web Programming', 27, '16:00:00', 110, '01:30:00'), -- 1 hour 30 minutes
(10, 'FL102', 'English second years', 28, '10:00:00', 105, '01:15:00'), -- 1 hour 15 minutes
(11, 'FL101', 'English first years', 28, '13:00:00', 105, '01:00:00'); -- 1 hour


/* Insert data into `class_list` table */
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(3, 1, 'SM503'),  -- Coline Sorin enrolled in Calculus (lesson_id = 1)
(3, 10, 'FL102');  -- Coline Sorin enrolled in English second years (lesson_id = 10)

INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(4, 3, 'SM601'),  -- Iri Rasoloarivalona enrolled in Graph Theory (lesson_id = 3)
(4, 5, 'TI609');  -- Iri Rasoloarivalona enrolled in From the Atom to the Microchip (lesson_id = 5)

INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(5, 7, 'FH601'),  -- Paul Leflon enrolled in Communication skills (lesson_id = 7)
(5, 9, 'TI507');  -- Paul Leflon enrolled in Web Programming (lesson_id = 9)

INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(6, 4, 'TI402'),  -- Matteo Launay enrolled in General Electricity (lesson_id = 4)
(6, 8, 'TI505');  -- Matteo Launay enrolled in Java Programming (lesson_id = 8)


INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(7, 11, 'FL101');  -- Valentin Lebras enrolled in English first years (lesson_id = 11)

-- Enroll Assila Ait Said in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(8, 1, 'SM503'),  -- Assila Ait Said enrolled in Calculus (lesson_id = 1)
(8, 10, 'FL102'); -- Assila Ait Said enrolled in English second years (lesson_id = 10)

-- Enroll Romuald Amrein in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(9, 1, 'SM503'),  -- Romuald Amrein enrolled in Calculus (lesson_id = 1)
(9, 10, 'FL102'); -- Romuald Amrein enrolled in English second years (lesson_id = 10)

-- Enroll Luc Ayeto in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(10, 1, 'SM503'),  -- Luc Ayeto enrolled in Calculus (lesson_id = 1)
(10, 10, 'FL102'); -- Luc Ayeto enrolled in English second years (lesson_id = 10)

-- Enroll Mathis Berger in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(11, 1, 'SM503'),  -- Mathis Berger enrolled in Calculus (lesson_id = 1)
(11, 10, 'FL102'); -- Mathis Berger enrolled in English second years (lesson_id = 10)

-- Enroll Thibault Beurotte in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(12, 1, 'SM503'),  -- Thibault Beurotte enrolled in Calculus (lesson_id = 1)
(12, 10, 'FL102'); -- Thibault Beurotte enrolled in English second years (lesson_id = 10)

-- Enroll Camille Chen in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(13, 1, 'SM503'),  -- Camille Chen enrolled in Calculus (lesson_id = 1)
(13, 10, 'FL102'); -- Camille Chen enrolled in English second years (lesson_id = 10)

-- Enroll Guillaume Cottura in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(14, 1, 'SM503'),  -- Guillaume Cottura enrolled in Calculus (lesson_id = 1)
(14, 10, 'FL102'); -- Guillaume Cottura enrolled in English second years (lesson_id = 10)

-- Enroll Camille Dommergue in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(15, 1, 'SM503'),  -- Camille Dommergue enrolled in Calculus (lesson_id = 1)
(15, 10, 'FL102'); -- Camille Dommergue enrolled in English second years (lesson_id = 10)

-- Enroll Samuel Doyen in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(16, 1, 'SM503'),  -- Samuel Doyen enrolled in Calculus (lesson_id = 1)
(16, 10, 'FL102'); -- Samuel Doyen enrolled in English second years (lesson_id = 10)

-- Enroll Tiphaine Fournier in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(17, 1, 'SM503'),  -- Tiphaine Fournier enrolled in Calculus (lesson_id = 1)
(17, 10, 'FL102'); -- Tiphaine Fournier enrolled in English second years (lesson_id = 10)

-- Enroll Alexandre Gobé in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(18, 1, 'SM503'),  -- Alexandre Gobé enrolled in Calculus (lesson_id = 1)
(18, 10, 'FL102'); -- Alexandre Gobé enrolled in English second years (lesson_id = 10)

-- Enroll Ethan Guingand in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(19, 1, 'SM503'),  -- Ethan Guingand enrolled in Calculus (lesson_id = 1)
(19, 10, 'FL102'); -- Ethan Guingand enrolled in English second years (lesson_id = 10)

-- Enroll John Jin in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(20, 1, 'SM503'),  -- John Jin enrolled in Calculus (lesson_id = 1)
(20, 10, 'FL102'); -- John Jin enrolled in English second years (lesson_id = 10)

-- Enroll Josselin Keib in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(21, 1, 'SM503'),  -- Josselin Keib enrolled in Calculus (lesson_id = 1)
(21, 10, 'FL102'); -- Josselin Keib enrolled in English second years (lesson_id = 10)

-- Enroll Soulamaine Laarissi in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(22, 1, 'SM503'),  -- Soulamaine Laarissi enrolled in Calculus (lesson_id = 1)
(22, 10, 'FL102'); -- Soulamaine Laarissi enrolled in English second years (lesson_id = 10)

-- Enroll Tom Sancesario in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(23, 1, 'SM503'),  -- Tom Sancesario enrolled in Calculus (lesson_id = 1)
(23, 10, 'FL102'); -- Tom Sancesario enrolled in English second years (lesson_id = 10)

-- Enroll Maxime Tang in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(24, 1, 'SM503'),  -- Maxime Tang enrolled in Calculus (lesson_id = 1)
(24, 10, 'FL102'); -- Maxime Tang enrolled in English second years (lesson_id = 10)

-- Enroll Nicolas Zhang in lessons
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(25, 1, 'SM503'),  -- Nicolas Zhang enrolled in Calculus (lesson_id = 1)
(25, 10, 'FL102'); -- Nicolas Zhang enrolled in English second years (lesson_id = 10)


INSERT INTO classes (lesson_id, name, class_id) VALUES
(1, 'Calculus', 'SM503'),
(2, 'Multivariate Analysis', 'SM402'),
(3, 'Graph Theory', 'SM601'),
(4, 'General Electricity', 'TI402'),
(5, 'From the Atom to the Microchip', 'TI609'),
(6, 'Modern Physics', 'TI702'),
(7, 'Communication skills', 'FH601'),
(8, 'Java Programming', 'TI505'),
(9, 'Web Programming', 'TI507'),
(10, 'English second years', 'FL102'),
(11, 'English first years', 'FL101');


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
