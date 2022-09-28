const { json } = require("body-parser");
const UserService = require("../services/userService");
const Validations = require('../utils/validations')



function UserController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const userService = new UserService(objectCollection)
    const validations = new Validations(objectCollection)


    //@Post user/login/insert
    app.post('/' + 'user/login/insert', async function (req, res) {
        const [err, resData] = await userService.userLogin(req.body, res);
        if (!err) {
            console.log("user/login/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("user/login/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post user/profile/update
    app.post('/' + 'user/profile/update', async function (req, res) {
        const [err, resData] = await userService.userProfileUpdate(req.body, req, res);
        if (!err) {
            console.log("user/profile/update | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("user/profile/update | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post user/change/password
    app.post('/' + 'user/change/password', async function (req, res) {

        const [err, resData] = await validations.oldPasswordCheck(req.body, req);
        if (!err) {
            console.log("/user/change/password| Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("/user/change/password| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })

    //@Post user/send/forget/password/link
    app.post('/' + 'user/send/forget/password/link', async function (req, res) {
        const [err, resData] = await userService.SendForgetPasswordLink(req.body, res);
        console.log(resData);
        if (!err) {
            console.log("user/send/forget/password/link| Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("user/send/forget/password/link| Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })


    //@Postuser/forget/change/password
    app.post('/' + 'user/forget/change/password', async function (req, res) {
        const [err, resData] = await validations.forgetChangePassword(req.body, res);
        if (!err) {
            console.log("user/forget/change/password | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("user/forget/change/password | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    })







}


module.exports = UserController;
