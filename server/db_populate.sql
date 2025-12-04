/* Clear existing data */
DELETE FROM homework_status;
DELETE FROM homework;
DELETE FROM class_list;
DELETE FROM lessons;
DELETE FROM users;

/* Insert data into `users` table */
INSERT INTO users (id, name, surname, password, status) VALUES
(1, 'Adele', 'Chamoux', '160305', "Admin"),
(2, 'Elodie', 'Duflaut', '040304', "Admin"),
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
(18, 'Alexandre', 'Gobe', '218950', 'Student'),
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

-- Zahraa's lessons
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time, lesson_date) VALUES
(1, 'SM503', 'Calculus', 29, '08:00:00', 116, '02:00:00', '2024-12-16'), 
(2, 'SM402', 'Multivariate Analysis', 29, '10:00:00', 101, '02:00:00', '2024-12-16'), 
(3, 'SM601', 'Graph Theory', 29, '12:00:00', 101, '02:00:00', '2024-12-17'), 
(4, 'SM503', 'Calculus', 29, '08:00:00', 101, '02:00:00', '2024-12-28'), 
(5, 'SM402', 'Multivariate Analysis', 29, '10:00:00', 101, '02:00:00', '2024-12-18'), 
(6, 'SM601', 'Graph Theory', 29, '12:00:00', 101, '02:00:00', '2024-12-19'),
(7, 'SM503', 'Calculus', 29, '08:00:00', 101, '02:00:00', '2024-12-27'), 
(8, 'SM402', 'Multivariate Analysis', 29, '10:00:00', 101, '02:00:00', '2024-12-19'),
(9, 'SM601', 'Graph Theory', 29, '12:00:00', 101, '02:00:00', '2024-12-20'), 
(10, 'SM503', 'Calculus', 29, '08:00:00', 101, '02:00:00', '2024-12-20'),  
(11, 'SM402', 'Multivariate Analysis', 29, '10:00:00', 101, '02:00:00', '2024-12-20'), 
(12, 'SM601', 'Graph Theory', 29, '12:00:00', 101, '02:00:00', '2024-12-21'); 

-- Ziad Adem's lessons
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time, lesson_date) VALUES
(13, 'TI402', 'General Electricity', 30, '09:00:00', 102, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(14, 'TI402', 'General Electricity', 30, '09:00:00', 102, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(15, 'TI402', 'General Electricity', 30, '09:00:00', 102, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(16, 'TI609', 'From the Atom to the Microchip', 30, '12:00:00', 102, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(17, 'TI609', 'From the Atom to the Microchip', 30, '12:00:00', 102, '02:00:00', '2024-12-20'),  -- December 20, 2024 (Friday)
(18, 'TI609', 'From the Atom to the Microchip', 30, '12:00:00', 102, '02:00:00', '2024-12-21'),  -- December 21, 2024 (Saturday)
(19, 'TI702', 'Modern Physics', 30, '14:00:00', 102, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(20, 'TI702', 'Modern Physics', 30, '14:00:00', 102, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(21, 'TI702', 'Modern Physics', 30, '14:00:00', 102, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(22, 'TI702', 'Modern Physics', 30, '14:00:00', 102, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(23, 'TI702', 'Modern Physics', 30, '14:00:00', 102, '02:00:00', '2024-12-20'),  -- December 20, 2024 (Friday)
(24, 'TI702', 'Modern Physics', 30, '14:00:00', 102, '02:00:00', '2024-12-21');  -- December 21, 2024 (Saturday)

-- Clara Boissier's lessons
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time, lesson_date) VALUES
(25, 'FH601', 'Communication Skills', 26, '08:00:00', 101, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(26, 'FH601', 'Communication Skills', 26, '10:00:00', 101, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(27, 'FH601', 'Communication Skills', 26, '08:00:00', 101, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(28, 'FH601', 'Communication Skills', 26, '10:00:00', 101, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(29, 'FH602', 'Essay Writing', 26, '08:00:00', 105, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(30, 'FH602', 'Essay Writing', 26, '10:00:00', 116, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(31, 'FH602', 'Essay Writing', 26, '08:00:00', 203, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(32, 'FH602', 'Essay Writing', 26, '10:00:00', 190, '02:00:00', '2024-12-19');  -- December 19, 2024 (Thursday)

-- Christina Dias's lessons
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time, lesson_date) VALUES
(33, 'FL102', 'English Second Year', 28, '08:00:00', 101, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(34, 'FL101', 'English First Year', 28, '12:00:00', 101, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(35, 'FL102', 'English Second Year', 28, '08:00:00', 101, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(36, 'FL101', 'English First Year', 28, '10:00:00', 101, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(37, 'FL102', 'English Second Year', 28, '12:00:00', 101, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(38, 'FL101', 'English First Year', 28, '08:00:00', 101, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(39, 'FL102', 'English Second Year', 28, '10:00:00', 101, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(40, 'FL101', 'English First Year', 28, '12:00:00', 101, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(41, 'FL102', 'English Second Year', 28, '08:00:00', 101, '02:00:00', '2024-12-20'),  -- December 20, 2024 (Friday)
(42, 'FL101', 'English First Year', 28, '10:00:00', 101, '02:00:00', '2024-12-20');  -- December 20, 2024 (Friday)

-- Nicolas Flasque's lessons
INSERT INTO lessons (lesson_id, class_id, name, teacher_id, time, room_number, duration_time, lesson_date) VALUES
(45, 'TI505', 'Java Programming', 27, '08:00:00', 102, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(46, 'TI507', 'Web Programming', 27, '12:00:00', 102, '02:00:00', '2024-12-16'),  -- December 16, 2024 (Monday)
(47, 'TI505', 'Java Programming', 27, '08:00:00', 102, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(48, 'TI507', 'Web Programming', 27, '10:00:00', 102, '02:00:00', '2024-12-17'),  -- December 17, 2024 (Tuesday)
(49, 'TI505', 'Java Programming', 27, '12:00:00', 102, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(50, 'TI507', 'Web Programming', 27, '08:00:00', 102, '02:00:00', '2024-12-18'),  -- December 18, 2024 (Wednesday)
(51, 'TI505', 'Java Programming', 27, '10:00:00', 102, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(52, 'TI507', 'Web Programming', 27, '12:00:00', 102, '02:00:00', '2024-12-19'),  -- December 19, 2024 (Thursday)
(53, 'TI505', 'Java Programming', 27, '08:00:00', 102, '02:00:00', '2024-12-20'),  -- December 20, 2024 (Friday)
(54, 'TI507', 'Web Programming', 27, '10:00:00', 102, '02:00:00', '2024-12-20');  -- December 20, 2024 (Friday)


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


-- Enrollments for Coline Sorin
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(3, 2, 'SM402'),  -- Multivariate Analysis
(3, 4, 'TI402'),  -- General Electricity
(3, 9, 'TI507');  -- Web Programming

-- Enrollments for Iri Rasoloarivalona
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(4, 6, 'TI702'),  -- Graph Theory
(4, 1, 'SM503'),  -- Calculus
(4, 8, 'TI505'),  -- Multivariate analysis
(4, 11, 'FL101'); -- English first years

-- Enrollments for Paul Leflon
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(5, 4, 'TI402'),  -- General Electricity
(5, 35, 'FL102'), -- English second years
(5, 8, 'TI505');  -- Java Programming

-- Enrollments for Matteo Launay
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(6, 1, 'SM503'),  -- Calculus
(6, 7, 'FH601'),  -- Communication skills
(6, 9, 'TI507');  -- Web Programming

-- Enrollments for Valentin Lebras
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(7, 6, 'TI702'),  -- Modern Physics
(7, 7, 'FH601'),  -- Communication skills
(7, 8, 'TI505'),  -- Java Programming
(7, 1, 'SM503'),  -- Calculus
(7, 9, 'TI507');  -- Web Programming

-- Enrollments for Assila Ait Said
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(8, 2, 'SM402'),  -- Multivariate Analysis
(8, 7, 'FH601'),  -- Communication skills
(8, 11, 'FL101'); -- English first years

-- Enrollments for Romuald Amrein
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(9, 4, 'TI402'),  -- General Electricity
(9, 7, 'FH601'),  -- Communication skills
(9, 6, 'TI702');  -- Modern Physics

-- Enrollments for Luc Ayeto
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(10, 2, 'SM402'), -- Multivariate Analysis
(10, 4, 'TI402'), -- General Electricity
(10, 9, 'TI507'), -- Web Programming
(10, 6, 'TI702'); -- Modern Physics

-- Enrollments for Mathis Berger
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(11, 7, 'FH601'), -- Communication skills
(11, 8, 'TI505'), -- Java Programming
(11, 2, 'SM402'); -- Multivariate Analysis

-- Enrollments for Thibault Beurotte
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(12, 3, 'SM601'), -- Graph Theory
(12, 6, 'TI702'), -- Modern Physics
(12, 4, 'TI402'); -- General Electricity

-- Enrollments for Camille Chen
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(13, 5, 'TI609'), -- From the Atom to the Microchip
(13, 7, 'FH601'), -- Communication skills
(13, 8, 'TI505'); -- Java Programming

-- Enrollments for Guillaume Cottura
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(14, 3, 'SM601'), -- Graph Theory
(14, 6, 'TI702'), -- Modern Physics
(14, 5, 'TI609'); -- From the Atom to the Microchip

-- Enrollments for Camille Dommergue
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(15, 4, 'TI402'), -- General Electricity
(15, 5, 'TI609'), -- From the Atom to the Microchip
(15, 11, 'FL101'); -- English first years

-- Enrollments for Samuel Doyen
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(16, 8, 'TI505'), -- Java Programming
(16, 3, 'SM601'), -- Graph Theory
(16, 7, 'FH601'); -- Communication skills

-- Enrollments for Tiphaine Fournier
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(17, 2, 'SM402'), -- Multivariate Analysis
(17, 3, 'SM601'), -- Graph Theory
(17, 6, 'TI702'); -- Modern Physics

-- Enrollments for Alexandre Gobé
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(18, 5, 'TI609'), -- From the Atom to the Microchip
(18, 4, 'TI402'), -- General Electricity
(18, 8, 'TI505'); -- Java Programming

-- Enrollments for Ethan Guingand
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(19, 3, 'SM601'), -- Graph Theory
(19, 5, 'TI609'), -- From the Atom to the Microchip
(19, 7, 'FH601'); -- Communication skills

-- Enrollments for John Jin
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(20, 2, 'SM402'), -- Multivariate Analysis
(20, 3, 'SM601'), -- Graph Theory
(20, 5, 'TI609'); -- From the Atom to the Microchip

-- Enrollments for Josselin Keib
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(21, 7, 'FH601'), -- Communication skills
(21, 8, 'TI505'), -- Java Programming
(21, 9, 'TI507'); -- Web Programming

-- Enrollments for Soulamaine Laarissi
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(22, 11, 'FL101'), -- English first years
(22, 5, 'TI609'), -- From the Atom to the Microchip
(22, 9, 'TI507'); -- Web Programming

-- Enrollments for Tom Sancesario
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(23, 2, 'SM402'), -- Multivariate Analysis
(23, 6, 'TI702'), -- Modern Physics
(23, 3, 'SM601'); -- Graph Theory

-- Enrollments for Maxime Tang
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(24, 4, 'TI402'), -- General Electricity
(24, 6, 'TI702'), -- Modern Physics
(24, 7, 'FH601'); -- Communication skills

-- Enrollments for Nicolas Zhang
INSERT INTO class_list (student_id, lesson_id, class_id) VALUES
(25, 3, 'SM601'), -- Graph Theory
(25, 8, 'TI505'), -- Java Programming
(25, 7, 'FH601'); -- Communication skills

