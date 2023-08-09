
const Validations = require('../utils/validations')
const AnalyzeServices = require('../services/analyzeServices')

function Analyze(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const analyzeServices = new AnalyzeServices(objectCollection)
    const validations = new Validations(objectCollection)


    //@Post analyze/get/dashboad/overview
    app.post('/' + 'api/' + 'analyze/get/dashboad/overview',
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
    app.post('/' + 'api/' + 'analyze/get/dashboad/all/tasks/weekly/filter/by/descrip',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getAllTasksFilterByDescrip(req.body);
            if (!err) {
                console.log("analyze/get/dashboad/all/tasks/weekly/filter/by/descrip | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/dashboad/all/tasks/weekly/filter/by/descrip | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post 'analyze/get/all/tasks/weekly/by/empid/list
    app.post('/' + 'api/' +'analyze/get/all/tasks/weekly/by/empid/list',

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



    //@Post analyze/get/report/summary
    app.post('/' + 'api/' +'analyze/get/report/summary',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getReportSummary(req.body);
            if (!err) {
                console.log("analyze/get/report/summary | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/summary | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post analyze/get/report/detailed
    app.post('/' + 'api/' +'analyze/get/report/detailed',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getReportDetailed(req.body);
            if (!err) {
                console.log("aanalyze/get/report/detailed | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/detailed | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post analyze/get/report/weekly
    app.post('/' +'api/' + 'analyze/get/report/weekly',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getReportWeekly(req.body);
            if (!err) {
                console.log("analyze/get/report/weekly | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/weekly | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post analyze/get/report/summary/
    app.post('/' + 'api/' +'analyze/get/report/summary/group/by/user',
        async function (req, res) {

            const [err, resData] = await analyzeServices.getReportSummaryGroupByUser(req.body);
            if (!err) {
                console.log("analyze/get/report/weekly | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/weekly | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Post analyze/get/report/summary/in/active/project
    app.post('/' + 'api/' + 'analyze/get/report/summary/in/active/project',

        async function (req, res) {

            const [err, resData] = await analyzeServices.getInActiveProjectReportSummary(req.body);
            if (!err) {
                console.log("analyze/get/report/summary/in/active/project | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("analyze/get/report/summary/in/active/project | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

  //@Post analyze/get/report/summary/in/active/project
  app.post('/' + 'api/' + 'analyze/get/report/summary/in/active/project',

  async function (req, res) {

      const [err, resData] = await analyzeServices.getInActiveProjectReportSummary(req.body);
      if (!err) {
          console.log("analyze/get/report/summary/in/active/project | Error: ", err);
          res.json(responseWrapper.getResponse({}, resData, 200, req.body));
      } else {
          console.log("analyze/get/report/summary/in/active/project | Error: ", err);
          res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
      }
  })


  
  //@Post analyze/get/report/summary/in/active/project
  app.post('/' + 'api/' + 'analyze/get/report/summary/active/project',

  async function (req, res) {

      const [err, resData] = await analyzeServices.getActiveProjectReportSummary(req.body);
      if (!err) {
          console.log("analyze/get/report/summary/in/active/project | Error: ", err);
          res.json(responseWrapper.getResponse({}, resData, 200, req.body));
      } else {
          console.log("analyze/get/report/summary/in/active/project | Error: ", err);
          res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
      }
  })



}


module.exports = Analyze;
