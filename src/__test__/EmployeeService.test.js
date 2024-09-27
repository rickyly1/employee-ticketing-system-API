const EmployeeService = require("../service/EmployeeService");
const EmployeeDao = require("../repository/EmployeeDAO");

jest.mock("../repository/EmployeeDAO");

describe("EmployeeService Tests", () => {

    test("Should return employee when username exists", async () => {
        const mockEmployee = { username: "mockuser", password: "mockpassword", manager: false };
        EmployeeDao.getEmployeeByUsername.mockReturnValue(mockEmployee);
        
        const result = await EmployeeService.getEmployeeByUsername("mockuser");
        expect(result).toEqual(mockEmployee);
        expect(EmployeeDao.getEmployeeByUsername).toHaveBeenCalledWith("mockuser");
    })

    test("Should return null when username does not exist", async () => {
        EmployeeDao.getEmployeeByUsername.mockReturnValue(null);

        const result = await EmployeeService.getEmployeeByUsername("mockuser");
        expect(result).toBeNull();
    })

    test("Should return employee if registration is successful", async () => {
        const mockEmployee = { username: "mockuser", password: "mockpassword", manager: false };

        EmployeeDao.isUsernameTaken.mockReturnValue(false);
        EmployeeDao.registerEmployee.mockReturnValue(mockEmployee);

        const result = await EmployeeService.registerEmployee(mockEmployee);
        expect(result).toEqual(mockEmployee);
        expect(EmployeeDao.isUsernameTaken).toHaveBeenCalledWith("mockuser");
    })

    test("Should return null if username is taken", async () => {
        EmployeeDao.isUsernameTaken.mockReturnValue(true);

        const result = await EmployeeService.registerEmployee("mockuser");
        expect(result).toBeNull();
    })
})