
const ProjectService = require("../services/projectService");

function ProjectController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const projectService = new ProjectService(objectCollection)


    //----------------client----------------

    //@Post project/add/client/insert
    app.post('/' + 'project/add/client/insert', async function (req, res) {
        const [err, resData] = await projectService.addClientInsert(req.body, res);
        if (!err) {
            console.log("project/add/client/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/client/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/remove/client/delete
    app.post('/' + 'project/remove/client/delete', async function (req, res) {
        const [err, resData] = await projectService.removeClientDelete(req.body, res);
        if (!err) {
            console.log("project/remove/client/delete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/remove/client/delete | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/update/client
    app.post('/' + 'project/update/client/details', async function (req, res) {
        const [err, resData] = await projectService.updateClientDetails(req.body, res);
        if (!err) {
            console.log("project/update/client/details | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/update/client/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/get/all/clients/select
    app.get('/' + 'project/get/all/clients/select', async function (req, res) {
        const [err, resData] = await projectService.getAllClientsSelect(req.body, res);
        if (!err) {
            console.log("project/get/all/clients/select| Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/get/all/clients/selectt| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })



    //@Post project/add/projects/insert
    app.post('/' + 'project/add/projects/insert', async function (req, res) {
        const [err, resData] = await projectService.addProjectsToClientInsert(req.body, res);
        if (!err) {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/update/project/details
    app.post('/' + 'project/update/project/details', async function (req, res) {
        const [err, resData] = await projectService.updateProjectDetails(req.body, res);
        if (!err) {
            console.log("project/update/project/details | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/update/project/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/delete/project/remove
    app.post('/' + 'project/delete/project/remove', async function (req, res) {
        const [err, resData] = await projectService.removeProjectDelete(req.body, res);
        if (!err) {
            console.log("project/delete/project/remove | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/remove/complete
    app.post('/' + 'project/inactive/to/active', async function (req, res) {
        const [err, resData] = await projectService.inactiveProjToActive(req.body, res);
        if (!err) {
            console.log("project/inactive/to/active | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/inactive/to/active | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    
    //@Post project/remove/complete
    app.post('/' + 'project/remove/complete', async function (req, res) {
        const [err, resData] = await projectService.deleteProjectComplete(req.body, res);
        if (!err) {
            console.log("project/remove/complete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/remove/complete | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/get/all/projects/select
    app.get('/' + 'project/get/all/projects/select', async function (req, res) {
        const [err, resData] = await projectService.getAllProjectsSelect(req.body, res);
        if (!err) {
            console.log("project/get/all/projects/select | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/get/all/projects/select | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })



    //@Post project/get/all/tags/list
    app.get('/' + 'project/get/all/tags/list', async function (req, res) {
        const [err, resData] = await projectService.getAllTagsSelect(req.body, res);
        if (!err) {
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/get/all/tags/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/add/tag/insert
    app.post('/' + 'project/add/tag/insert', async function (req, res) {
        const [err, resData] = await projectService.addTagsInsert(req.body, res);
        if (!err) {
            console.log("project/add/tag/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/tag/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/remove/tag/delete
    app.post('/' + 'project/remove/tag/delete', async function (req, res) {
        const [err, resData] = await projectService.removeTagDelete(req.body, res);
        if (!err) {
            console.log("project/remove/tag/delete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/remove/tag/delete | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post project/update/tag
    app.post('/' + 'project/update/tag/details', async function (req, res) {
        const [err, resData] = await projectService.updateTagDetails(req.body, res);
        if (!err) {
            console.log("project/update/tag/details | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/update/tag/details | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })
}


module.exports = ProjectController;
