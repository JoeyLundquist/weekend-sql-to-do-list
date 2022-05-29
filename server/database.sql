CREATE TABLE "to_do_list"(
"id" SERIAL PRIMARY KEY,
"category" VARCHAR(50) DEFAULT 'Personal',
"project" VARCHAR(50),
"task" VARCHAR(80) NOT NULL,
"priority" VARCHAR(10) NOT NULL,
"inProgress" BOOLEAN DEFAULT TRUE,
"dateCreated" DATE NOT NULL DEFAULT CURRENT_DATE,
"dueDate" DATE,
"dateCompleted" DATE,
"notes" VARCHAR(2048)
);

INSERT INTO to_do_list
("category", "project", "task", "priority", "inProgress", "dueDate", "notes")
VALUES
('Personal', null, 'Oil Change', 'Medium', true, '2022-05-30', 'Oils is pretty old and needs a changing'),
('School', 'Weekend Challenge', 'To-do list app', 'High', true, '2022-05-30', 'We gotta get this done ASAP'),
(default, null, 'Eat Food', 'Low', true, '2022-05-27', 'Who needs food anyways?'),
('Personal', 'Car', 'Oil Change', 'Medium', true, '2022-05-30', 'Oils is pretty old and needs a changing'),
('School', 'Weekend Challenge', 'To-do list app', 'High', true, '2022-05-30', 'We gotta get this done ASAP'),
('Work', 'Apply', 'Send Resume', 'High', true, '2022-05-27', 'Who needs food anyways?'),
('Personal', null, 'Oil Change', 'Medium', true, '2022-05-30', 'Oils is pretty old and needs a changing'),
('Work', 'Weekend Challenge', 'To-do list app', 'High', true, '2022-05-30', 'We gotta get this done ASAP'),
(default, null, 'Eat Food', 'Low', true, '2022-05-27', 'Who needs food anyways?'),
('Personal', null, 'Oil Change', 'Medium', true, '2022-05-30', 'Oils is pretty old and needs a changing'),
('School', 'Weekend Challenge', 'To-do list app', 'High', true, '2022-05-30', 'We gotta get this done ASAP'),
(default, null, 'Eat Food', 'Low', true, '2022-05-27', 'Who needs food anyways?');



SELECT * FROM to_do_list;
