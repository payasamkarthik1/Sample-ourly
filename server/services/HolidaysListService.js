

const multer = require('multer')
const fs = require('fs')
// const path = require('path')
const readXlsxFile = require('read-excel-file/node');
const { dirname } = require("path");


function HolidaysListService(objectCollection) {

    this.add = async function (req) {

        let responseData = [],
            error = true;

        var storage = multer.diskStorage({
            destination: './public/uploads/',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-clockify-${file.originalname}`);
            },
        });
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1000000 },
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype.includes("xlsx") ||
                    file.mimetype.includes("spreadsheetml")
                ) {
                    cb(null, true);
                } else {
                     path = 'D:/projects/clockify/clockify_backend' + "/public/uploads"+req.file.filename;
                   console.log('===PATHHHHHHHH=============')
                   console.log(path)
                   console.log('====================================')
                     cb("Please upload only excel file.", false);
                }
            }
        }).single('excel')

        upload(req, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    // Too many images exceeding the allowed limit
                    console.log("error");
                }
            } else if (err) {
                console.log("error");
            } else {
                console.log("done");
            }
        })


        readXlsxFile(path).then(async (rows) => {
            console.log('===========rrrrrrrrrr==================')
            console.log(rows)
            console.log('====================================')
            for (let i = 0; i < rows.length; i++) {
                await this.holidaysListAddInsert(rows[i])
                error = false
            }

            return [error, responseData];

        })
    }

    this.holidaysListAddInsert = async function (row) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            row[0].holidays,
            row[1].date,

        );

        const queryString = util.getQueryString('holidays_list_add_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.getHolidaysList = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.client_id,
            request.project_id,
            request.project_name,
            request.project_code,
            request.project_color_code,
            request.tag_id,
        );


        const queryString = util.getQueryString('project_update_project_details', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    let data1 = await util.addUniqueIndexesToArrayOfObject(data)
                    responseData = data1;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }


}


module.exports = HolidaysListService;
