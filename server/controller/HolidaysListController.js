
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const readXlsxFile = require('read-excel-file/node');
const { dirname } = require("path");
const HolidaysListService = require('../services/HolidaysListService')



function HolidayListController(objectCollection) {

    const app = objectCollection.app
    const util = objectCollection.util
    const responseWrapper = objectCollection.responseWrapper
    const holidaysListService = new HolidaysListService(objectCollection)


    app.post('/' + 'holidays/get/all/list', async function (req, res) {
        const [err, resData] = await holidaysListService.getHolidayslistSelect(req.body, res);
        if (!err) {
            console.log("holidays/get/all/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("holidays/get/all/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )

    app.post('/' + 'holidays/add/upload/list', async function (req, res) {
        const [err, resData] = await holidaysListService.addHolidaysList(req.body, res);
        if (!err) {
            console.log("holidays/add/upload/list | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("holidays/add/upload/list | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )

    app.post('/' + 'holidays/remove/list/delete', async function (req, res) {
        const [err, resData] = await holidaysListService.add(req.body, res);
        if (!err) {
            console.log("holidays/remove/list/delete | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("holidays/remove/list/delete | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )
}




module.exports = HolidayListController;
