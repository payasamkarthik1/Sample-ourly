

const SkillEmployeeMappingService = require('../services/skillEmployeeMappingService')

function skillEmployeeMappingController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const skillEmployeeMappingService = new SkillEmployeeMappingService(objectCollection)

    //@Post skill/emp/mapp/insert
    app.post('/' + 'api/' + 'skill/emp/mapp/insert',
        async function (req, res) {

            const [err, resData] = await skillEmployeeMappingService.skillEmpMappInsert(req.body);
            if (!err) {
                console.log("skill/emp/mapp/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post skill/emp/mapp/insert
    app.post('/' + 'api/' + 'skill/emp/mapp/update/status/approved',
        async function (req, res) {

            const [err, resData] = await skillEmployeeMappingService.skillEmpMappUpdateStatusApproved(req.body);
            if (!err) {
                console.log("skill/emp/mapp/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post skill/emp/mapp/insert
    app.post('/' + 'api/' + 'skill/emp/mapp/update/status/rejected',
        async function (req, res) {

            const [err, resData] = await skillEmployeeMappingService.skillEmpMappUpdateStatusRejected(req.body);
            if (!err) {
                console.log("skill/emp/mapp/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Post skill/emp/mapp/get/emps/under/lead
    app.post('/' + 'api/' + 'skill/emp/mapp/get/emps/under/lead/skill/list',

        async function (req, res) {
            const [err, resData] = await skillEmployeeMappingService.skillEmpMappGetEmpsUnderLeadSkillList(req.body);
            if (!err) {
                console.log("skill/emp/mapp/get/emps/under/lead | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/get/emps/under/lead| Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



    //@Get skill/emp/mapp/get/all/emps/skill/list
    app.get('/' + 'api/' + 'skill/emp/mapp/get/all/emps/skill/list',

        async function (req, res) {
            const [err, resData] = await skillEmployeeMappingService.skillEmpMappGetAllEmpsSkillList(req.body);
            if (!err) {
                console.log("skill/emp/mapp/get/all/emps/skill/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/get/all/emps/skill/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Get skill/emp/mapp/get/skills/submitted/to/emp/list
    app.post('/' + 'api/' + 'skill/emp/mapp/get/skills/submitted/to/emp/list',

        async function (req, res) {
            const [err, resData] = await skillEmployeeMappingService.skillEmpMappGetSkillSubmittedToEmp(req.body);
            if (!err) {
                console.log("skill/emp/mapp/get/skills/submitted/to/emp/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/get/skills/submitted/to/emp/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



    //@Get skill/emp/mapp/remove/mapping/delete
    app.post('/' + 'api/' + 'skill/emp/mapp/remove/mapping/delete',

        async function (req, res) {
            const [err, resData] = await skillEmployeeMappingService.skillEmpMappRemoveMappDelete(req.body);
            if (!err) {
                console.log("skill/emp/mapp/remove/mapping/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/remove/mapping/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Get skill/emp/mapp/get/all/skills/submitted/for/admin
    app.get('/' + 'api/' + 'skill/emp/mapp/get/all/skills/submitted/for/admin',
        async function (req, res) {
            const [err, resData] = await skillEmployeeMappingService.skillEmpMappGetAllSkillsSubmittedToAdmin(req.body);
            if (!err) {
                console.log("skill/emp/mapp/get/all/skills/submitted/for/admin | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("skill/emp/mapp/get/all/skills/submitted/for/admin | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



          //@Get skill/emp/mapp/get/all/skills/submitted/for/admin
    app.get('/' + 'api/' + 'skill/emp/mapp/get/all/emps/all/skills',
    async function (req, res) {
        const [err, resData] = await skillEmployeeMappingService.getAll(req.body);
        if (!err) {
            console.log("skill/emp/mapp/get/all/skills/submitted/for/admin | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("skill/emp/mapp/get/all/skills/submitted/for/admin | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
}




module.exports = skillEmployeeMappingController;
