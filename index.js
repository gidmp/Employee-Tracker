const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Database = require("./async");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "employeeDB"
  });

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
/*
view all employee by manager, department, roles
add employee, assign their department, role
*/
function start() {
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        message: "What do you want to do?",
        choices: [
            "view all employees", 
            "view all roles", 
            "view all department",
            "update employee roles",
            "add employees",
            "add roles",
            "add department",
            "exit"
        ]}
    )
    .then(function(answer) {
        switch (answer.choice) {
        case "view all employees":
          viewEmployee();
          break;
  
        case "view all roles":
          viewRoles();
          break;
  
        case "view all department":
          viewDepartment();
          break;
  
        case "update employee roles":
          updateRoles();
          break;

        case "add employees":
          addEmployee();
          break;

        case "add roles":
          addRoles();
          break;

        case "add department":
          addDepartment();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });

};

//view all employees and their information
function viewEmployee(){ 
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY ID ASC";

    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });

};

//view all positions and their information within the company
function viewRoles(){
  let query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
};

function viewDepartment(){
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });

};

async function updateRoles(){
  
  inquirer
  .prompt([
    {
      name: "selectEmployee",
      type: "list",
      message: "Enter the employee you'd like to update",
      choices : [...(await getManager())] 

    },

    {
      name: "newRole",
      type: "list",
      message: "Enter their new role",
      choices : [...(await getRoles())] 
    }
  ]).then((ans)=>{
    connection.query("INSERT INTO employee (title) VALUES (?)",[ans.newRole],function(err,res){
      if (err) throw err;

      console.table(res);
      start();
    })
  })
};


function getRoles(){
  let query = "SELECT * FROM role";
  var roleList = [ ];

  return new Promise((resolve, reject) => {
    connection.query(query, function(err,res){
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
          roleList.push(res[i].title);
      }
      // cb(roleList);
      resolve(roleList);
    });
  }).then((response) => {
    return response;
  })
}

function getManager(){
  let query = "SELECT * FROM employee";
  var managerList = [ ];

  return new Promise((resolve, reject) => {
    connection.query(query, function(err,res){
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
          managerList.push(res[i].first_name + " "+ res[i].last_name);
      }
      resolve(managerList);
    });
  }).then((response) => {
    return response;
  })

}

function mapRole(role){
  let query = "SELECT id FROM role WHERE title = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [role], function(err,res){
      if (err) throw err;

      resolve(res);
    });
  }).then((response) => {
    return response;
  })
}
function mapManager(manager){
  let query = "SELECT id FROM employee WHERE title = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [manager], function(err,res){
      if (err) throw err;

      resolve(res);
    });
  }).then((response) => {
    return response;
  })
}
async function addEmployee(){
  //employee firstname, lastname, role, manager then run the start funciton again
  let answer = {};


  await inquirer.prompt([
    {
      name: "employeeFirstName",
      type: "input",
      message: "enter employee first name ",
    },
  ]).then(function(ans){
    answer.employeeFirstName = ans.employeeFirstName;
  });

  
  await inquirer.prompt([
    {
      name: "employeeLastName",
      type: "input",
      message: "enter employee last name ",
    },
  ]).then(function(ans){
    answer.employeeLastName = ans.employeeLastName;
  });

  
  const role = await inquirer.prompt([
    {
      name: "employeeRole",
      type: "list",
      message: "enter employee's role'",
      choices : [...(await getRoles())] //employee's role from database
    }

  ]).then(function(ans){
    return ans.employeeRole;
  });
  
  answer.employeeRole = await mapRole(role).then((res)=> res[0].id);

  await inquirer.prompt([
    {
      name: "employeeManager",
      type: "list",
      message: "enter employee's manager ",
      choices : [...(await getManager())] //manager's name from database
    }
  ]).then((ans) => {
    answer.employeeManager = ans.employeeManager;
  })
  console.log(answer);

  connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",[answer.employeeFirstName, answer.employeeLastName, answer.employeeRole], (cb) =>{
    start();
  });

};


function addRoles(){
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "Enter the name of the role"
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary for this role"
      },
      {
        name: "departmentID",
        type: "input",
        message: "Enter department id number"
      }
    ])
    .then(function(answer) {
      connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",[answer.roleName, answer.salary, answer.departmentID],function(err,res){
        if (err) throw err;

        console.table(res);
        start();
      })
    })

};

function addDepartment(){
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the name of the new department?"
      }
    ]).then(function(answer){
      connection.query("INSERT INTO department (name) VALUES (?)", [answer.departmentName] , function(err, res) {
        if (err) throw err;

        console.table(res);
        start();
      })
    })
};

