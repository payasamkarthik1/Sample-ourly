
const Validations = require('../utils/validations')
const RolePermissionEmployeeMapping = require('./rolePermissionEmployeeMappingService')
const LeadService = require('./leadService')


function UserService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const validations = new Validations(objectCollection)
    const rolePermissionEmployeeMapping = new RolePermissionEmployeeMapping(objectCollection)
    const leadService = new LeadService(objectCollection)

    this.userLogin = async function (request) {
        let responseData = [],
            error = true;

        const [err, data] = await validations.userLoginValidation(request)
        if (err) {
            error = err,
                responseData = data
        }
        else {
            const [err1, resData1] = await validations.userDetailsList(request)
            if (!err1) {
                const [err2, resData2] = await validations.userLoginPasswordCheck(request, resData1)
                if (!err2) {
                    const [err3, resData3] = await this.userLoginInsert(request, resData1)
                    resData3[0].email == "info@pronteff.com" ? (resData3[0].is_admin = 1, resData3[0].is_team = 1, request.is_admin = 1, request.role_id = 2) : (resData3[0].is_admin = 0, request.is_admin = 0, request.role_id = 0)
                    request.employee_id = resData3[0].employee_id
                    //get the permissions assign to the employee
                    const [err, permiss] = await rolePermissionEmployeeMapping.rolePermissionEmployeeget(request, 3)
                    //employee having emps assign under him if assign  is_team =1 else is_team=0
                    const [err1, data1] = await leadService.getEmployessAssignUnderHeads(request, 1)
                    data1.length != 0 ? resData3[0].is_team = 1 : resData3[0].is_team = 0
                    resData3[0].email == "info@pronteff.com" ? (resData3[0].is_team = 1) : data1.length != 0 ? resData3[0].is_team = 1 : resData3[0].is_team = 0

                    resData3[0].permission_ids = permiss
                    return [err3, resData3]
                } else {
                    return [err2, resData2]
                }
            } else {
                return [err1, resData1]
            }
        }
        return [error, responseData]

    }

    this.userLoginInsert = async function (request, resData1) {

        let responseData = [],
            error = true;
        const jwtToken = await util.generateJwtToken(resData1)

        const paramsArr = new Array(
            resData1[0].employee_id,
            resData1[0].email,
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
                    console.log("err-------" + err);
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
            const [err, data] = await validations.userProfileValidation(request)
            if (!err) {
                const paramsArr = new Array(
                    resData1.data[0].employee_id,
                    resData1.data[0].email,
                    request.phone_number,
                );
                const queryString = util.getQueryString('user_profile_update', paramsArr);
                if (queryString !== '') {
                    await db.executeQuery(0, queryString, request)
                        .then((data) => {
                            if (data[0].message === "data") {
                                error = false
                                responseData = [{ message: "User Profile updated" }];
                            } else {
                                error = true,
                                    responseData = [{ message: data[0].message }];
                            }
                        }).catch((err) => {
                            console.log("err-------" + err);
                            error = err
                        })
                }
            } else {
                error = err,
                    responseData = data
            }
            return [error, responseData];
        }
        return [error, responseData];

    }

    this.SendForgetPasswordLink = async function (request) {

        let responseData = [],
            error = true;
        try {
            const [err1, resData1] = await validations.userDetailsList(request)
            if (!err1) {
                const [err2, resData2] = await validations.addForgetPasswordDetails(request);
                request.unique_id = resData2[0].unique_id;
                request.time = resData2[0].time;
                await util.nodemailerSender(request, resData1).then((data) => {
                    error = false;
                    responseData = [{ message: "sended success" }]
                }).catch((err) => {
                    error = err;
                })

            } else {
                error = err1
                responseData = resData1
            }
        } catch (err) {
            console.log("err-------" + err);
            error = err
        }
        return [error, responseData]
    }

}



module.exports = UserService;
