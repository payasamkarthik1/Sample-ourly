const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const ProjectService = require("../services/projectService");
const EmployeeService = require("../services/employeeService");

const Validations = require('../utils/validations')



function EmployeeController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const employeeService = new EmployeeService(objectCollection)
    const projectService = new ProjectService(objectCollection)
    // const rolesDepartDesigService = new RolesDepartmentDesignationService(objectCollection)
    const validations = new Validations(objectCollection)


    app.post('/' + 'employee/create/add', async function (req, res) {
        const [err, resData] = await employeeService.employeeCreationInsert(req.body);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("employee/create/add | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.get('/' + 'employee/get/all/list',

        async function (req, res) {

            const [err, resData] = await employeeService.getAllEmployees(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



        app.post('/' + 'employee/remove/employee/delete',

        async function (req, res) {

            const [err, resData] = await employeeService.removeEmployeeDelete(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

        app.post('/' + 'employee/update/employee/details',

        async function (req, res) {

            const [err, resData] = await employeeService.updateEmployeeDetails(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



}


module.exports = EmployeeController;
