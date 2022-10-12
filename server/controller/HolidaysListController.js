
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



    // const excelFilter = (req, file, cb) => {
    //     if (
    //         file.mimetype.includes("xlsx") ||
    //         file.mimetype.includes("spreadsheetml")
    //     ) {
    //         cb(null, true);
    //     } else {
    //         cb("Please upload only excel file.", false);
    //     }
    // };

    // var storage = multer.diskStorage({
    //     destination: './public/uploads/',
    //     filename: (req, file, cb) => {
    //         cb(null, `${Date.now()}-bezkoder-${dfile.originalname}`);
    //     },
    // });

    // var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
    //@Post analyze/get/report/filter/by/client
    // app.post('/' + 'holidays/add/upload/list',

    //     async function (req, res) {
    //         let path = 'D:/projects/clockify/clockify_backend' + "/public/uploads/" + req.file.filename;
    //         readXlsxFile(path).then((rows) => {
    //             // skip header
    //             rows.shift();

    //             let tutorials = [];

    //             rows.forEach((row) => {
    //                 let tutorial = {
    //                     holidays: row[0],
    //                     date: row[1]
    //                 };

    //                 tutorials.push(tutorial);
    //             });
    //             // importFileToDb(__basedir + '/uploads/' + req.file.filename)

    //             console.log(tutorials);
    //         })

    //     })

    app.post('/' + 'holidays/get/all/list', async function (req, res) {
        const [err, resData] = await holidaysListService.addProjectsToClientInsert(req.body, res);
        if (!err) {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )

    app.post('/' + 'holidays/add/upload/list', async function (req, res) {
        console.log('====================================')
        console.log("entered")
        console.log('====================================') 
        const [err, resData] = await holidaysListService.add(req, res);
        if (!err) {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse({}, resData, 200, req.body));
        } else {
            console.log("project/add/projects/insert | Error: ", err);
            res.json(responseWrapper.getResponse(err, resData, -9999, req.body));
        }
    }

    )
}


module.exports = HolidayListController;
