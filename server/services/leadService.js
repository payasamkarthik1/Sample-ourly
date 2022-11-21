

function LeadService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;


    this.getAllLeads = async function (request) {

        let responseData = [],
            error = true;
        // if flag = 2 get all leads at create employee form
        flag = 2
        const paramsArr = new Array(
            0,
            flag
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    //get all emps assign under lead,emerging lead, admin, superlead based on role
    this.getEmpsAssignUnderLeads = async function (request) {
        let responseData = [],
            error = true;
        groups = []
        users = []
        // responseData1 = []
        // if flag = 3 get all employess under admin and superlead
        // if flag = 4 get all employess under lead and emerging lead

        if (request.role_id == 2 || request.role_id == 5) {
            flag = 3
        } else if (request.role_id == 4) {
            flag = 4
        } else if (request.role_id == 6) {
            flag = 4
        }

        const paramsArr = new Array(
            request.lead_assigned_employee_id,
            flag
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (request.role_id == 2 || request.role_id == 5) {
                        users = data
                        //get grpups for admin and superlead
                        const [err1, data1] = await this.getGroupsUnderLeads(request, 5)
                        if (data1.length != 0) {
                            groups = data1
                        }
                        error = false
                        responseData.push({ users, groups })
                    }
                    else if (request.role_id == 4) {
                        obj1 = []
                        obj2 = []
                        let arr1 = []
                        data.filter(function (data1) {
                            if (data1.role_id == 3) {
                                obj1.push(data1)
                            } else if (data1.role_id == 6) {
                                obj2.push(data1)
                            }
                        })

                        if (obj2.length != 0) {
                            for (let i = 0; i < obj2.length; i++) {
                                request.employee_id = obj2[i].employee_id
                                const [err1, data1] = await this.getEmpsUnderEmergingLead(request)
                                Array.prototype.push.apply(arr1, data1);
                            }
                            Array.prototype.push.apply(obj1, arr1);
                            Array.prototype.push.apply(obj1, obj2);
                            console.log('=========getEmpsUnderEmergingLead================')
                            console.log(obj1)
                            console.log('====================================')

                        }
                        data = obj1;
                        users = data
                        const [err1, data1] = await this.getGroupsUnderLeads(request, 6)
                        if (data1.length != 0) {
                            groups = data1
                            responseData.push({groups})
                        }

                        error = false
                        responseData.push({users})

                    }
                    else if (request.role_id == 6) {

                        users = data
                        error = false
                        responseData.push({ users })
                    }
                    console.log('=========getEmpsAssignUnderLeads===========')
                    console.log(responseData)
                    console.log('====================================')
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    //get all emps assign under lead,emerging lead, admin, superlead based on role without groups
    this.getEmpsAssignUnderLeadsWithoutGroups = async function (request) {
        let responseData = [],
            error = true;
        // if flag = 3 get all employess under admin and superlead
        // if flag = 4 get all employess under lead and emerging lead
        if (request.role_id == 2 || request.role_id == 5) {
            flag = 3
        } else if (request.role_id == 4) {
            flag = 4
        } else if (request.role_id == 6) {
            flag = 4
        }

        const paramsArr = new Array(
            request.lead_assigned_employee_id,
            flag
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    if (request.role_id == 4) {
                        obj1 = []
                        obj2 = []
                        let arr1 = []
                        data.filter(function (data1) {
                            if (data1.role_id == 3) {
                                obj1.push(data1)
                            } else if (data1.role_id == 6) {
                                obj2.push(data1)
                            }
                        })
                        console.log('====object1=====================')
                        console.log(obj1)
                        console.log('====================================')

                        console.log('====object2=====================')
                        console.log(obj2)
                        console.log('====================================')


                        if (obj2.length != 0) {
                            for (let i = 0; i < obj2.length; i++) {
                                request.employee_id = obj2[i].employee_id
                                console.log("merging" + obj2[i].employee_id);
                                request.employee_id = obj2[i].employee_id
                                const [err1, data1] = await this.getEmpsUnderEmergingLead(request)
                                Array.prototype.push.apply(arr1, data1);
                            }
                            console.log('=========getEmpsUnderEmergingLead================')
                            console.log(arr1)
                            console.log('====================================')

                            Array.prototype.push.apply(obj1, arr1);
                            Array.prototype.push.apply(obj1, obj2);


                        }
                        data = obj1;
                        error = false

                    }
                    responseData = data
                    error = false

                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }
    }

    //get emps under emerging lead
    this.getEmpsUnderEmergingLead = async function (request) {

        let responseData = [],
            error = true;
        flag = 4
        const paramsArr = new Array(
            request.employee_id,
            flag
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

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

    //get group under lead,admin,superlead
    this.getGroupsUnderLeads = async function (request, flag) {
        console.log("----------------ENTERED INTO GET GROUPS------------------- ");
        let responseData = [],
            error = true;
        // get groups for admin(flag=5) and lead(flag=6)  
        const paramsArr = new Array(
            request.lead_assigned_employee_id,
            flag
        );

        const queryString = util.getQueryString('lead_get_leads_emps_under_lead_select', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    console.log('==========getGroupsUnderLeads========')
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




}


module.exports = LeadService;
