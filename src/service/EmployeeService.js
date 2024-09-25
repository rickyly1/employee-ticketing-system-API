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
    const taken = await EmployeeDao.isUsernameTaken(employee.username);

    if (!taken) {
        if (!employee.manager) {
            employee.manager = false;  // Default role is regular employee
        }
        let data = await EmployeeDao.registerEmployee(employee);
        return data;
    }

    return null;
}

module.exports = {
    getEmployeeByUsername,
    registerEmployee,
};