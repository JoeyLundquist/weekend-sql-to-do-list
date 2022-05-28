CREATE TABLE "to_do_list"(
"id" SERIAL PRIMARY KEY,
"name" VARCHAR(80) NOT NULL,
"priority" VARCHAR(10) NOT NULL,
"inProgress" BOOLEAN DEFAULT TRUE,
"dateCreated" DATE NOT NULL,
"dueDate" DATE,
"dateCompleted" DATE,
"notes" VARCHAR(2048)
);

INSERT INTO to_do_list
("name", "priority", "inProgress", "dateCreated", "dueDate", "notes")
VALUES
('Oil Change', 'Medium', true, '2022-05-27', '2022-05-30', 'Oils is pretty old and needs a changing'),
('Weekend Project', 'high', true, '2022-05-27', '2022-05-30', 'We gotta get this done ASAP'),
('Eat Food', 'low', true, '2022-05-27', '2022-05-27', 'Who needs food anyways?');


SELECT * FROM to_do_list;
