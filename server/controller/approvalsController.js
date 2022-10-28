const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const Validations = require('../utils/validations')

const TimeTrackingService = require('../services/timeTrackingService')



function ApprovalsController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const timeTrackingService = new TimeTrackingService(objectCollection)
    // const validations = new Validations(objectCollection)
    //@Post analyze/get/dashboad/overview

    //@Post approvals/get/list
    app.post('/' + 'approvals/get/list',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.getApprovalsList(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post approvals/get/by/status/id/list
    app.post('/' + 'approvals/get/by/status/id/list',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.getApprovalsListByStatusId(req.body);
            if (!err) {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post approvals/on/submit/for/approval
    app.post('/' + 'approvals/on/submit/for/approval',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.onSubmitForApproval(req.body);
            if (!err) {
                console.log("approvals/on/submit/for/approval | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/on/submit/for/approval | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post approvals/on/approved
    app.post('/' + 'approvals/on/approved',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.onApproved(req.body);
            if (!err) {
                console.log("approvals/on/approved| Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/on/approved | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post approvals/on/reject
    app.post('/' + 'approvals/on/reject',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.onReject(req.body);
            if (!err) {
                console.log("approvals/on/reject | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/on/reject | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

         //@Post approvals/on/reject
    app.post('/' + 'timeshhet/approvals/on/reject',

    async function (req, res) {

        const [err, resData] = await timeTrackingService.onReject(req.body);
        if (!err) {
            console.log("approvals/on/reject | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("approvals/on/reject | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })







}


module.exports = ApprovalsController;
