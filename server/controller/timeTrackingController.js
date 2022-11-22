const { json } = require("body-parser");
const ProjectService = require("../services/projectService");
const TimeTrackingService = require("../services/timeTrackingService");
const moment = require('moment')

const Validations = require('../utils/validations')



function TimeTrackingController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const projectService = new ProjectService(objectCollection)
    const timeTrackingService = new TimeTrackingService(objectCollection)
    const validations = new Validations(objectCollection)


    app.post('/' + 'timetracking/add/task/details/insert', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingAddTaskDetailsInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timetracking/update/task/details', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingUpdateTaskDetails(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("ttimetracking/update/task/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timetracking/get/all/weeks/task/details/by/employeeid/list', async function (req, res) {

        const [err, resData] = await timeTrackingService.getAllTasksOfAllWeeksByEmpId(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/all/weeks/task/details/by/employeeid/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timetracking/get/child/task', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingGetChildTask(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/child/task | Error: ", err);
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

    //------------------timesheet--------------------------
    
    app.post('/' + 'status/add/insert', async function (req, res) {

        const [err, resData] = await timeTrackingService.statusAddinsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("status/add/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'timesheet/get/projects/overview/each/week', async function (req, res) {

        const [err, resData] = await timeTrackingService.getAllProjectsTimesheetWeekly(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timesheet/get/projects/overview/each/week | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


}


module.exports = TimeTrackingController;
