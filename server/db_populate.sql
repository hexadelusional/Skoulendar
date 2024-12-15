/* Run this file to populate the tables of the Skoulendar database */

DELETE FROM users;

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
(10, 'Clara', 'Boissier','98720', "Teacher");

DELETE FROM lessons;
INSERT INTO lessons (id, name, teacher_id, time, room_number) VALUES
(1, 'Calculus', 8, '08:00:00', 101),           -- Zahraa Mohsen
(2, 'General Electricity', 9, '10:00:00', 102), -- Elias Hatem
(3, 'Communication skills', 10, '13:00:00', 103); -- Clara Boissier


DELETE FROM class_list; 

INSERT INTO class_list (student_id, class_id) VALUES
(3, 1),  -- Coline Sorin enrolled in Calculus
(4, 1),  -- Iri Rasoloarivalona enrolled in Calculus
(5, 1),  -- Paul Leflon enrolled in Calculus
(6, 2),  -- Matteo Launay enrolled in General Electricity
(7, 2),  -- Valentin Lebras enrolled in General Electricity
(3, 3),  -- Coline Sorin enrolled in Communication skills
(7, 3);  -- Valentin Lebras enrolled in Communication skills


DELETE FROM homework;
INSERT INTO homework (id, title, description, deadline, class_id, teacher_id) VALUES
(1, 'Taylor series', "Solve the 10 last finite expansion problems. It's easy, isn't it ?", '2024-12-20', 1, 8), -- Zahraa Mohsen's class
(2, 'Physics Lab Report', 'Write a report about ZZE RESISTANCE IN PARALLEL WIZ ZZE CAPACITOR.', '2024-12-22', 2, 9), -- Elias Hatem's class
(3, 'Dossier Thematique', 'Finir les 16 pages du dossier thematiques et ecrire la semi-introduction de votre essai sur Montaigne. Je veux des titres vivants et un avis pertinent.', '2024-12-25', 3, 10); -- Clara Boissier's class


INSERT INTO homework_status (student_id, homework_id, completed) VALUES
(1, 1, TRUE),  -- Student 1 has completed Homework 1 (Taylor Series)
(1, 2, FALSE), -- Student 1 has not completed Homework 2 (Physics Lab Report)
(2, 1, FALSE), -- Student 2 has not completed Homework 1 (Taylor Series)
(2, 3, TRUE),  -- Student 2 has completed Homework 3 (Dossier Thematique)
(3, 2, TRUE),  -- Student 3 has completed Homework 2 (Physics Lab Report)
(3, 3, FALSE); -- Student 3 has not completed Homework 3 (Dossier Thematique)
