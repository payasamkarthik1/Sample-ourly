
const AdminServices = require("../services/adminService");
const Validations = require('../utils/validations')
const RolesDepartmentDesignationService = require("../services/rolesDepartmentDesignationService");




function RolesDepartmentDesignation(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const rolesDepartDesignService = new RolesDepartmentDesignationService(objectCollection)
    const validations = new Validations(objectCollection)



    app.post('/' + 'role/create/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.rolesInsert(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("roles/add | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    app.post('/' + 'department/create/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.departmentInsert(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("departments/add | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    app.post('/' + 'designation/craete/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.designationInsert(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designations/add | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    app.get('/' + 'role/get/all/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllRoles(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("roles/get/all/select | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    app.get('/' + 'department/get/all/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllDepartments(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("departments/get/all/select | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })
    app.get('/' + 'designation/get/all/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllDesignations(req.body);
            if (!err) {
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designations/get/all/select | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    app.get('/' + 'get/all/roles/depart/design/list', async function (req, res) {
        const [err, resData] = await rolesDepartDesignService.getAllRolesDepartDesign(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/all/rolea/depart/design| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })





}


module.exports = RolesDepartmentDesignation;
