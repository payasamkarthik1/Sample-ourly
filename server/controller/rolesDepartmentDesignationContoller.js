
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

          //@Post role/remove/delete
    app.get('/' + 'role/remove/delete',

    async function (req, res) {

        const [err, resData] = await rolesDepartDesignService.deleteRole(req.body);
        if (!err) {
            console.log("role/remove/delete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("role/remove/delete | Error: ", err);
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
    //@Post department/remove/department/delete
    app.post('/' + 'department/remove/department/delete',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.departmentRemoveDelete(req.body);
            if (!err) {
                console.log("department/remove/department/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("department/remove/department/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Get department/get/all/departments/list
    app.get('/' + 'department/get/all/departments/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllDepartments(req.body);
            if (!err) {
                console.log("department/get/all/departments/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("department/get/all/departments/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //--------designation-----------

    //@Post designation/add/design/by/depart/id/insert
    app.post('/' + 'designation/add/design/by/depart/id/insert',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.addDesignByDepartId(req.body);
            if (!err) {
                console.log("designation/add/design/by/depart/id/insert | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designation/add/design/by/depart/id/insert | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@Get design/get/by/depart/id/list
    app.post('/' + 'designation/get/by/depart/id/list',

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

    //@Get designation/get/all/list
    app.get('/' + 'designation/get/all/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllDesign(req.body);
            if (!err) {
                console.log("designation/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designation/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })

    //@post designation/remove/by/design/id/delete
    app.post('/' + 'designation/remove/by/design/id/delete',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.removeDesignationById(req.body);
            if (!err) {
                console.log("designation/remove/by/design/id/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designation/remove/by/design/id/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    //@Getrole/depart/design/get/all/list
    app.get('/' + 'role/depart/design/get/all/list',

        async function (req, res) {

            const [err, resData] = await rolesDepartDesignService.getAllRoleDepartDesign(req.body);
            if (!err) {
                console.log("role/depart/design/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/depart/design/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



}


module.exports = RolesDepartmentDesignation;
