
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

    //--------role-----------

    //@Post role/add/role/insert
    app.post('/' + 'role/add/role/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.roleCreateInsert(req.body);
            if (!err) {
                console.log("role/add/role/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/add/role/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Get role/get/all/roles/list
    app.get('/' + 'role/get/all/roles/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllRoles(req.body);
            if (!err) {
                console.log("role/get/all/roles/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/get/all/roles/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



    //--------department-----------

    //@Post department/add/department/insert
    app.post('/' + 'department/add/department/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.departmentInsert(req.body);
            if (!err) {
                console.log("department/add/department/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("department/add/department/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Get department/get/all/departments/list
    app.get('/' + 'department/get/all/departments/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllDepartments(req.body);
            if (!err) {
                console.log("departments/get/all/select | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("departments/get/all/select | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //--------designation-----------

    //@Post designation/add/designation/insert
    app.post('/' + 'designation/add/designation/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.designationInsert(req.body);
            if (!err) {
                console.log("designation/add/designation/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designation/add/designation/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    // //@Get designation/get/all/designations/list
    // app.get('/' + 'designation/get/all/designations/list',

    //     async function (req, res) {

    //         const [err, resData] = await rolesDepartDesignService.getAllDesignations(req.body);
    //         if (!err) {
    //             console.log("designation/get/all/designations/list | Error: ", err);
    //             res.json(responseWrapper.getResponse({}, resData, 200, req.body));
    //         } else {
    //             console.log("designation/get/all/designations/list | Error: ", err);
    //             res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
    //         }
    //     })

    //@Get get/all/roles/depart/design/list
    app.get('/' + 'get/all/roles/depart/design/list', async function (req, res) {
        const [err, resData] = await rolesDepartDesignService.getAllRolesDepartDesign(req.body, res);
        if (!err) {
            console.log("get/all/rolea/depart/design| Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("get/all/rolea/depart/design| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Get design/get/by/depart/id/list
    app.get('/' + 'design/get/by/depart/id/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getDesignByDepartId(req.body);
            if (!err) {
                console.log("design/get/by/depart/id/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("design/get/by/depart/id/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })





}


module.exports = RolesDepartmentDesignation;
