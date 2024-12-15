/* Run this file to populate the tables of the Skoulendar database */
DELETE FROM users;
DELETE FROM lessons;
DELETE FROM class_list; 
DELETE FROM homework;
DELETE FROM homework_status;

INSERT INTO users (id, name, surname, password, status) VALUES
(1, 'Adele', 'Chamoux', '160305', "Admin"),
(2, 'Elodie', 'Dufflaut', '050304', "Admin"),
(3, 'Coline', 'Sorin', '151104', "Student"),
(4, 'Iri', 'Rasoloarivalona', '161616', "Student"),
(5, 'Paul', 'Leflon', '252525', "Student"),
(6, 'Matteo', 'Launay', '121314', "Student"),
(7, 'Valentin', 'Lebras','123456', "Student"),
(8, 'Zahraa', 'Mohsen','56789', "Teacher"),
(9, 'Elias', 'Hatem','98137', "Teacher"),
(10, 'Clara', 'Boissier','98720', "Teacher"),
(11, 'Nicolas', 'Flasque','66331', "Teacher"),
(12, 'Christina', 'Dias','90877', "Teacher");


INSERT INTO lessons (id, name, teacher_id, time, room_number) VALUES
('SM503', 'Calculus', 8, '08:00:00', 101),           -- Zahraa Mohsen
('SM402', 'Multivariate Analysis', 8, '10:00:00', 101),  -- Zahraa Mohsen
('SM601', 'Graph Theory', 8, '10:00:00', 101),         -- Zahraa Mohsen
('TI402', 'General Electricity', 9, '09:00:00', 102), -- Elias Hatem
('TI609', 'From the Atom to the Microchip', 9, '17:00:00', 102), -- Elias Hatem
('TI702', 'Modern Physics', 9, '17:00:00', 102), -- Elias Hatem
('FH601', 'Communication skills', 10, '13:00:00', 103), -- Clara Boissier
('TI505', 'Java Programming', 11, '10:00:00', 104), -- Nicolas Flasque
('TI507', 'Web Programming', 11, '16:00:00', 110), -- Nicolas Flasque
('FL102', 'English second years', 12, '10:00:00', 105), -- Christina Dias
('FL101', 'English first years', 12, '13:00:00', 105); -- Christina Dias



INSERT INTO class_list (student_id, lesson_id) VALUES
(3, 'FL102'),  -- Coline Sorin 
(3, 'SM503'),  -- Coline Sorin 
(4, 'SM503'),  -- Iri Rasoloarivalona 
(4, 'SM601'),  -- Iri Rasoloarivalona
(4, 'FL101'),  -- Iri Rasoloarivalona
(5, 'SM503'),  -- Paul Leflon 
(5, 'TI609'),  -- Paul Leflon
(5, 'TI507'),  -- Paul Leflon 
(5, 'SM601'),  -- Paul Leflon
(6, 'TI402'),  -- Matteo Launay 
(6, 'TI609'),  -- Matteo Launay 
(7, 'TI402'),  -- Valentin Lebras 
(3, 'FH601'),  -- Coline Sorin 
(7, 'FL101');  -- Valentin Lebras 


INSERT INTO homework (id, title, description, deadline, lesson_id, teacher_id) VALUES
(1, 'Taylor series', "Solve the 10 last finite expansion problems. It's easy, isn't it ?", '2024-12-20', 'SM503', 8), -- Zahraa Mohsen's class
(2, 'Physics Lab Report', 'Write a report about ZZE RESISTANCE IN PARALLEL WIZ ZZE CAPACITOR.', '2024-12-22', 'TI402', 9), -- Elias Hatem's class
(3, 'Dossier Thematique', 'Finir les 16 pages du dossier thematiques et ecrire la semi-introduction de votre essai sur Montaigne. Je veux des titres vivants et un avis pertinent.', '2024-12-25','FH601', 10); -- Clara Boissier's class

INSERT INTO homework_status (student_id, homework_id, completed) VALUES
(1, 1, TRUE),  -- Student 1 has completed Homework 1 (Taylor Series)
(1, 2, FALSE), -- Student 1 has not completed Homework 2 (Physics Lab Report)
(2, 1, FALSE), -- Student 2 has not completed Homework 1 (Taylor Series)
(2, 3, TRUE),  -- Student 2 has completed Homework 3 (Dossier Thematique)
(3, 2, TRUE),  -- Student 3 has completed Homework 2 (Physics Lab Report)
(3, 3, FALSE); -- Student 3 has not completed Homework 3 (Dossier Thematique)
