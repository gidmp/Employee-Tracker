-- put basic roles in here such as manager, intern, etc

USE employeeDB;

INSERT into department (name) VALUES ("R&D");
INSERT into department (name) VALUES ("Finance");

INSERT into role (title, salary, department_id) VALUES ("Manager", 100000, 2);
INSERT into role (title, salary, department_id) VALUES ("IT Manager", 120000, 1);
INSERT into role (title, salary, department_id) VALUES ("Engineer", 900000, 1);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Ren", "Amamiya", 3, 1);
-- INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Goro", "Akechi", 1, 1);