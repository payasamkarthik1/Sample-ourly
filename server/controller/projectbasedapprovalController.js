
const ProjectbasedapprovalServices = require("../services/projectbasedapprovalServices");

function ProjectController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const projectbasedapprovalServices = new ProjectbasedapprovalServices(objectCollection)

    //@Post get/project/wise/task/details
    app.post('/' + 'get/project/wise/task/details', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getProjectWiseTaskDetails(req.body, res);
        if (!err) {
            console.log("get/project/wise/task/details | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/project/wise/task/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


    //@Post get/project/lead/wise/entries
    app.post('/' + 'get/project/lead/wise/entries', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getProjectLeadWiseEntries(req.body, res);
        if (!err) {
            console.log("get/project/lead/wise/entries | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/project/lead/wise/entries | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post get/employee/wise/projects/data
    app.post('/' + 'get/employee/wise/projects/data', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getEmployeeWiseProjectsData(req.body, res);
        if (!err) {
            console.log("get/employee/wise/projects/data | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/employee/wise/projects/data | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post get/all/tasks/weekly/by/project/list
    app.post('/' + 'get/all/tasks/weekly/by/project/list', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getAllTasksWeeklyByProjectList(req.body, res);
        if (!err) {
            console.log("get/all/tasks/weekly/by/project/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/all/tasks/weekly/by/project/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

     //@Post project/wise/task/details/approval
     app.post('/' + 'project/wise/task/details/approval', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.projectWiseTaskDetailsApproval(req.body, res);
        if (!err) {
            console.log("project/wise/task/details/approval | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/wise/task/details/approval | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


}


module.exports = ProjectController;
