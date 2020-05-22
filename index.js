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

async function getRoles(){
    let query = "SELECT title FROM role";
    let roleList = [ ];

    const data = await connection.query(query);
    // for (var i = 0; i < data.length; i++) {
    //     roleList.push(data[i].title);
    // }
    
    // console.log(data.length);
    for(const row of data) {
        roleList.push(row.title);
    }


    return roleList;
}


//view all employees and their information
function viewEmployee(){ 
    let query = "SELECT * FROM employee";

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

function updateRoles(){
    let query = "SELECT * FROM employee";
    let employeeList = [];

    connection.query(query, function(err,res){
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            employeeList.push(employee[i].first_name + " " + employee[i].last_name);
        }
    });

    return employeeList;

};

async function addEmployee(){
    //employee firstname, lastname, role, manager then run the start funciton again

    const roles = await getRoles();
    inquirer
    .prompt([
      {
        name: "employeeFirstName",
        type: "input",
        message: "enter employee first name ",
      },
      {
        name: "employeeLastName",
        type: "input",
        message: "enter employee last name ",
      },
      {
        name: "employeeRole",
        type: "list",
        message: "enter employee's role'",
        choices : [...roles] //employee's role from database
      },
        {
        name: "employeeManager",
        type: "list",
        message: "enter employee's manager ",
        choices : [] //manager's name from database
        }


    ]).then(function(answer){

    });

};

function addRoles(){

};

function addDepartment(){

};
