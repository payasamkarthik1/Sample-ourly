

const multer = require('multer')
const fs = require('fs')
// const path = require('path')
const readXlsxFile = require('read-excel-file/node');
const { dirname } = require("path");


function HolidaysListService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;



    this.addHolidaysList = async function (request) {
        let responseData = [],
            error = true;
        await this.holidaysListRemoveDelete();
        data1 = request.data
        for (let i = 0; i < data1.length; i++) {
            const [err, respData] = await this.addHolidaysListInsert(data1[i], request)
            error = err
            responseData = respData
        }
        return [error, responseData];

    }

    this.addHolidaysListInsert = async function (data, request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data.holidays,
            data.date,
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

    this.getHolidayslistSelect = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(

        );


        const queryString = util.getQueryString('holidays_get_list_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('====================================')
                    console.log((data))
                    console.log('====================================')
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    }

    this.holidaysListRemoveDelete = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );
        const queryString = util.getQueryString('holidays_list_remove_delete', paramsArr);

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


}


module.exports = HolidaysListService;
