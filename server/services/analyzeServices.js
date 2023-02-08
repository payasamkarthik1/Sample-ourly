

const TimeTrackingService = require('../services/timeTrackingService')
const EmployeeService = require('../services/employeeService')
const LeadService = require('./leadService')


function AnalyzeServices(objectCollection) {

    const util = objectCollection.util;
    const db = objectCollection.db;
    const timeTrackingService = new TimeTrackingService(objectCollection)
    const employeeService = new EmployeeService(objectCollection)
    const leadService = new LeadService(objectCollection)


    this.getDasboardOverview = async function (request) {
        console.log("------------------------------------entered getDasboardOverview------------------------------------------");
        let responseData = []
        let data1 = []
        if (request.role_id == 2) {
            const [err8, data8] = await employeeService.getAllEmployees(request)
            data1 = data8
        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            const data10 = await leadService.getEmpsUnderHeadsLevel1(request)

            data1 = data10
        }

        //get data between given dates
        const [err2, data2] = await this.getDataByDates(request)
        console.log('=================getDataByDates====================')
        console.log("data length", data2.length)
        console.log('====================================================')

        if (data1.length != 0 && data2.length != 0) {
            //filter data with emps
            const data3 = await this.filterDataByEmps(request, data1, data2)
            console.log('=================filterDataByEmps====================')
            console.log("data length", data3.length)
            console.log('====================================================')
            if (data3.length != 0) {
                //get dashboard data overview
                const [err, data] = await this.dashboardDataCalculationOverview(request, data3)
                responseData = data
            }
        }
        return [false, responseData]
    }

    this.dashboardDataCalculationOverview = async function (request, data3) {
        let responseData = []
        totalTime = await util.sumOfTime(data3)
        const respData1 = await this.topProject(request, data3)
        const respData2 = await this.dayWiseProject(request, data3)
        const respData3 = await this.dayWiseTotalTime(request, data3)
        const respData4 = await this.overAllProject(request, data3)

        responseData.push({ total_time: totalTime, top_project: respData1 })
        responseData.push(respData2)
        responseData.push(respData3)
        responseData.push(respData4)

        return [false, responseData];


    };

    this.getAllTasksFilterByDescrip = async function (request) {
        let responseData = [],
            error = true;
        flag = 1
        const paramsArr = new Array(
            request.start_date,
            request.end_date,
            request.employee_id
        );

        const queryString = util.getQueryString('dashboard_get_top_tasks_filter_select', paramsArr);

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


    };

    this.getAllTasksInWeekByEmpId = async function (request) {
        let responseData = []
        obj = {}

        obj.firstWeekDay = (request.first_week_day)
        obj.lastWeekDay = (request.last_week_day)
        const [err, data] = await timeTrackingService.getAllTasksInThatWeeks(request, obj)

        const [err1, data1] = await timeTrackingService.getSubmittedApproveEntries(request, 1)
        const [err2, data2] = await timeTrackingService.getSubmittedApproveEntries(request, 2)

        if (data1.length != 0 || data2.length != 0) {
            if (data[0].isApp.status === "PENDING") {
                data[0].isApp.submited_by = data1[0].submitted_by.concat("(", data1[0].submited_for_approval_datetime, ")")
            } else if (data[0].isApp.status === "APPROVED") {
                data[0].isApp.submited_by = data1[0].submitted_by.concat("(", data1[0].submited_for_approval_datetime, ")")
                data[0].isApp.approved_by = data2[0].approved_by.concat("(", data2[0].approved_on_datetime, ")")
            }

        }
        responseData.push(data)
        return [err, responseData];

    };

    this.dayWiseTotalTime = async function (request, data) {
        let tt = []
        var newArray = data.reduce(function (acc, curr) {
            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.task_created_datetime === curr.task_created_datetime;
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'task_created_datetime': curr.task_created_datetime,
                    "value": [curr]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push(curr)
            }

            return acc;

        }, []);

        for (let i = 0; i < newArray.length; i++) {
            toaltime = newArray[i].value
            f = await util.sumOfTime(toaltime)
            tt.push({ task_created_datetime: newArray[i].task_created_datetime, total_time: f })
        }
        return tt

    }

    this.overAllProject = async function (request, data) {
        let responseData = []

        var newArray = data.reduce(function (acc, curr) {

            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.project_id === curr.project_id;
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'project_id': curr.project_id,
                    "value": [curr]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push(curr)
            }

            return acc;

        }, []);

        for (let i = 0; i < newArray.length; i++) {
            toaltime = newArray[i].value
            tym = await util.sumOfTime(toaltime)
            responseData.push({
                project_id: newArray[i].project_id,
                project_name: newArray[i].value[0].project_name,
                project_color_code: newArray[i].value[0].project_color_code,
                project_code: newArray[i].value[0].project_code,
                client_id: newArray[i].value[0].client_id,
                client_name: newArray[i].value[0].client_name,
                tag_id: newArray[i].value[0].tag_id,
                tag_name: newArray[i].value[0].tag_name,
                total_time: tym
            })
        }
        return responseData

    }

    this.dayWiseProject = async function (request, data) {
        let responseData = []
        var newArray = data.reduce(function (acc, curr) {

            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.project_name === curr.project_name && item.task_created_datetime === curr.task_created_datetime
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'project_name': curr.project_name,
                    'task_created_datetime': curr.task_created_datetime,
                    "value": [{
                        project_id: curr.project_id,
                        project_name: curr.project_name,
                        project_code: curr.project_code,
                        project_color_code: curr.project_color_code,
                        client_id: curr.client_id,
                        client_name: curr.client_name,
                        tag_id: curr.tag_id,
                        tag_name: curr.tag_name,
                        task_created_datetime: curr.task_created_datetime,
                        task_total_time: curr.task_total_time
                    }]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push({
                    project_id: curr.project_id,
                    project_name: curr.project_name,
                    project_code: curr.project_code,
                    project_color_code: curr.project_color_code,
                    client_id: curr.client_id,
                    client_name: curr.client_name,
                    tag_id: curr.tag_id,
                    tag_name: curr.tag_name,
                    task_created_datetime: curr.task_created_datetime,
                    task_total_time: curr.task_total_time
                })
            }

            return acc;

        }, []);
        for (let i = 0; i < newArray.length; i++) {
            toaltime = newArray[i].value
            tym = await util.sumOfTime(toaltime)
            responseData.push({
                project_id: newArray[i].project_id,
                project_name: newArray[i].value[0].project_name,
                project_color_code: newArray[i].value[0].project_color_code,
                project_code: newArray[i].value[0].project_code,
                client_id: newArray[i].value[0].client_id,
                client_name: newArray[i].value[0].client_name,
                tag_id: newArray[i].value[0].tag_id,
                tag_name: newArray[i].value[0].tag_name,
                total_time: tym,
                task_created_datetime: newArray[i].task_created_datetime,

            })
        }

        var newArray1 = responseData.reduce(function (acc1, curr1) {
            //finding Index in the array where the NamaCategory matched
            var findIfNameExist1 = acc1.findIndex(function (item1) {
                return item1.project_name === curr1.project_name;
            })
            if (findIfNameExist1 === -1) {

                let obj = {
                    'project_name': curr1.project_name,
                    "value": [curr1]
                }
                acc1.push(obj)
            } else {
                acc1[findIfNameExist1].value.push(curr1)
            }

            return acc1;

        }, []);
        responseData = newArray1
        return responseData

    }

    this.topProject = async function (request, data) {
        let responseData = []
        var newArray = data.reduce(function (acc, curr) {
            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.project_id === curr.project_id;
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'project_id': curr.project_id,
                    "value": [curr]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push(curr)
            }

            return acc;

        }, []);

        for (let i = 0; i < newArray.length; i++) {
            toaltime = newArray[i].value
            tym = await util.sumOfTime(toaltime)
            responseData.push({
                project_id: newArray[i].project_id,
                project_name: newArray[i].value[0].project_name,
                project_color_code: newArray[i].value[0].project_color_code,
                project_code: newArray[i].value[0].project_code,
                client_id: newArray[i].value[0].client_id,
                client_name: newArray[i].value[0].client_name,
                tag_id: newArray[i].value[0].tag_id,
                tag_name: newArray[i].value[0].tag_name,
                total_time: tym
            })
        }

        responseData.map((item) => {
            var timeParts = item.total_time.split(":");
            item.total_milliseconds = (timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)
        })

        responseData.sort((a, b) => b.total_milliseconds - a.total_milliseconds)
        return responseData[0]


    }

    this.overAllUsers = async function (request, data) {
        let responseData = []

        var newArray = data.reduce(function (acc, curr) {

            //finding Index in the array where the NamaCategory matched
            var findIfNameExist = acc.findIndex(function (item) {
                return item.employee_id === curr.employee_id;
            })
            if (findIfNameExist === -1) {

                let obj = {
                    'employee_id': curr.employee_id,
                    "value": [curr]
                }
                acc.push(obj)
            } else {
                acc[findIfNameExist].value.push(curr)
            }

            return acc;

        }, []);

        for (let i = 0; i < newArray.length; i++) {
            toaltime = newArray[i].value
            tym = await util.sumOfTime(toaltime)
            responseData.push({
                full_name: newArray[i].value[0].employee_full_name,
                employee_id: newArray[i].employee_id,
                total_time: tym
            })
        }
        return responseData

    }

    this.getReportSummary = async function (request) {
        console.log("--------------------------entered getReportSummary----------------------------");
        let responseData = []
        let data1 = []
        let empsGathered = []

        //get employess under head
        if (request.role_id == 2) {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    let emp = request.employees
                    for (let i = 0; i < emp.length; i++) {
                        request.employee_id = emp[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    let grp = request.groups

                    for (let i = 0; i < grp.length; i++) {
                        request.employee_id = grp[i]
                        const data9 = await leadService.getEmpsUnderHeadsLevel1(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess

                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const [err8, data8] = await employeeService.getAllEmployees(request)
                data1 = data8
            }

        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    let emp = request.employees
                    for (let i = 0; i < emp.length; i++) {
                        request.employee_id = emp[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    let grp = request.groups
                    for (let i = 0; i < grp.length; i++) {
                        request.employee_id = grp[i]
                        const data9 = await leadService.getEmpsUnderHeadsLevel1(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess
                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });
                data1 = uniqueEmps
            } else {
                const data9 = await leadService.getEmpsUnderHeadsLevel1(request, 1)
                data1 = data9
            }
        }

        //get data between date
        const [err2, data2] = await this.getDataByDates(request)
        console.log('===========getDataByDates==================')
        console.log("data length", data2.length)
        console.log('========================================')
        //get dashboard data overview
        if (data1.length != 0 && data2.length != 0) {
            //filter data with emps
            const data3 = await this.filterDataByEmps(request, data1, data2)
            console.log('===========filterDataByEmps==================')
            console.log("data length", data3.length)
            console.log('====================================')
            const [err, data] = await this.getReportSummaryOverviewCalculation(request, data3)
            responseData = data
        }
        return [false, responseData]
    }

    this.getReportSummaryGroupByUser = async function (request) {
        console.log("------------------------------------entered getReportSummaryGroupByUser------------------------------------------");

        let responseData = []

        let data1 = []
        let empsGathered = []
        //get employess under head
        if (request.role_id == 2) {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    let emp = request.employees
                    for (let i = 0; i < emp.length; i++) {
                        request.employee_id = emp[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    let grp = request.groups
                    for (let i = 0; i < grp.length; i++) {
                        request.employee_id = grp[i]
                        const data9 = await leadService.getEmpsUnderHeadsLevel1(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess
                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });
                data1 = uniqueEmps
            } else {
                const [err8, data8] = await employeeService.getAllEmployees(request)
                data1 = data8
            }

        } else if (request.role_id == 3) {
            const [err9, data9] = await employeeService.getEmployeeById(request)
            data1 = data9
        } else {
            if (request.employees.length != 0 || request.groups.length != 0) {
                if (request.employees.length != 0) {
                    let emp = request.employees
                    for (let i = 0; i < emp.length; i++) {
                        request.employee_id = emp[i]
                        const [err9, data9] = await employeeService.getEmployeeById(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                if (request.groups.length != 0) {
                    let grp = request.groups
                    for (let i = 0; i < grp.length; i++) {
                        request.employee_id = grp[i]
                        const data9 = await leadService.getEmpsUnderHeadsLevel1(request)
                        Array.prototype.push.apply(empsGathered, data9);
                    }
                }
                //unique employess
                const uniqueids = [];
                const uniqueEmps = empsGathered.filter(element => {
                    const isDuplicate = uniqueids.includes(element.employee_id);
                    if (!isDuplicate) {
                        uniqueids.push(element.employee_id);
                        return true;
                    }
                    return false;
                });

                data1 = uniqueEmps

            } else {
                const data9 = await leadService.getEmpsUnderHeadsLevel1(request)
                data1 = data9
            }
        }
        //get data between date
        const [err2, data2] = await this.getDataByDates(request)
        console.log('===========getDataByDates==================')
        console.log("data length", data2.length)
        console.log('========================================')

        //get dashboard data overview
        if (data1.length != 0 && data2.length != 0) {
            //filter data with emps
            const data3 = await this.filterDataByEmps(request, data1, data2)
            console.log('===========filterDataByEmps==================')
            console.log("data length", data3.length)
            console.log('========================================')
            const [err, data] = await this.getReportSummaryGroupByUserOverviewCalculation(request, data3)
            responseData = data
        }
        return [false, responseData]
    }

    this.getFilterReportSummary = async function (request, data) {

        let responseData = []
        error = true
        filterClients1 = []
        filterProjects1 = []
        filterTags1 = []
        filterStatus1 = []
        client_id = request.client_ids
        project_id = request.project_ids
        tag_id = request.tag_ids
        status_id = request.status_ids

        if (client_id.length == 0 && project_id.length == 0 && tag_id.length == 0 && status_id.length == 0) {
        } else if (client_id.length != 0 && project_id.length != 0 && tag_id.length != 0 && status_id.length != 0) {
            if (client_id != []) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }

            }
            else if (project_id != []) {
                for (let i = 0; i < project_id.length; i++) {
                    filterClient1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProjects1.push(data)
                        }
                    })
                }
            }
            else if (tag_id != []) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProjects1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            }
            else if (status_id != []) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)

                        }
                    })
                }

            }
            data = filterStatus1;


        } else {
            if (client_id.length == 0) {
                filterClients1 = data

            } if (client_id.length != 0) {
                for (let i = 0; i < client_id.length; i++) {
                    data.filter(function (data) {
                        if (data.client_id == client_id[i]) {
                            filterClients1.push(data)
                        }
                    })
                }
            } if (project_id.length == 0) {
                filterProjects1 = filterClients1
            } if (project_id.length != 0) {

                for (let i = 0; i < project_id.length; i++) {
                    filterClients1.filter(function (data) {
                        if (data.project_id == project_id[i]) {
                            filterProjects1.push(data)
                        }
                    })
                }

            } if (tag_id.length == 0) {
                filterTags1 = filterProjects1
            } if (tag_id.length != 0) {
                for (let i = 0; i < tag_id.length; i++) {
                    filterProjects1.filter(function (data) {
                        if (data.tag_id == tag_id[i]) {
                            filterTags1.push(data)
                        }
                    })
                }
            } if (status_id.length == 0) {
                filterStatus1 = filterTags1
            } if (status_id.length != 0) {
                for (let i = 0; i < status_id.length; i++) {
                    filterTags1.filter(function (data) {
                        if (data.status_id == status_id[i]) {
                            filterStatus1.push(data)
                        }
                    })
                }
            }
            data = filterStatus1
        }
        responseData = data
        error = false
        return [error, responseData]
    }

    this.getReportSummaryOverviewCalculation = async function (request, data) {
        let responseData = []

        const [err, filterData] = await this.getFilterReportSummary(request, data)
        if (filterData.length != 0) {
            totalTime = await util.sumOfTime(filterData)
            const data1 = await this.dayWiseTotalTime(request, filterData)
            const data2 = await this.overAllProject(request, filterData)
            //  adding uniques keys 
            data3 = await util.addUniqueKeyIndexesToArrayOfObject(data2)
            //loop for adding descriptions 
            for (let i = 0; i < data3.length; i++) {
                let value = []
                filterData.filter(function (dat) {
                    if (dat.project_id == data3[i].project_id) {
                        obj = {}
                        obj.task_description = dat.task_description
                        obj.task_total_time = dat.task_total_time
                        obj.employee_name = dat.employee_full_name
                        value.push(obj)
                    }

                })
                data3[i].description = value
            }

            responseData.push({ total_time: totalTime })
            responseData.push(data1)
            responseData.push(data3)

        }
        return [false, responseData]
    }

    this.getDataByDates = async function (request) {
        let responseData = [],
            error = true;

        const paramsArr = new Array(
            request.start_date,
            request.end_date
        );

        const queryString = util.getQueryString('data_get_by_dates', paramsArr);

        if (queryString !== '') {
            await db.executeQuery(1, queryString, request)
                .then(async (data) => {
                    error = false
                    responseData = data
                }).catch((err) => {
                    console.log("err-------" + err);
                    error = err
                })
            return [error, responseData];
        }


    };

    this.filterDataByEmps = async function (request, data1, data2) {

        let filterData = []
        for (let i = 0; i < data1.length; i++) {
            data2.filter(function (dat) {
                if (dat.employee_id == data1[i].employee_id) {
                    filterData.push(dat)
                }
            })
        }

        return filterData
    }

    this.getReportSummaryGroupByUserOverviewCalculation = async function (request, data) {
        let responseData = []
        const [err, filterData] = await this.getFilterReportSummary(request, data)
        if (filterData.length != 0) {

            totalTime = await util.sumOfTime(filterData)
            const data1 = await this.dayWiseTotalTime(request, filterData);
            const data2 = await this.overAllUsers(request, filterData)

            //adding uniques keys 
            data3 = await util.addUniqueKeyIndexesToArrayOfObject(data2)

            //loop for adding descriptions 
            for (let i = 0; i < data3.length; i++) {
                let value = []
                data.filter(function (dat) {
                    if (dat.employee_id == data3[i].employee_id) {
                        obj = {}
                        obj.task_description = dat.task_description
                        obj.task_total_time = dat.task_total_time
                        obj.project_name = dat.project_name
                        obj.project_code = dat.project_code
                        obj.project_color_code = dat.project_color_code
                        value.push(obj)
                    }

                })
                data3[i].description = value
            }
            responseData.push({ total_time: totalTime })
            responseData.push(data1)
            responseData.push(data3)
        }

        return [false, responseData]
    }

};



module.exports = AnalyzeServices;
