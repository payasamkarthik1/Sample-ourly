const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const ProjectService = require("../services/projectService");
const TimeTrackingService = require("../services/timeTrackingService");

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
    app.post('/' + 'timetracking/get/all/task/details/list', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingTaskDetailsGetAllList(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/all/task/details/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
    app.post('/' + 'timetracking/get/task/details/by/employeeid', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingTaskDetailsGetByEmployeeId(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/task/details/by/employeeid | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
    app.post('/' + 'timetracking/get/task/details/by/employeeid/date/list', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingTaskDetailsInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/task/details/by/employeeid/date/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
    app.post('/' + 'timetracking/get/task/details/by/employeeid/search/list', async function (req, res) {

        const [err, resData] = await timeTrackingService.timetrackingTaskDetailsInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/task/details/by/employeeid/search/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'test', async function (req, res) {

        const [err, resData] = await timeTrackingService.test(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("timetracking/get/task/details/by/employeeid/search/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

}


module.exports = TimeTrackingController;
