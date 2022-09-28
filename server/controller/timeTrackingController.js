const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const ProjectService = require("../services/projectService");
const TimeTrackingService = require("../services/timeTrackingService");
const moment = require('moment')

const Validations = require('../utils/validations')



function TimeTrackingController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const projectService = new ProjectService(objectCollection)
    const timeTrackingService = new TimeTrackingService(objectCollection)
    const validations = new Validations(objectCollection)


    app.post('/' + 'timetracking/add/task/details/insert', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingTaskDetailsInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timetracking/update/task/details', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingTaskDetailsUpdate(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
    app.post('/' + 'timetracking/get/all/weeks/task/details/by/employeeid/list', async function (req, res) {

        const [err, resData] = await timeTrackingService.getAllWeeksTasksByEmpId(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/all/weeks/task/details/by/employeeid/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timetracking/get/child/task/by/id', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingGetChildTaskByid(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timetracking/remove/child/task/delete', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingRemoveChildTaskDelete(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

}


module.exports = TimeTrackingController;
