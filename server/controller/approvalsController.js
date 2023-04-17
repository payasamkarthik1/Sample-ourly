
const TimeTrackingService = require('../services/timeTrackingService')

function ApprovalsController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const timeTrackingService = new TimeTrackingService(objectCollection)


    //@Post approvals/get/list
    app.post('/' + 'api/' +'approvals/get/list',

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


    //@Post approvals/get/on/approve/on/reject/list
    app.post('/' +'api/' + 'approvals/get/on/approve/on/reject/list',
        async function (req, res) {
            const [err, resData] = await timeTrackingService.getOnApproveOnRejectList(req.body);
            if (!err) {
                console.log("approvals/get/on/approve/on/reject/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("approvals/get/on/approve/on/reject/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post approvals/on/submit/for/approval
    app.post('/' +'api/' + 'approvals/on/submit/for/approval',

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
    app.post('/' + 'api/' +'approvals/on/approved',

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
    app.post('/' +'api/' + 'approvals/on/reject',
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

    //@Post timesheet/on/withdraw
    app.post('/' + 'api/' +'timesheet/on/withdraw',

        async function (req, res) {

            const [err, resData] = await timeTrackingService.onWithdraw(req.body);
            if (!err) {
                console.log("timesheet/on/withdraw | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("timesheet/on/withdraw | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

}


module.exports = ApprovalsController;
