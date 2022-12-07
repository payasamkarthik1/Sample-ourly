

const EmployeeService = require('./employeeService')

function LeadService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;

    const employeeService = new EmployeeService(objectCollection)


    this.getAllHeads = async function (request) {
        let responseData = [],
            error = true;
        //    if flag = 2 get all heads
        flag = 2

        const paramsArr = new Array(
            0,
            flag
        );

        const queryString = util.getQueryString('heads_get_emps_under_heads', paramsArr);

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

    this.getEmployessAssignUnderHeads = async function (request, flag) {
        // flag =1 get all employee except admin and super admin
        // flag =2 get users and heads separation  in tow objects
        let users = [], usrs = [], grps = []
        //role_id 2 for admin default all emps
        if (request.role_id == 2 && flag == 1) {
            console.log("-----------------admin---------------------");
            const [err, data] = await employeeService.getAllEmployees()
            if (data.length != 0) {
                users = data
                return [false, users]
            }

        } else if (request.role_id == 2 && flag == 2) {
            console.log("-----------------admin---------------------");
            const [err, data] = await employeeService.getAllEmployees()
            const [err1, data1] = await this.getAllHeads()
            users = data

            for (var i = 0; i < data1.length; i++) {
                var o = data1[i];
                o.lead_assigned_head = o.lead_assigned_employee_id;
                delete o.lead_assigned_employee_id;

                o.lead_assigned_employee_id = o.employee_id;
                delete o.employee_id;
            }

            grps = data1
            return [false, [{ users, grps }]]
        }
        else {
            console.log("-----------------not admin---------------------");
            var level1Data = await this.getEmpsUnderHeadsLevel1(request)
            console.log(level1Data);
            if (level1Data.length != 0) {
                Array.prototype.push.apply(users, level1Data)
                const dat = await this.seperationUsersAndHeads(level1Data, request, users, usrs, grps)
                if (dat.length != 0) {
                    await this.seperationUsersAndHeads(dat, request, users, usrs, grps)
                }

                return (flag == 1 ? [false, users] : greaterThanZero());

                function greaterThanZero() {
                    console.log('============grppppp============');
                    console.log(grps);
                    console.log('====================================');
                    for (let i = 0; i < grps.length; i++) {
                        grps[i].lead_assigned_head = grps[i].lead_assigned_employee_id;
                        delete grps[i].lead_assigned_employee_id;
                        grps[i].lead_assigned_employee_id = grps[i].employee_id;
                        delete grps[i].employee_id;
                    }
                    return [false, [{ users, grps }]]
                }
            } else {
                return [false, []]
            }
        }
    }

    this.seperationUsersAndHeads = async function (data, request, users, usrs, grps) {
        let heads1 = []
        for (let j = 0; j < data.length; j++) {
            if (data[j].role_id != 3) {
                grps.push(data[j])
                request.employee_id = data[j].employee_id
                var data1 = await this.getEmpsUnderHeadsLevel1(request)
                if (data1.length != 0) {
                    for (let i = 0; i < data1.length; i++) {
                        if (data1[i].role_id != 3) {
                            heads1.push(data1[i])
                            users.push(data1[i])
                            grps.push(data1[i])
                        } else {
                            users.push(data1[i])
                            usrs.push(data1[i])
                        }
                    }
                }
            } else {
                usrs.push(data[j])
            }
        }
        return heads1
    };

    this.getEmpsUnderHeadsLevel1 = async function (request) {
        console.log('========getEmpsUnderHeadsLevel1=======================')
        console.log(request)
        console.log('====================================')
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.employee_id.toString(),
            flag
        );

        const queryString = util.getQueryString('heads_get_emps_under_heads', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    responseData = data;
                    error = false
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return responseData
        }


    };

}


module.exports = LeadService;
