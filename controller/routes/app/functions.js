const pool = require("../../database")

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

// ADD THIS FUNCTION SOME EXPLANATION!!!!!!!!!
const mapAppsAccordToServices = async (userID) => {
    const FOR_SDC_GET_APPLICATION_CRITERIA_COUNT = "SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = $1 AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $2) AND sales_applications.submitter = (SELECT username FROM login WHERE user_id = $3)"
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

// Just your average query that returns itself, except that the condition for OTHER services is a value in a list
// of values EG: WHERE services IN (nakil, iptal ETC....)
const fetchDigerServices = async (userID) => {
    const otherServicesQuery = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_OTHER_SERVICES_AND_USERID, [userID])
    return otherServicesQuery.rows
}

const fetchAppsAccordToInterval = async (query, interval, selectStatement, conditionArr, conditionQueryArr) => {
    // DATE Interval is REQUIRED
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
}

const fetchAppsAccordToDate = async (selectStatement, conditionArr, conditionQueryArr) => {
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

// MAIN ENTRY FUNCTION
const getDealerApplications = async (query, date = "ALL", userID, status = "ALL", service = "ALL") => {
    // Functions that return an early results according to a special condition
    if (service === "MAP")
        return mapAppsAccordToServices(userID)
    if (service === "diger")
        return fetchDigerServices(userID)

    // Get dealer's username according to his user ID
    const getDealerName = await pool.query("SELECT username FROM login WHERE user_id = $1", [userID])
    const dealerName = getDealerName.rows[0].username

    // SELECT statements
    const selectCount = "SELECT count(*) FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
    const selectDetails = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
    const selectStatement = query === "details" ? selectDetails : selectCount

    //CONDITION statements
    const conditionSubmitter = "sales_applications.submitter = "
    const conditionStatus = "sales_applications.status = "
    const conditionService = "sales_applications_details.selected_service = "
    const serviceTUR = switchServiceNameToTurkish(service)
    if (typeof date === "string" ||typeof date === "number") {
        //original condition params and query arrays
        const interval = date
        const conditionTime = convertDateInputToSQLInterval(interval)
        const conditionArr = [interval, dealerName, status, serviceTUR]
        const conditionQueryArr = [conditionTime, conditionSubmitter, conditionStatus, conditionService]
        return fetchAppsAccordToInterval(query, interval, selectStatement, conditionArr, conditionQueryArr)
    } else { // ELSE if user is querying as an exact date with month and year format
        //original condition params and query arrays
        const [month, year] = date
        const extractMonthCondition = "EXTRACT(MONTH FROM sales_applications.submit_time) = "
        const extracYearCondition = "EXTRACT(YEAR FROM sales_applications.submit_time) = "    
        const conditionArr = [Number(month), Number(year), dealerName, status, serviceTUR]
        const conditionQueryArr = [extractMonthCondition, extracYearCondition, conditionSubmitter, conditionStatus, conditionService]
        return fetchAppsAccordToDate(selectStatement, conditionArr, conditionQueryArr)
    }
}

module.exports = {
    getDealerApplications
}