
const ProjectbasedapprovalServices = require("../services/projectbasedapprovalServices");

function ProjectController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const projectbasedapprovalServices = new ProjectbasedapprovalServices(objectCollection)

    //@Post get/project/wise/task/details
    app.post('/' + 'api/' + 'get/project/wise/task/details', async function (req, res) {
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
    app.post('/' + 'api/' + 'get/project/lead/wise/entries', async function (req, res) {
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
    app.post('/' + 'api/' + 'get/employee/wise/projects/data', async function (req, res) {
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
    app.post('/' + 'api/' + 'get/all/tasks/weekly/by/project/list', async function (req, res) {
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
    app.post('/' + 'api/' + 'project/wise/task/details/approval', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.projectWiseTaskDetailsApproval(req.body, res);
        if (!err) {
            console.log("project/wise/task/details/approval | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/wise/task/details/approval | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/wise/task/details/reject
    app.post('/' + 'api/' + 'project/wise/task/details/reject', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.projectWiseTaskDetailsReject(req.body, res);
        if (!err) {
            console.log("project/wise/task/details/reject | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/wise/task/details/reject | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post get/project/leads
    app.post('/' + 'api/' + 'get/project/leads', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getProjectLeads(req.body, res);
        if (!err) {
            console.log("get/project/leads | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/project/leads | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post get/project/lead/wise/data/tocheck/status
    app.post('/' + 'api/' + 'get/project/lead/wise/data/tocheck/status', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getProjectLeadWiseDataToCheckStatuses(req.body, res);
        if (!err) {
            console.log("get/project/lead/wise/data | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/project/lead/wise/data | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post get/un-added/time-tracking/employee/data
    app.post('/' + 'api/' + 'get/un-added/time-tracking/employee/data', async function (req, res) {
        const [err, resData] = await projectbasedapprovalServices.getUnSubmittedTimetrackingEmployeeData(req.body, res);
        if (!err) {
            console.log("get/un-added/time-tracking/employee/data | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/un-added/time-tracking/employee/data | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })



}


module.exports = ProjectController;
