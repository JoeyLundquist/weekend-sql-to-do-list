CREATE TABLE "to_do_list"(
"id" SERIAL PRIMARY KEY,
"category" VARCHAR(50) DEFAULT 'Personal',
"project" VARCHAR(50),
"owner" VARCHAR(50),
"task" VARCHAR(80) NOT NULL,
"priority" VARCHAR(10) NOT NULL,
"inProgress" BOOLEAN DEFAULT TRUE,
"dateCreated" DATE NOT NULL,
"dueDate" DATE,
"dateCompleted" DATE,
"notes" VARCHAR(2048)
);

INSERT INTO to_do_list
("category", "project", "owner", "task", "priority", "inProgress", "dateCreated", "dueDate", "notes")
VALUES
('Personal', null, 'Joey', 'Oil Change', 'Medium', true, '2022-05-27', '2022-05-30', 'Oils is pretty old and needs a changing'),
('School', 'Weekend Challenge', 'Joey', 'To-do list app', 'high', true, '2022-05-27', '2022-05-30', 'We gotta get this done ASAP'),
(default, null, null,  'Eat Food', 'low', true, '2022-05-27', '2022-05-27', 'Who needs food anyways?');



SELECT * FROM to_do_list;