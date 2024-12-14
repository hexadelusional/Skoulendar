
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

DELETE FROM classes;
INSERT INTO classes (id, name, teacher_id) VALUES
(1, 'Calculus', 8), -- Zahraa Mohsen
(2, 'General Electricity', 9), -- Elias Hatem
(3, 'Communication skills', 10); -- Clara Boissier

DELETE FROM homework;
INSERT INTO homework (id, title, description, due_date, class_id, teacher_id) VALUES
(1, 'Taylor series', "Solve the 10 last finite expansion problems. It's easy, isn't it ?", '2024-12-20', 1, 8), -- Zahraa Mohsen's class
(2, 'Physics Lab Report', 'Write a report about THE RESISTANCE IN PARALLEL WIZ ZE CAPACITOR.', '2024-12-22', 2, 9), -- Elias Hatem's class
(3, 'Dossier Thématique', 'Finir les 16 pages du dossier thématiques et écrire la semi-introduction de votre essai sur Montaigne. Je veux des titres vivants et un avis pertinent.', '2024-12-25', 3, 10); -- Clara Boissier's class
