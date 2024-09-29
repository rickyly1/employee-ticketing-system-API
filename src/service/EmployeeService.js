const EmployeeDao = require("../repository/EmployeeDAO");

/*
    Employee Object Model
        {
            username: string (unique)
            password: string
            manager: boolean (true = manager, false = reg employee)
        }
*/

async function getEmployeeByUsername(username) {
    const employee = await EmployeeDao.getEmployeeByUsername(username);

    return employee;
}

async function registerEmployee(employee) {
    if (!employee.username || !employee.password) {
        throw new Error("Username and password are required");
    }

    if (employee.manager && employee.manager != "true" && employee.manager != "false") {
        throw new Error("Invalid input for manager field");
    }
    
    const taken = await EmployeeDao.isUsernameTaken(employee.username);

    if (!taken) {
        if (!employee.manager) {
            employee.manager = false;  // Default role is regular employee
        }

        let data = await EmployeeDao.registerEmployee(employee);
        return data;

    } else {
        throw new Error("Username is already registered");
    }
}

module.exports = {
    getEmployeeByUsername,
    registerEmployee,
};