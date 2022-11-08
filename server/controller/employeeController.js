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
    const validations = new Validations(objectCollection)



    //@Post employee/create/add
    app.post('/' + 'employee/create/add', async function (req, res) {
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
    app.get('/' + 'employee/get/all/list',

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
    app.post('/' + 'employee/get/employee/by/id',

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
    app.post('/' + 'employee/remove/employee/delete',

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
    app.post('/' + 'employee/remove/complete',

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
    app.post('/' + 'employee/inactive/to/active',

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
    app.post('/' + 'employee/update/employee/details',

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

    //-------------------------leads---------------

    //@Get lead/get/all/leads/list
    app.get('/' + 'lead/get/all/leads/list',

        async function (req, res) {

            const [err, resData] = await employeeService.getAllLeads(req.body);
            if (!err) {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post lead/get/emps/assigned/under/leads/list 
    app.post('/' + 'lead/get/emps/assigned/under/leads/list',

        async function (req, res) {

            const [err, resData] = await employeeService.getEmpsUnderLeads(req.body);
            if (!err) {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

            //@Post lead/get/emps/assigned/under/leads/list 
    app.post('/' + 'lead/get/emps/assigned/under/leads/list/v1',

    async function (req, res) {

        const [err, resData] = await employeeService.getEmpsAssignUnderLeads(req.body);
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
