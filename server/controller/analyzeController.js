
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

    //--------dashboard-----------

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

    //----------reports---------------

    //@Post analyze/get/report/filter/by/client
    app.post('/' + 'analyze/get/report/filter/by/client',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getDasboardOverview(req.body);
            if (!err) {
                console.log("analyze/get/report/filter/by/client | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/filter/by/client | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post analyze/get/report/filter/by/project
    app.post('/' + 'analyze/get/report/filter/by/project',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getDasboardOverview(req.body);
            if (!err) {
                console.log("analyze/get/report/filter/by/project | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/filter/by/project | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post analyze/get/report/filter/by/project/by/tag
    app.post('/' + 'analyze/get/report/filter/by/project/by/tag',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getDasboardOverview(req.body);
            if (!err) {
                console.log("analyze/get/report/filter/by/project/by/tag | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/filter/by/project/by/tag | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })








}


module.exports = Analyze;
