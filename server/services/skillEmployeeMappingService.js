

const LeadService = require('../services/leadService')
const SkillServices = require('../services/skillServices');
const Util = require('../utils/util');


function skillEmployeeMappingService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const leadService = new LeadService(objectCollection)
    const skillServices = new SkillServices(objectCollection)


    this.skillEmpMappInsert = async function (request) {
        console.log("--------------enterd skillEmpMappInsert----------------");
        let responseData = [],
            error = true;
        const [err1, res] = await this.getSkillAssignedEmployeeId(request);
        request.send_to_employee_id = res[0].employee_id;
        const paramsArr = new Array(
            request.from_employee_lead_id,
            request.employee_id,
            request.send_to_employee_id,
            request.skill_id,
            request.rating,
            request.from_employee_lead_note,
            request.note,
            request.status_id,
            util.getCurrentUTCTime(),
        );

        const queryString = util.getQueryString('skill_emp_mapp_insert', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_insert=====================')
                    console.log(data)
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

    this.skillEmpMappUpdateStatusApproved = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_employee_mapping_id,
            request.note,
            request.approved_rejected_by_emp_id,
            request.rating,
            util.getCurrentUTCTime(),
            1
        );

        const queryString = util.getQueryString('skill_emp_mapp_update', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_update=====================')
                    console.log(data)
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

    this.skillEmpMappUpdateStatusRejected = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_employee_mapping_id,
            request.note,
            request.approved_rejected_by_emp_id,
            null,
            util.getCurrentUTCTime(),
            2
        );

        const queryString = util.getQueryString('skill_emp_mapp_update', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_update=====================')
                    console.log(data)
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

    this.skillEmpMappGetAllEmpsSkillList = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_all_emps_skill_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_get_emps_under_lead=====================')
                    console.log(data)
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

    this.skillEmpMappGetSkillSubmittedToEmp = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString()
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_skills_sumitted_to_emp', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_get_skills_sumitted_to_emp=====================')
                    console.log(data)
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

    this.skillEmpMappGetEmpsUnderLeadSkillListFinal = async function (request) {
        let data = {};
        //get all emps team level
        request.employee_id = request.lead_employee_id
        let emps = await leadService.getEmpsUnderHeadsLevel1(request)
        console.log('===============all level=====================')
        console.log(emps)
        console.log('====================================')
        emps = await util.getDataInAlphabeticalOrderAsPerFullName(emps);
        //get team level empe from skill mapp
        data.employee_id = request.lead_employee_id
        const [err, data1] = await this.getEmpUnderLead(data);
        console.log('==================data from skill==================')
        console.log(data1)
        console.log('====================================')


        async function mergeArraysByEmployeeId(arr1, arr2) {
            arr1.forEach((obj1) => {
                const matchingObjects = arr2.filter((obj2) =>

                    obj1.employee_id == obj2.employee_id);

                if (matchingObjects.length > 0) {
                    // Merge the objects if a match is found and add the "details" object as an array
                    obj1.skill_details = matchingObjects;
                } else {
                    // Add an empty "details" array if no match is found
                    obj1.skill_details = [];
                }
            });
        }
        await mergeArraysByEmployeeId(emps, data1)
        console.log("=====================emps=============", emps)
        return [error, emps];
    }

    this.skillEmpMappGetEmpsUnderAdminSkillList = async function (request) {
        console.log('====================================')
        console.log("enee")
        console.log('====================================')
        let data = {};
        //get all emps team level
        request.employee_id = request.lead_employee_id
        request.role_id = 2
        const [err1, data1] = await leadService.getEmployessAssignUnderHeadsAdminAndEmpl(request, 1)
        console.log('===============getEmployessAssignUnderHeadsAdminAndEmpl=============')
        console.log(data1)
        console.log('====================================')

        //get team level empe from skill mapp
        data.employee_id = request.lead_employee_id
        const [err2, data2] = await this.getEmpUnderAdmin(data);
        console.log('==================helper2l==================')
        console.log(data2)
        console.log('====================================')


        async function mergeArraysByEmployeeId(arr1, arr2) {
            arr1.forEach((obj1) => {
                const matchingObjects = arr2.filter((obj2) =>

                    obj1.employee_id == obj2.employee_id);

                if (matchingObjects.length > 0) {
                    // Merge the objects if a match is found and add the "details" object as an array
                    obj1.skill_details = matchingObjects;
                } else {
                    // Add an empty "details" array if no match is found
                    obj1.skill_details = [];
                }
            });
        }
        await mergeArraysByEmployeeId(data1, data2)

        return [error, data1];

    }

    this.getEmpUnderLead = async function (data, request) {
        console.log('================helper1====================')
        console.log(data)
        console.log('====================================')
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data.employee_id.toString(),
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_emps_under_lead_skill_list', paramsArr);

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

    this.getEmpUnderAdmin = async function (data, request) {
        console.log('================helper1====================')
        console.log(data)
        console.log('====================================')
        let responseData = [],
            error = true;
        const paramsArr = new Array(
            data.employee_id.toString(),
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_emps_under_admin_skill_list', paramsArr);

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

    // this.skillEmpMappGetEmpsUnderLeadSkillList = async function (request) {

    //     let responseData = [],
    //         error = true;
    //     const paramsArr = new Array(
    //         request.lead_employee_id.toString(),
    //     );

    //     const queryString = util.getQueryString('skill_emp_mapp_get_emps_under_lead_skill_list', paramsArr);

    //     if (queryString !== '') {
    //         await db.executeQuery(1, queryString, request)
    //             .then(async (data) => {
    //                 request.employee_id = request.lead_employee_id;
    //                 const [err, resp] = await leadService.getEmployessAssignUnderHeads(request, 1)
    //                 console.log('=================getEmployessAssignUnderHeads==================')
    //                 console.log(resp)
    //                 console.log('====================================')

    //                 console.log('=============skill_emp_mapp_get_emps_under_lead=====================')
    //                 console.log(data)
    //                 console.log('====================================')

    //                 async function mergeArraysByEmployeeId(arr1, arr2) {
    //                     arr1.forEach((obj1) => {
    //                         const matchingObjects = arr2.filter((obj2) =>

    //                             obj1.employee_id == obj2.employee_id);

    //                         if (matchingObjects.length > 0) {
    //                             console.log("sss");
    //                             // Merge the objects if a match is found and add the "details" object as an array
    //                             obj1.skill_details = matchingObjects;
    //                         } else {
    //                             // Add an empty "details" array if no match is found
    //                             obj1.skill_details = [];
    //                         }
    //                     });
    //                 }
    //                 await mergeArraysByEmployeeId(resp, data)
    //                 responseData = resp;
    //                 error = false
    //             }).catch((err) => {
    //                 console.log("err-------" + err);
    //                 error = err
    //             })
    //         return [error, responseData];
    //     }

    // }

    this.skillEmpMappRemoveMappDelete = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_employee_mapping_id.toString()
        );

        const queryString = util.getQueryString('skill_emp_mapp_delete', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_delete=====================')
                    console.log(data)
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

    this.skillEmpMappGetAllSkillsSubmittedToAdmin = async function (request) {
        console.log("----------------entered skillEmpMappGetAllSkillsSubmittedToAdmin---------------");

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_all_skills_sumitted_to_admin', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_get_all_skills_sumitted_to_admin=====================')
                    console.log(data)
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


    this.getAllEmpsAllSkills = async function (request) {
        console.log("----------------entered skillEmpMappGetAllSkillsSubmittedToAdmin---------------");

        let responseData = [],
            error = true;
        const paramsArr = new Array(
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_all_emps_skill_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('=============skill_emp_mapp_get_all_emps_skill_list=====================')
                    console.log(data)
                    console.log('====================================')
                    const [err, data1] = await skillServices.getAllSkills(request);
                    const skills = await data1.map(row => row.skill_name);
                    console.log('=================getAllSkills===================')
                    console.log(skills)
                    console.log('====================================')
                    const transformedResponse = {};
                    await data.forEach((item) => {
                        const { employee_id, employee_name, skill_name, rating,emp_log_state } = item;

                        if (!transformedResponse[employee_id]) {
                            transformedResponse[employee_id] = {
                                employee_id: employee_id,
                                employee_name: employee_name,
                                emp_log_state:emp_log_state
                            };
                        }
                        transformedResponse[employee_id][skill_name] = rating;
                    });
                    let finalResponse = Object.values(transformedResponse);
                    console.log('===============finalResponse=====================');
                    console.log(finalResponse);
                    console.log('====================================');
                    finalResponse = await util.getDataInAlphabeticalOrder(finalResponse);//sort the finalResponse in alphabetical order
                    responseData.push({ skillNames: skills })
                    responseData.push({ skillEmpRatings: finalResponse })
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }

    this.getAllDetailsByEmployeeId = async function (request) {
        console.log("----------------entered skillEmpMappGetAllSkillsSubmittedToAdmin---------------");

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.employee_id.toString(),
        );

        const queryString = util.getQueryString('skill_employee_mapping_get_all_deatils_by_employee_id', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log(data)

                    let result = [];
                    const groupedData = {};
                    data.flat().forEach((item) => {

                        const { skill_id, skill_name, ...rest } = item;

                        if (!groupedData[item.skill_id]) {
                            groupedData[item.skill_id] = {
                                skill_id: item.skill_id,
                                skill_name: item.skill_name,
                                data: []
                            };
                        }
                        groupedData[item.skill_id].data.push(rest);
                    });
                    for (const key in groupedData) {
                        if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
                            result.push(groupedData[key]);
                        }
                    }
                    responseData = result;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }

    }
    this.getSkillAssignedEmployeeId = async function (request) {


        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.skill_id.toString(),
        )
        console.log("skill_id", paramsArr);
        const queryString = util.getQueryString('skill_get_skill_assigned_employeeid_by_skill_id', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false;
                })
                .catch((err) => {
                    console.log("error-------" + err)
                    error = true;
                })
            return [error, responseData];
        }

    }
}


module.exports = skillEmployeeMappingService;
