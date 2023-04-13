
const EmployeeService = require('./employeeService')

function LeadService(objectCollection) {
    const util = objectCollection.util;
    const db = objectCollection.db;
    const employeeService = new EmployeeService(objectCollection)

    //get emps under admin and employee
    this.getEmployessAssignUnderHeadsAdminAndEmpl = async function (request, flag) {
        var users = [], groups = [], dataRepeat = []
        if (request.role_id == 2) {
            const [err, data] = await employeeService.getAllEmployees()
            if (data.length != 0) {
                dataRepeat = data
                do {
                    data1 = await this.seperationUsersAndHeads(dataRepeat, request, users, groups)
                    dataRepeat = data1
                } while (dataRepeat.length != 0)

                if (users.length != 0) {
                    const uniqueids = [];
                    const uniqueEmps = users.filter(element => {
                        const isDuplicate = uniqueids.includes(element.employee_id);
                        if (!isDuplicate) {
                            uniqueids.push(element.employee_id);
                            return true;
                        }
                        return false;
                    });
                    users = uniqueEmps
                }
                if (groups.length != 0) {
                    const uniqueids = [];
                    const uniqueEmps = groups.filter(element => {
                        const isDuplicate = uniqueids.includes(element.employee_id);
                        if (!isDuplicate) {
                            uniqueids.push(element.employee_id);
                            return true;
                        }
                        return false;
                    });
                    groups = uniqueEmps

                }
            }
        }
        else {
            var data = await this.getEmpsUnderHeadsLevel1(request)
            if (data.length != 0) {
                dataRepeat = data
                do {
                    data1 = await this.seperationUsersAndHeads(dataRepeat, request, users, groups)
                    dataRepeat = data1
                } while (dataRepeat.length != 0)
            }
        }
        //flag 1 to get only users
        //flag 2  to get users and groups
        if (flag == 1) {
            return [false, users]
        } else {
            if (groups.length != 0) {
                groups.map((item) => {
                    item.lead_assigned_head = item.lead_assigned_employee_id;
                    delete item.lead_assigned_employee_id;
                    item.lead_assigned_employee_id = item.employee_id;
                })

            }
            users.sort((a, b) => a.first_name.localeCompare(b.first_name))
            groups.sort((a, b) => a.full_name.localeCompare(b.full_name))
            return [false, [{ users, groups }]]
        }
    }

    //get emps under  employee not for admin
    this.getEmployessAssignUnderHeads = async function (request, flag) {
        var users = [], groups = [], dataRepeat = []
        var data = await this.getEmpsUnderHeadsLevel1(request)
        if (data.length != 0) {
            dataRepeat = data
            do {
                data1 = await this.seperationUsersAndHeads(dataRepeat, request, users, groups)
                dataRepeat = data1
            } while (dataRepeat.length != 0)
        }
        //flag 1 to get only users
        //flag 2  to get users and groups
        if (flag == 1) {
            return [false, users]
        } else {
            if (groups.length != 0) {
                groups.map((item) => {
                    item.lead_assigned_head = item.lead_assigned_employee_id;
                    delete item.lead_assigned_employee_id;
                    item.lead_assigned_employee_id = item.employee_id;
                })

            }
            return [false, [{ users, groups }]]
        }
    }

    this.seperationUsersAndHeads = async function (data, request, users, groups) {
        let empsUnder = []
        for (let j = 0; j < data.length; j++) {
            request.employee_id = data[j].employee_id
            var data1 = await this.getEmpsUnderHeadsLevel1(request)
            if (data1.length != 0) {
                if (data[j].email !== "admin@pronteff.com") {
                    users.push(data[j])
                    Array.prototype.push.apply(empsUnder, data1);
                    groups.push(data[j])
                }
            } else {
                if (data[j].email !== "admin@pronteff.com") {
                    users.push(data[j])
                }

            }
        }
        return empsUnder
    }

    this.getEmpsUnderHeadsLevel1 = async function (request) {
        let responseData = []

        const paramsArr = new Array(
            request.employee_id.toString(),
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
