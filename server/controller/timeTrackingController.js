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

    //@Post timetracking/add/task/details/insert
    app.post('/' + 'api/' + 'timetracking/add/task/details/insert', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingAddTaskDetailsInsert(req.body, res);
        if (!err) {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/add/task/details/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post timetracking/update/task/details
    app.post('/' +'api/' +  'timetracking/update/task/details', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingUpdateTaskDetails(req.body, res);
        if (!err) {
            console.log("timetracking/update/task/details | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/update/task/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post timetracking/get/all/weeks/task/details/by/employeeid/list
    app.post('/' + 'api/' + 'timetracking/get/all/weeks/task/details/by/employeeid/list', async function (req, res) {

        const [err, resData] = await timeTrackingService.getAllTasksOfAllWeeksByEmpId(req.body, res);
        if (!err) {
            console.log("timetracking/get/all/weeks/task/details/by/employeeid/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/all/weeks/task/details/by/employeeid/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post timetracking/get/child/task
    app.post('/' + 'api/' + 'timetracking/get/child/task', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingGetChildTask(req.body, res);
        if (!err) {
            console.log("timetracking/get/child/task | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/child/task | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post timetracking/remove/child/task/delete
    app.post('/' + 'api/' + 'timetracking/remove/child/task/delete', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingRemoveChildTaskDelete(req.body, res);
        if (!err) {
            console.log("timetracking/remove/child/task/delete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/remove/child/task/delete | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

     //@Post timetracking/search/by/value
     app.post('/' + 'api/' + 'timetracking/search/by/value', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingSearchByValue(req.body, res);
        if (!err) {
            console.log("timetracking/search/by/value | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/search/by/value| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


    //@Post status/add/insert
    app.post('/' + 'api/' + 'status/add/insert', async function (req, res) {

        const [err, resData] = await timeTrackingService.statusAddinsert(req.body, res);
        if (!err) {
            console.log("status/add/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("status/add/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post timesheet/get/projects/overview/each/week
    app.post('/' + 'api/' + 'timesheet/get/projects/overview/each/week', async function (req, res) {

        const [err, resData] = await timeTrackingService.getAllProjectsTimesheetWeekly(req.body, res);
        if (!err) {
            console.log("timesheet/get/projects/overview/each/week | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timesheet/get/projects/overview/each/week | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post timesheet/get/team/projects/overview/each/week
    app.post('/' + 'api/' + 'timesheet/get/team/projects/overview/each/week', async function (req, res) {

        const [err, resData] = await timeTrackingService.getAllProjectsTeamTimesheetWeekly(req.body, res);
        if (!err) {
            console.log("timesheet/get/team/projects/overview/each/week | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timesheet/get/team/projects/overview/each/week | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

     //@Post copy/last/week/data/and/insert
     app.post('/' + 'api/' + 'copy/last/week/data/and/insert', async function (req, res) {
        const [err, resData] = await timeTrackingService.copyLastWeekDataAndInsert(req.body, res);
        if (!err) {
            console.log("copy/last/week/data/and/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("copy/last/week/data/and/insert ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

}


module.exports = TimeTrackingController;
