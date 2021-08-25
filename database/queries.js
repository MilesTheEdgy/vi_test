const pool = require("../db")
// FOR SALES ASSISTANT CHEF GET USER'S SUBMISSIONS ACCORDING TO SELECTED SERVICE TYPE
const FOR_SDC_GET_USER_APPS_ACCORDINGTO_SERVICE_AND_USERID = "SELECT sales_applications.submitter, CAST (sales_applications.submit_time AS VARCHAR), sales_applications.activator, sales_applications.representative, sales_applications.client_name, sales_applications.status, sales_applications.id, sales_applications.last_change_date, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications_details.client_wants_router, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND submitter = (SELECT username FROM login WHERE user_id = $2)"
const FOR_SDC_GET_USER_APPS_ACCORDINGTO_OTHER_SERVICES_AND_USERID = "SELECT sales_applications.submitter, CAST (sales_applications.submit_time AS VARCHAR), sales_applications.activator, sales_applications.representative, sales_applications.client_name, sales_applications.status, sales_applications.id, sales_applications.last_change_date, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications_details.client_wants_router, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service IN ('İptal', 'Nakil', 'Devir')) AND submitter = (SELECT username FROM login WHERE user_id = $1)"
const FOR_SDC_GET_USER_CRITERIA_APPS = "SELECT COUNT(submitter) FROM sales_applications WHERE status = $1 AND submitter = (SELECT username FROM login WHERE user_id = $2)"

const FOR_SDC_GET_APPLICATION_CRITERIA_COUNT = "SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = $1 AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $2) AND sales_applications.submitter = (SELECT username FROM login WHERE user_id = $3)"

const fetchUserAppsCount = async (id, status, service) => {
    try {
        if (service === "ALL" && status === "ALL") {
            const services = await pool.query("SELECT (name) FROM services WHERE active = true")
            const statusArray = ["approved", "rejected", "processing", "sent"]
            let result = []
            let results2 = []
            // mapping over the services array received from query
            for (let i = 0; i < services.rows.length; i++) {
                // mapping over the application status array 
                for (let j = 0; j < statusArray.length; j++) {
                    //querying the database based on each status in the array through the for loop
                    let query = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                     [statusArray[j], services.rows[i].name, id])
                    // storing the result in the object that follows the i index using dynamic keys, example: ${approved}Count: 20
                    results2[i] = {...results2[i], [`${statusArray[j]}Count`]: query.rows[0].count}
                }
                //after status database queries loop is finished, add the service name to the same object
                results2[i] = {...results2[i], service: services.rows[i].name}
                //repeat

                // let approvedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                //  ['approved', services.rows[i].name, id])
                // let rejectedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                //  ['rejected', services.rows[i].name, id])
                // let processingQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                //  ['processing', services.rows[i].name, id])
                // let sentQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                //  ['sent', services.rows[i].name, id])
                // result.push({
                //     service: services.rows[i].name,
                //     approvedCount: approvedQuery.rows[0].count,
                //     sentCount: sentQuery.rows[0].count,
                //     processingCount: processingQuery.rows[0].count,
                //     rejectedCount: rejectedQuery.rows[0].count
                // })
            }
            return results2
        }
        if (status === "ALL") {
            const rejectedCount = await pool.query("SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = 'rejected' AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND sales_applications.submitter = (SELECT username FROM login WHERE user_id = $2)",
             [service, id])
            const approvedCount = await pool.query("SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = 'approved' AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND sales_applications.submitter = (SELECT username FROM login WHERE user_id = $2)",
             [service, id])
            return {
                approved: approvedCount.rows[0].count,
                denied: rejectedCount.rows[0].count
            }
        }
        if (service === "ALL") {
            const services = await pool.query("SELECT (name) FROM services WHERE active = true")
            let result = []
            for (let i = 0; i < services.rows.length; i++) {
                let approvedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                [status, services.rows[i].name, id])
                result.push({
                    service: services.rows[i].name,
                    count: approvedQuery.rows[0].count
                })
            }
            return result
        }
        return await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT, [status, service, id])
    } catch (error) {
        console.error(error)
        throw new Error("Could not get user applications count")
    }
}

// const fetchUserAppsDetails = async (service, id) => {
//     let q_service = "INSERT SERVICE TYPE"
//     let isOtherServices = false
//     switch (service) {
//         case "Faturasiz":
//             q_service = "Faturasız"; break;
//         case "Faturali":
//             q_service = "Faturalı"; break;
//         case "taahut":
//             q_service = "Taahüt"; break;
//         case "iptal":
//             q_service = "İptal"; break;
//         case "tivibu":
//             q_service = "Tivibu"; break;
//         case "diger":
//             isOtherServices = true
//         default:
//             q_service = service;
//     }
//     if (isOtherServices) {
//         const otherServicesQuery = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_OTHER_SERVICES_AND_USERID, [id])
//         return otherServicesQuery.rows
//     }
//     const query = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_SERVICE_AND_USERID, [q_service, id]) 
//     return query.rows
// }


const queryConstructor = (selectStatement, conditionArr) => {
    let conditionText = ""
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0)
            conditionText = ` WHERE ${conditionArr[i]}`
        else
            conditionText = conditionText + " AND " + conditionArr[i] + `$${i}`
    }
    return selectStatement + conditionText
}
const convertDateInputToSQLInterval = (interval) => {
    console.log('VALUE OF INTERVAL ', interval)
    let conditionTime = "submit_time > now() - interval"
    switch (interval) {
        case "today":
            conditionTime = conditionTime + "' 1 day'"
            break
        case "week":
            conditionTime = conditionTime + "' 7 day'"
            break
        case "month":
            conditionTime = conditionTime + "' 30 day'"
            break
        case "year":
            conditionTime = conditionTime + "' 365 day'"
            break
        case "ALL":
            conditionTime = conditionTime + "' 99 year'"
            break
        default:
            throw new Error("Unexpected input at convertDateInputToSQLInterval")
    }
    return conditionTime
}

// const getDealerApplications = async (query, interval = "ALL", dealerName, status = "ALL", service = "ALL") => {
//     // SELECT statements
//     const selectCount = "SELECT count(*) FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
//     const selectDetails = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
//     const selectStatement = query === "details" ? selectDetails : selectCount

//     //CONDITION statements
//     const conditionSubmitter = "sales_applications.submitter = "
//     const conditionStatus = "sales_applications.status = "
//     const conditionService = "sales_applications_details.selected_service = "

//     // DATE Interval is REQUIRED
//     const conditionTime = convertDateInputToSQLInterval(interval)
//     //original condition params and query arrays
//     const conditionArr = [interval, dealerName, status, service]
//     const conditionQueryArr = [conditionTime, conditionSubmitter, conditionStatus, conditionService]
//     //verified condition params and query arrays
//     let verifiedConditionParamsArr = []
//     // if interval = ALL, add conditionTime at first index. Reason is the for loops pushes any value that !== ALL.
//     // And this statement prevents duplicate conditionTime
//     let verifiedConditionQueryArr = interval === "ALL" ?  [conditionTime] : []
//     for (let i = 0; i < conditionArr.length; i++) {
//         if (conditionArr[i] !== "ALL") {
//             verifiedConditionParamsArr.push(conditionArr[i])
//             verifiedConditionQueryArr.push(conditionQueryArr[i])
//         }
//     }
//     // removes the first value to prevent the query parameter array from erroring because it has 1 more value than
//     // the query statement.
//     if (interval !== "ALL")
//         verifiedConditionParamsArr.shift()
//     const queryString = queryConstructor(selectStatement, verifiedConditionQueryArr)
//     const dbQuery = await pool.query(queryString, verifiedConditionParamsArr)
//     // if query is details, return the entire array of objects, else return only the object in the array.
//     return query === "details" ? dbQuery.rows : dbQuery.rows[0]
// }

const switchServiceNameToTurkish = (service) => {
    let q_service = ""
    switch (service) {
        case "Faturasiz":
            q_service = "Faturasız"; break;
        case "Faturali":
            q_service = "Faturalı"; break;
        case "taahut":
            q_service = "Taahüt"; break;
        case "iptal":
            q_service = "İptal"; break;
        case "tivibu":
            q_service = "Tivibu"; break;
        default:
            q_service = service;
    }
    return q_service
}

const queryConstructorDate = (selectStatement, conditionArr) => {
    let conditionText = ""
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0)
            conditionText = ` WHERE ${conditionArr[i]} $${i+1}`
        else
            conditionText = conditionText + " AND " + conditionArr[i] + `$${i+1}`
    }
    return selectStatement + conditionText
}

const getSDCApplicationsCount = async (interval = "ALL", service = "ALL", status = "ALL") => {
    //select statement
    const selectCount = "SELECT count(*) FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
    //condition statements
    const conditionInterval = convertDateInputToSQLInterval(interval)
    const conditionService = "sales_applications_details.selected_service = "
    const conditionStatus = "sales_applications.status = "
    //service parameter switched to turkish eg: taahut => Taahüt
    const serviceParam = switchServiceNameToTurkish(service)
    //condition parameters
    const conditionParamArr = [interval, status, serviceParam]
    //condition statements
    const conditionStatementsArr = [conditionInterval, conditionStatus, conditionService]

    //verified condition params and query arrays
    let verifiedConditionParamsArr = []
    // if interval = ALL, add conditionTime at first index. Reason is the for loops pushes any value that !== ALL.
    // And this statement prevents duplicate conditionTime
    let verifiedConditionQueryArr = interval === "ALL" ?  [conditionTime] : []
    //if condition statement's param does not equal ALL, add it to verified array, else, omit it
    for (let i = 0; i < conditionParamArr.length; i++) {
        if (conditionParamArr[i] !== "ALL") {
            verifiedConditionParamsArr.push(conditionParamArr[i])
            verifiedConditionQueryArr.push(conditionStatementsArr[i])
        }
    }
    if (interval !== "ALL")
        verifiedConditionParamsArr.shift()

    console.log("VERIFIED CONDITION STATEMENT: ", verifiedConditionQueryArr)
    console.log("VERIFIED CONDITION PARAMETERS: ", verifiedConditionParamsArr)
    const allDealers = " AND sales_applications.submitter IN (SELECT username FROM login WHERE role = 'dealer')"
    //query statement constructer. adds WHERE and AND, alongside $ signs. Omits the first dollar sign
    const queryStatement = queryConstructor(selectCount, verifiedConditionQueryArr)
    //special condition statement for SDC, selects records submitted by all dealers

    const finalStatement = queryStatement + allDealers
    console.log("finalStatement: ", finalStatement, "--- condition params: ",  verifiedConditionParamsArr)
    const query = await pool.query(finalStatement, verifiedConditionParamsArr)
    return query.rows[0]
}

const getDealerApplications = async (query, date = "ALL", userID, status = "ALL", service = "ALL") => {
        const getDealerName = await pool.query("SELECT username FROM login WHERE user_id = $1", [userID])
        const dealerName = getDealerName.rows[0].username
        console.log("SERVICE: ", service)
        if (service === "MAP") {
            const services = await pool.query("SELECT (name) FROM services WHERE active = true")
            const statusArray = ["approved", "rejected", "processing", "sent"]
            let result = []
            // mapping over the services array received from query
            for (let i = 0; i < services.rows.length; i++) {
                // mapping over the application status array 
                for (let j = 0; j < statusArray.length; j++) {
                    //querying the database based on each status in the array through the for loop
                    let query = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                    [statusArray[j], services.rows[i].name, userID])
                    // storing the result in the object that follows the i index using dynamic keys, example: ${approved}Count: 20
                    result[i] = {...result[i], [`${statusArray[j]}Count`]: query.rows[0].count}
                }
                //after status database queries loop is finished, add the service name to the same object
                result[i] = {...result[i], service: services.rows[i].name}
                //repeat
            }
            return result
        }

        if (service === "diger") {
            const otherServicesQuery = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_OTHER_SERVICES_AND_USERID, [userID])
            return otherServicesQuery.rows
        }

        // SELECT statements
        const selectCount = "SELECT count(*) FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
        const selectDetails = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
        const selectStatement = query === "details" ? selectDetails : selectCount
    
        //CONDITION statements
        const conditionSubmitter = "sales_applications.submitter = "
        const conditionStatus = "sales_applications.status = "
        const conditionService = "sales_applications_details.selected_service = "
        // console.log("service ", service)
        const serviceTUR = switchServiceNameToTurkish(service)
        // console.log("serviceTUR ", serviceTUR)
        if (typeof date === "string" ||typeof date === "number") {
            const interval = date
            // DATE Interval is REQUIRED
            const conditionTime = convertDateInputToSQLInterval(interval)
            //original condition params and query arrays
            const conditionArr = [interval, dealerName, status, serviceTUR]
            const conditionQueryArr = [conditionTime, conditionSubmitter, conditionStatus, conditionService]
            //verified condition params and query arrays
            let verifiedConditionParamsArr = []
            // if interval = ALL, add conditionTime at first index. Reason is the for loops pushes any value that !== ALL.
            // And this statement prevents duplicate conditionTime
            let verifiedConditionQueryArr = interval === "ALL" ?  [conditionTime] : []
            for (let i = 0; i < conditionArr.length; i++) {
                if (conditionArr[i] !== "ALL") {
                    verifiedConditionParamsArr.push(conditionArr[i])
                    verifiedConditionQueryArr.push(conditionQueryArr[i])
                }
            }
            // removes the first value to prevent the query parameter array from erroring because it has 1 more value than
            // the query statement.
            if (interval !== "ALL")
                verifiedConditionParamsArr.shift()
            const queryString = queryConstructor(selectStatement, verifiedConditionQueryArr)
            // console.log(queryString, verifiedConditionParamsArr)
            const dbQuery = await pool.query(queryString, verifiedConditionParamsArr)
            if (query !== "details") {
                console.log(queryString)
            }
            // if query is details, return the entire array of objects, else return only the object in the array.
            return query === "details" ? dbQuery.rows : dbQuery.rows[0]

        } else { // ELSE if user is querying as an exact date with month and year format
            const [month, year] = date
            const extractMonthCondition = "EXTRACT(MONTH FROM sales_applications.submit_time) = "
            const extracYearCondition = "EXTRACT(YEAR FROM sales_applications.submit_time) = "
            //original condition params and query arrays
            const conditionArr = [Number(month), Number(year), dealerName, status, serviceTUR]
            const conditionQueryArr = [extractMonthCondition, extracYearCondition, conditionSubmitter, conditionStatus, conditionService]
            //verified condition params and query arrays
            let verifiedConditionParamsArr = []
            let verifiedConditionQueryArr = []
            for (let i = 0; i < conditionArr.length; i++) {
                if (conditionArr[i] !== "ALL") {
                    verifiedConditionParamsArr.push(conditionArr[i])
                    verifiedConditionQueryArr.push(conditionQueryArr[i])
                }
            }
            const queryString = queryConstructorDate(selectStatement, verifiedConditionQueryArr)
            // console.log(queryString, verifiedConditionParamsArr)
            const dbQuery = await pool.query(queryString, verifiedConditionParamsArr)

            // if query is details, return the entire array of objects, else return only the object in the array.
            return query === "details" ? dbQuery.rows : dbQuery.rows[0]
        }
}

module.exports = {
    FOR_SDC_GET_USER_APPS_ACCORDINGTO_SERVICE_AND_USERID,
    FOR_SDC_GET_USER_CRITERIA_APPS,
    fetchUserAppsCount,
    getDealerApplications,
    getSDCApplicationsCount
}