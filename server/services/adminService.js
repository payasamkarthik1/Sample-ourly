
const Validations = require('../utils/validations')
const jwt = require('jsonwebtoken')

function AdminService(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    // const validations = new Validations(objectCollection)


    // this.adminCreateUserRegistrationInsert = async function (request) {
    //     let responseData = [],
    //         error = true;
    //     const [err, respData] = await validations.userRegistrationInsertValidation(request);
    //     if (err) {
    //         return [err, respData];
    //     }
    //     else {
    //         const id = util.getRandomNumericId()
    //         const hashPassword = await util.convertTextToHash(request.password)
    //         const [err1, data1] = await this.getRolesDepartDesignById(request, request.role_id, 1);
    //         const [err2, data2] = await this.getRolesDepartDesignById(request, request.department_id, 2);
    //         const [err3, data3] = await this.getRolesDepartDesignById(request, request.designation_id, 3);

    //         const paramsArr = new Array(
    //             id,
    //             request.first_name,
    //             request.last_name,
    //             request.email,
    //             request.gender,
    //             request.phone_number,
    //             request.blood_group,
    //             request.dob,
    //             request.role_id,
    //             data1[0].role_name,
    //             request.department_id,
    //             data2[0].department_name,
    //             request.designation_id,
    //             data3[0].designation_name,
    //             hashPassword,
    //             util.getCurrentUTCTime()
    //         );

    //         const queryString = util.getQueryString('admin_create_employee_registration_insert', paramsArr);

    //         if (queryString !== '') {
    //             await db.executeQuery(0, queryString, request)
    //                 .then(async (data) => {
    //                     responseData = data;
    //                     error = false;

    //                 })
    //                 .catch((err) => {
    //                     error = err;
    //                 })
    //         }
    //     }
    //     return [error, responseData];
    // }


    // this.userLoginInsertAfterRegistration = async function (data, request) {
    //     let responseData = [],
    //         error = true;
    //     const paramsArr = new Array(
    //         data[0],
    //         data[3], //1
    //         data[4],
    //         data[7],
    //         data[8], //4
    //         data[13],
    //         await util.generateToken(request),
    //         util.getCurrentUTCTime()
    //     );
    //     const queryString = util.getQueryString('user_login', paramsArr);
    //     if (queryString !== '') {
    //         await db.executeQuery(0, queryString, request)
    //             .then((data) => {
    //                 responseData = data;
    //                 error = false
    //             }).catch((err) => {
    //                 error = err;
    //             })
    //         return [error, responseData];

    //     }

    // }

    // // this.userRegistrationInsertValidation = async function (request) {

    // //     let responseData = [],
    // //         error = true
    // //     if (Validator.isEmpty(request.name)) {
    // //         console.log("req");

    // //         responseData = 'fullname field is required'
    // //         return [true, responseData];
    // //     }
    // //     else {
    // //         error = false
    // //         return [false, responseData];

    // //     }


    // // }

    // this.userLogin = async function (request) {
    //     let responseData = [],
    //         error = true;
    //     try {
    //         const [err1, resData1] = await validations.userDetailsList(request)
    //         if (!err1) {
    //             const [err2, resData2] = await validations.userLoginPasswordCheck(request, resData1)
    //             if (!err2) {
    //                 const [err4, resData4] = await validations.userLoggedInOrNotCheck(request)
    //                 if (!err4) {
    //                     if (resData4 == 1) {
    //                         const [err3, resData3] = await this.userLoginInsert(request, resData1)
    //                         return [err3, resData3]
    //                     } else if (resData4 == 2) {
    //                         const [err3, resData3] = await this.userLoginUpdateActive(request, resData1)
    //                         return [err3, resData3]
    //                     }

    //                 } else {
    //                     return [err4, resData4]
    //                 }
    //             } else {
    //                 return [err2, resData2]
    //             }
    //         } else {
    //             return [err1, resData1]
    //         }
    //     } catch (err) {
    //         error = err
    //         return [error, responseData]
    //     }
    // }

    // this.userLoginInsert = async function (request, resData1) {
    //     let responseData = [],
    //         error = true;
    //     const jwtToken = await util.generateJwtToken(resData1)

    //     const paramsArr = new Array(
    //         resData1[0].id,
    //         resData1[0].user_name,
    //         resData1[0].email,
    //         resData1[0].role_id,
    //         resData1[0].role_name,
    //         resData1[0].password,
    //         jwtToken,
    //         util.getCurrentUTCTime()

    //     );
    //     const queryString = util.getQueryString('user_login', paramsArr);
    //     if (queryString !== '') {
    //         await db.executeQuery(0, queryString, request)
    //             .then((data) => {
    //                 responseData = data
    //                 error = false
    //             }).catch((err) => {
    //                 error = err;
    //             })

    //         return [error, responseData];

    //     }

    // }


    // this.userLogout = async function (request) {

    //     const [err1, resData1] = await util.verifyJwtToken(request);
    //     if (err1) {
    //         return [err1, resData1]
    //     } else {
    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             resData1.data[0].id,
    //             resData1.data[0].email,
    //             resData1.data[0].user_name,

    //         );
    //         const queryString = util.getQueryString('user_logout', paramsArr);
    //         if (queryString !== '') {
    //             await db.executeQuery(0, queryString, request)
    //                 .then((data) => {

    //                     error = false
    //                     responseData = [error, { message: "successfully loggedout" }];

    //                 }).catch((err) => {
    //                     error = err;
    //                 })
    //         }
    //         return [error, responseData];

    //     }

    // }

    // this.userLoginUpdateActive = async function (request, resData1) {
    //     let responseData = [],
    //         error = true;

    //     const paramsArr = new Array(
    //         resData1[0].id,
    //         resData1[0].user_name,
    //         resData1[0].email,
    //         util.getCurrentUTCTime()
    //     );
    //     const queryString = util.getQueryString('user_login_update_active', paramsArr);
    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then((data) => {
    //                 responseData = data;
    //                 error = false

    //             }).catch((err) => {
    //                 error = err;
    //             })
    //         return [error, responseData];

    //     }

    // }


    // this.userProfileUpdate = async function (request, req) {
    //     let responseData = [],
    //         error = true;

    //     const [err1, resData1] = await util.verifyJwtToken(request, req);
    //     if (err1) {
    //         error = err1
    //         responseData = resData1
    //     } else {
    //         const paramsArr = new Array(
    //             resData1.data[0].id,
    //             resData1.data[0].email,
    //             request.first_name,
    //             request.last_name,
    //             request.user_name,
    //             request.phone_name,
    //             request.image,
    //         );
    //         const queryString = util.getQueryString('user_profile_update', paramsArr);
    //         if (queryString !== '') {
    //             await db.executeQuery(0, queryString, request)
    //                 .then((data) => {
    //                     error = false
    //                     responseData = [error, { message: "Profile updated" }];

    //                 }).catch((err) => {
    //                     error = err;
    //                 })
    //         }
    //     }
    //     return [error, responseData];

    // }

    // this.userResetPassword = async function (request, res, req) {

    //     const [err1, resData1] = await util.verifyJwtToken(request, req);
    //     if (err1) {
    //         return [err1, resData1]
    //     } else {
    //         let responseData = [],
    //             error = true;
    //         const paramsArr = new Array(
    //             resData1.id,
    //             resData1.email,
    //             request.first_name,
    //             request.last_name,
    //             request.user_name,
    //             request.phone_name,
    //             request.image,
    //         );
    //         const queryString = util.getQueryString('user_profile_update', paramsArr);
    //         if (queryString !== '') {
    //             await db.executeQuery(0, queryString, request)
    //                 .then((data) => {
    //                     responseData = data;
    //                     error = false

    //                 }).catch((err) => {
    //                     error = err;
    //                 })
    //         }
    //         return [error, responseData];

    //     }

    // }




    // this.changePasswordVaildationCheck = async function (request) {
    // }

    // this.SendForgetPasswordLink = async function (request) {
    //     let responseData = [],
    //         error = true;
    //     try {
    //         const [err1, resData1] = await validations.userDetailsList(request)
    //         if (!err1) {
    //             await util.nodemailerSender(request, resData1).then((data) => {
    //                 error = false
    //                 responseData = [error, { message: "sended success" }]

    //             }).catch((err) => {
    //                 error = err
    //             })

    //         } else {
    //             error = err1
    //             responseData = resData1
    //         }
    //     } catch (err) {
    //         error = err
    //     }
    //     return [error,
    //         responseData]
    // }

    // this.clientProjectMappingInsert = async function (request, resData1) {
    //     let responseData = [],
    //         error = true;

    //     const [err, data] = await this.getAllClientsSelect()
    //     for (let i = 0; i < data.length; i++) {
    //         if (request.client_name === data[i].client_name) {
    //             console.log('====================================');
    //             console.log("outside  existed");
    //             console.log('====================================');
    //             const [err, resData] = await this.clientProjectMappingInsertExisted(request, data[i])
    //             error = err
    //             responseData = resData
    //             break;
    //         } else {

    //             console.log('====================================')
    //             console.log("new inserted")
    //             console.log('====================================')

    //             const paramsArr = new Array(
    //                 util.getRandomNumericId(),
    //                 request.client_name,
    //                 util.getRandomNumericId(),
    //                 request.project_name,
    //                 util.getCurrentUTCTime()
    //             );
    //             const queryString = util.getQueryString('create_project', paramsArr);
    //             if (queryString !== '') {
    //                 await db.executeQuery(0, queryString, request)
    //                     .then((data) => {
    //                         responseData = data;
    //                         error = false

    //                     }).catch((err) => {
    //                         console.log("---------------------------------------------------------------------------k");
    //                         error = err;
    //                     })


    //             }
    //         }

    //     }
    //     return [error, responseData];
    // }


    // this.clientProjectMappingInsertExisted = async function (request, data) {
    //     console.log("entered  existed function");

    //     let responseData = [],
    //         error = true;

    //     const paramsArr = new Array(
    //         data.client_id,
    //         data.client_name,
    //         util.getRandomNumericId(),
    //         request.project_name,
    //         util.getCurrentUTCTime()
    //     );
    //     const queryString = util.getQueryString('create_project', paramsArr);
    //     if (queryString !== '') {
    //         await db.executeQuery(0, queryString, request)
    //             .then((data) => {
    //                 responseData = data;
    //                 error = false

    //             }).catch((err) => {
    //                 error = err;
    //             })
    //         return [error, responseData];

    //     }

    // }

    // this.getAllClientsSelect = async function (request) {

    //     let responseData = [],
    //         error = true;
    //     const paramsArr = new Array(

    //     );

    //     const queryString = util.getQueryString('get_all_projects_select', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then((data) => {
    //                 responseData = data;
    //                 responseData.push({ 'total_count': data.length })
    //                 error = false
    //             }).catch((err) => {
    //                 console.log("err-------" + err);
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }


    // }

    // this.getAllProjects = async function (request) {

    //     // let token = await util.generateToken(resData1)
    //     let responseData = [],
    //         error = true;
    //     const paramsArr = new Array(

    //     );


    //     const queryString = util.getQueryString('get_all_projects_select', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then((data) => {
    //                 responseData = data;
    //                 error = false
    //             }).catch((err) => {
    //                 console.log("err-------" + err);
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }


    // }

    // this.getClientsProjectsAll = async function (request) {

    //     let responseData = [],
    //         error = true;
    //     const paramsArr = new Array(

    //     );
    //     const queryString = util.getQueryString('get_clients_projects_all', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then((data) => {
    //                 responseData = data;
    //                 error = false
    //             }).catch((err) => {
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }


    // }


    //roles,depart,desugn


   

}



module.exports = AdminService;
