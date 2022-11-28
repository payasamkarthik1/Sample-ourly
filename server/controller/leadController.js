
const LeadService = require('../services/leadService')

function LeadController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const leadService = new LeadService(objectCollection)

    //@Get lead/get/all/leads/list
    app.get('/' + 'lead/get/all/leads/list',

        async function (req, res) {

            const [err, resData] = await leadService.getAllLeads(req.body,2);
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

            const [err, resData] = await leadService.getEmpsAssignUnderLeads(req.body);
            if (!err) {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("employee/update/employee/details | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Postlead/get/groups
    app.post('/' + 'lead/get/groups',

        async function (req, res) {

            const [err, resData] = await leadService.getGroupsUnderLeads(req.body);
            if (!err) {
                console.log("lead/get/groups | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("lead/get/groups | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

}




module.exports = LeadController;
