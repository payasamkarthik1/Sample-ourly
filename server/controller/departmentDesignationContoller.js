
const Validations = require('../utils/validations')
const DepartmentDesignationService = require("../services/departmentDesignationService");

function DepartmentDesignation(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const departmentDesignationService = new DepartmentDesignationService(objectCollection)
    const validations = new Validations(objectCollection)


    //--------department-----------

    //@Post department/add/department/insert
    app.post('/' + 'department/add/department/insert',

        async function (req, res) {

            const [err, resData] = await departmentDesignationService.departmentInsert(req.body);
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

            const [err, resData] = await departmentDesignationService.departmentRemoveDelete(req.body);
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

            const [err, resData] = await departmentDesignationService.getAllDepartments(req.body);
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

            const [err, resData] = await departmentDesignationService.addDesignByDepartId(req.body);
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

            const [err, resData] = await departmentDesignationService.getDesignByDepartId(req.body);
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

            const [err, resData] = await departmentDesignationService.getAllDesign(req.body);
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

            const [err, resData] = await departmentDesignationService.removeDesignationById(req.body);
            if (!err) {
                console.log("designation/remove/by/design/id/delete | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("designation/remove/by/design/id/delete | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })


    // //@Getrole/depart/design/get/all/list
    app.get('/' + 'role/depart/design/get/all/list',

        async function (req, res) {

            const [err, resData] = await departmentDesignationService.getAllRoleDepartDesign(req.body);
            if (!err) {
                console.log("role/depart/design/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse({}, resData, 200, req.body));
            } else {
                console.log("role/depart/design/get/all/list | Error: ", err);
                res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
            }
        })



}


module.exports = DepartmentDesignation;
