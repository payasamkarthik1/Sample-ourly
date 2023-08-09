

const LeadService = require('../services/leadService')
const SkillServices = require('../services/skillServices')


function skillEmployeeMappingService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const leadService = new LeadService(objectCollection)
    const skillServices = new SkillServices(objectCollection)


    this.skillEmpMappInsert = async function (request) {
        console.log("--------------enterd skillEmpMappInsert----------------");
        let responseData = [],
            error = true;
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

    this.skillEmpMappGetEmpsUnderLeadSkillList = async function (request) {

        let responseData = [],
            error = true;
        const paramsArr = new Array(
            request.lead_employee_id.toString(),
        );

        const queryString = util.getQueryString('skill_emp_mapp_get_emps_under_lead_skill_list', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    request.employee_id = request.lead_employee_id;
                    const [err, resp] = await leadService.getEmployessAssignUnderHeads(request, 1)
                    console.log('=================getEmployessAssignUnderHeads==================')
                    console.log(resp)
                    console.log('====================================')

                    console.log('=============skill_emp_mapp_get_emps_under_lead=====================')
                    console.log(data)
                    console.log('====================================')

                    async function mergeArraysByEmployeeId(arr1, arr2) {
                        arr1.forEach((obj1) => {
                            const matchingObjects = arr2.filter((obj2) =>

                                obj1.employee_id == obj2.employee_id);

                            if (matchingObjects.length > 0) {
                                console.log("sss");
                                // Merge the objects if a match is found and add the "details" object as an array
                                obj1.skill_details = matchingObjects;
                            } else {
                                // Add an empty "details" array if no match is found
                                obj1.skill_details = [];
                            }
                        });
                    }
                    await mergeArraysByEmployeeId(resp, data)
                    responseData = resp;
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
                        const { employee_id, employee_name, skill_name, rating } = item;

                        if (!transformedResponse[employee_id]) {
                            transformedResponse[employee_id] = {
                                employee_id: employee_id,
                                employee_name: employee_name,
                            };
                        }
                        transformedResponse[employee_id][skill_name] = rating;
                    });
                    const finalResponse = Object.values(transformedResponse);
                    console.log('===============finalResponse=====================');
                    console.log(finalResponse);
                    console.log('====================================');
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
}


module.exports = skillEmployeeMappingService;
