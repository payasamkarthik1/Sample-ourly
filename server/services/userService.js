
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

function UserService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)




    this.userLoginInsertAfterRegistration = async function (data, request) {
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data[0],
            data[3], //1
            data[4],
            data[7],
            data[8], //4
            data[13],
            await util.generateToken(request),
            util.getCurrentUTCTime()
        );
        const queryString = util.getQueryString('user_login', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    error = err;
                })
            return [error, responseData];

        }

    }


    this.userLogin = async function (request) {
        let responseData = [],
            error = true;
        try {
            const [err1, resData1] = await validations.userDetailsList(request)
            if (!err1) {
                const [err2, resData2] = await validations.userLoginPasswordCheck(request, resData1)
                if (!err2) {
                    // const [err4, resData4] = await validations.userLoggedInOrNotCheck(request)
                    // if (!err4) {
                        // if (resData4 == 1) {
                            const [err3, resData3] = await this.userLoginInsert(request, resData1)
                            return [err3, resData3]
                        // } else if (resData4 == 2) {
                            // const [err3, resData3] = await this.userLoginUpdateActive(request, resData1)
                            // return [err3, resData3]
                        // }

                    // } else {
                    //     return [err4, resData4]
                    // }
                } else {
                    return [err2, resData2]
                }
            } else {
                return [err1, resData1]
            }
        } catch (err) {
            error = err
            return [error, responseData]
        }
    }

    this.userLoginInsert = async function (request, resData1) {
        let responseData = [],
            error = true;
        const jwtToken = await util.generateJwtToken(resData1)

        const paramsArr = new Array(
            resData1[0].employee_id,
            resData1[0].email,
            resData1[0].role_id,
            resData1[0].role_name,
            resData1[0].password,
            jwtToken,
            util.getCurrentUTCTime()

        );
        const queryString = util.getQueryString('user_login_insert', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(0, queryString, request)
                .then((data) => {
                    responseData = data
                    error = false
                }).catch((err) => {
                    error = err;
                })

            return [error, responseData];

        }

    }

    this.userLoginUpdateActive = async function (request, resData1) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            resData1[0].employee_id,
            resData1[0].email,
            util.getCurrentUTCTime()
        );
        const queryString = util.getQueryString('user_login_update', paramsArr);
        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then((data) => {
                    responseData = data;
                    error = false

                }).catch((err) => {
                    error = err;
                })
            return [error, responseData];

        }

    }


    this.userProfileUpdate = async function (request, req) {
        let responseData = [],
            error = true;

        const [err1, resData1] = await util.verifyJwtToken(request, req);
        if (err1) {
            error = err1
            responseData = resData1
        } else {
            const paramsArr = new Array(
                resData1.data[0].employee_id,
                resData1.data[0].email,
                request.first_name,
                request.last_name,
                request.phone_number,
                request.image,
            );
            const queryString = util.getQueryString('user_profile_update', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(0, queryString, request)
                    .then((data) => {
                        error = false
                        responseData = [error, { message: "Profile updated" }];

                    }).catch((err) => {
                        error = err;
                    })
            }
        }
        return [error, responseData];

    }

    this.userResetPassword = async function (request, res, req) {

        const [err1, resData1] = await util.verifyJwtToken(request, req);
        if (err1) {
            return [err1, resData1]
        } else {
            let responseData = [],
                error = true;
            const paramsArr = new Array(
                resData1.employee_id,
                resData1.email,
                request.first_name,
                request.last_name,
                request.user_name,
                request.phone_name,
                request.image,
            );
            const queryString = util.getQueryString('user_profile_update', paramsArr);
            if (queryString !== '') {
                await db.executeQuery(0, queryString, request)
                    .then((data) => {
                        responseData = data;
                        error = false

                    }).catch((err) => {
                        error = err;
                    })
            }
            return [error, responseData];

        }

    }

    this.changePasswordVaildationCheck = async function (request) {
    }

    this.SendForgetPasswordLink = async function (request) {
        let responseData = [],
            error = true;
        try {
            const [err1, resData1] = await validations.userDetailsList(request)
            if (!err1) {
                await util.nodemailerSender(request, resData1).then((data) => {
                    error = false
                    responseData = [error, { message: "sended success" }]

                }).catch((err) => {
                    error = err
                })

            } else {
                error = err1
                responseData = resData1
            }
        } catch (err) {
            error = err
        }
        return [error,
            responseData]
    }

}



module.exports = UserService;
