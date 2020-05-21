const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
            "view all employees by roles", 
            "view all employees by department",
            "update employee roles",
            "add employees",
            "exit"
        ]}
    )
    .then(function(answer) {
        switch (answer.choice) {
        case "view all employees":
          viewEmployee();
          break;
  
        case "view all employees by roles":
          viewEmployeeRoles();
          break;
  
        case "view all employees by department":
          viewEmployeeDepartment();
          break;
  
        case "update employee roles":
          updateRoles();
          break;

        case "add employees":
          addEmployee();
          break;

        case "exit":
          connection.end();
          break;
        }
      });

};

function getRoles(){
    let query = "SELECT * FROM role";
    var rolesArray = [];

    connection.query(query, function(err,res){
        for (var i = 0; i < res.length; i++) {
            if (err) throw err;
            rolesArray.push(res[i]);
        }
    });

    return rolesArray;
}


//view all employees and their information
function viewEmployee(){ 
    let query = "SELECT * FROM employee";

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        
        const rolesArray = getRoles()
        console.log(rolesArray)
    
        start();
    });

    

};

//view all positions and their information within the company
function viewEmployeeRoles(){
    inquirer
    .prompt([
      {
        name: "filterRole",
        type: "list",
        message: "pick the role you want to view ",
        choices : [] //list all roles available from database
      },
    ])
};

function viewEmployeeDepartment(){
    inquirer
    .prompt([
      {
        name: "filterDepartment",
        type: "list",
        message: "pick the Department you want to view ",
        choices : [] //list all Department available from database
      },
    ])


};

function updateRoles(){

};

function addEmployee(){
    //employee firstname, lastname, role, manager then run the start funciton again

    const roles = getRoles();
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

