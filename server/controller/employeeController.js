const ProjectService = require("../services/projectService");
const EmployeeService = require("../services/employeeService");

const Validations = require('../utils/validations')



function EmployeeController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const employeeService = new EmployeeService(objectCollection)
    const projectService = new ProjectService(objectCollection)
    const validations = new Validations(objectCollection)

    //@Post employee/create/add
    app.post('/' + 'api/' +'employee/create/add', async function (req, res) {
        const [err, resData] = await employeeService.employeeCreationInsert(req.body);
        if (!err) {
            console.log("employee/create/add | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("employee/create/add | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Get employee/create/add
    app.get('/' +'api/' + 'employee/get/all/list',

        async function (req, res) {

            const [err, resData] = await employeeService.getAllEmployees(req.body);
            if (!err) {
                console.log("employee/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Get employee/get/employee/by/id
    app.post('/' +'api/' + 'employee/get/employee/by/id',

        async function (req, res) {

            const [err, resData] = await employeeService.getEmployeeById(req.body);
            if (!err) {
                console.log("employee/get/employee/by/id | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/get/employee/by/id | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post employee/remove/employee/delete
    app.post('/' +'api/' + 'employee/remove/employee/delete',

        async function (req, res) {

            const [err, resData] = await employeeService.removeEmployeeDelete(req.body);
            if (!err) {
                console.log("employee/remove/employee/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/remove/employee/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Postemployee/remove/complete
    app.post('/' +'api/' + 'employee/remove/complete',

        async function (req, res) {

            const [err, resData] = await employeeService.removeEmployeeComplete(req.body);
            if (!err) {
                console.log("employee/remove/complete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/remove/complete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post employee/inactive/to/active
    app.post('/' + 'api/' +'employee/inactive/to/active',

        async function (req, res) {

            const [err, resData] = await employeeService.inactiveEmpToActive(req.body);
            if (!err) {
                console.log("employee/inactive/to/active | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/inactive/to/active | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post employee/update/employee/details
    app.post('/' +'api/' + 'employee/update/employee/details',

        async function (req, res) {

            const [err, resData] = await employeeService.updateEmployeeDetails(req.body);
            if (!err) {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

}


module.exports = EmployeeController;
