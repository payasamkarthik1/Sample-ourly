const { json } = require("body-parser");
const AdminServices = require("../services/adminService");
const ProjectService = require("../services/projectService");

const Validations = require('../utils/validations')



function ProjectController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const adminServices = new AdminServices(objectCollection)
    const projectService = new ProjectService(objectCollection)
    const validations = new Validations(objectCollection)


    app.post('/' + 'project/add/client/insert', async function (req, res) {
        const [err, resData] = await projectService.addClientInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/client/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
    
    app.post('/' + 'project/add/projects/insert', async function (req, res) {
        const [err, resData] = await projectService.addProjectsInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.get('/' + 'project/get/all/clients/select', async function (req, res) {
        const [err, resData] = await projectService.getAllClientsSelect(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/get/all/clients/selectt| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.get('/' + 'project/get/all/projects/select', async function (req, res) {
        const [err, resData] = await projectService.getAllProjectsSelect(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/get/all/projects/select | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.get('/' + 'project/get/all/tags/list', async function (req, res) {
        const [err, resData] = await projectService.getAllTagsSelect(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/get/all/tags/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    app.post('/' + 'project/add/tag/insert', async function (req, res) {
        const [err, resData] = await projectService.addTagsInsert(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/tag/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })




}


module.exports = ProjectController;
