
const LeadService = require('../services/leadService')
const EmployeeService = require('../services/employeeService')

function LeadController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const leadService = new LeadService(objectCollection)
    const employeeService = new EmployeeService(objectCollection)

    //@Get lead/get/all/leads/list
    app.get('/' +'api/' + 'lead/get/all/leads/list', async function (req, res) {
        const [err, resData] = await employeeService.getAllEmployees(req.body);
        if (!err) {
            console.log("lead/get/all/leads/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("lead/get/all/leads/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


    //@Post lead/get/emps/assigned/under/leads/list 
    app.post('/' +'api/' + 'lead/get/emps/assigned/under/leads/list',

        async function (req, res) {
            const [err, resData] = await leadService.getEmployessAssignUnderHeadsAdminAndEmpl(req.body, 2);
            if (!err) {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Postlead/get/groups
    app.post('/' + 'api/' + 'lead/get/all/emps/assigned/under/heads',

        async function (req, res) {

            const [err, resData] = await leadService.getEmployessAssignUnderHeadsAdminAndEmpl(req.body, 1);
            if (!err) {
                console.log("lead/get/groups | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("lead/get/groups | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //get/lead/approval/project/entries
    app.post('/' + 'api/' + 'get/lead/approval/project/entries', async function (req, res) {
        const [err, resData] = await leadService.getLeadApprovalProjectEntries(req.body);
        if (!err) {
            console.log("get/lead/approval/project/entries | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/lead/approval/project/entries | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

}




module.exports = LeadController;
