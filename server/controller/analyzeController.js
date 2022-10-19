
const AdminServices = require("../services/adminService");
const Validations = require('../utils/validations')
const AnalyzeServices = require('../services/analyzeServices')
const RolesDepartmentDesignationService = require("../services/rolesDepartmentDesignationService");




function Analyze(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const analyzeServices = new AnalyzeServices(objectCollection)
    const rolesDepartDesignService = new RolesDepartmentDesignationService(objectCollection)
    const validations = new Validations(objectCollection)


    //@Post analyze/get/dashboad/overview
    app.post('/' + 'analyze/get/dashboad/overview',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getDasboardOverview(req.body);
            if (!err) {
                console.log("analyze/get/dashboad/overview | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/dashboad/overview | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post analyze/get/dashboad/all/tasks/weekly/filter/by/descrip
    app.post('/' + 'analyze/get/dashboad/all/tasks/weekly/filter/by/descrip',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getAllTasksWeeklyFilterByDescrip(req.body);
            if (!err) {
                console.log("analyze/get/dashboad/all/tasks/weekly/filter/by/descrip | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/dashboad/all/tasks/weekly/filter/by/descrip | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post 'analyze/get/all/tasks/weekly/by/empid/list
    app.post('/' + 'analyze/get/all/tasks/weekly/by/empid/list',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getAllTasksInWeekByEmpId(req.body);
            if (!err) {
                console.log("'analyze/get/all/tasks/weekly/by/empid/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("'analyze/get/all/tasks/weekly/by/empid/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })






    //--------------------------reports--------------------

    // //@Post analyze/get/report/summary
    // app.post('/' + 'analyze/get/report/summary',

    //     async function (req, res) {

    //         const [err, resData] = await analyzeServices.getReportSummary(req.body);
    //         if (!err) {
    //             console.log("analyze/get/report/summary | Error: ", err);
    //             res.json(responseWrapper.getResponse({}, resData, 200, req.body));
    //         } else {
    //             console.log("analyze/get/report/summary | Error: ", err);
    //             res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
    //         }
    //     })

    // //@Post analyze/get/report/detailed
    // app.post('/' + 'analyze/get/report/detailed',

    //     async function (req, res) {

    //         const [err, resData] = await analyzeServices.getReportDetailed(req.body);
    //         if (!err) {
    //             console.log("analyze/get/report/detailed | Error: ", err);
    //             res.json(responseWrapper.getResponse({}, resData, 200, req.body));
    //         } else {
    //             console.log("analyze/get/report/detailed | Error: ", err);
    //             res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
    //         }
    //     })

    // //@Post analyze/get/report/weekly
    // app.post('/' + 'analyze/get/report/weekly',

    //     async function (req, res) {

    //         const [err, resData] = await analyzeServices.getReportWeekly(req.body);
    //         if (!err) {
    //             console.log("analyze/get/report/weekly | Error: ", err);
    //             res.json(responseWrapper.getResponse({}, resData, 200, req.body));
    //         } else {
    //             console.log("analyze/get/report/weekly | Error: ", err);
    //             res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
    //         }
    //     })



}


module.exports = Analyze;
