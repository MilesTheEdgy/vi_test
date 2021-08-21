const pool = require("../db")

const FOR_DEALER_GET_APPLICATIONS_ACCORDINGTO_STATUS = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.submitter = $1 AND sales_applications.status = $2"
const FOR_DEALER_GET_ALL_APPLICATIONS = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.submitter = $1"



// I think this function is a replica of the one below? maybe delete it? 
const forDealerGetApplications = async (username, status = undefined) => {
    if (status) {
        const query = await pool.query(FOR_DEALER_GET_APPLICATIONS_ACCORDINGTO_STATUS, [username, status])
        return query.rows
    }
    const query = await pool.query(FOR_DEALER_GET_ALL_APPLICATIONS, [username])
    return query.rows
}

const getDealerApplicationsDetails = async (dealerName, date = "NONE", status) => {
    // at this point I'm just having a little fun xD

    const queryColumnsSelections = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date "
    const queryJoinCondition = " FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
    const querySubmitterCondition = " WHERE sales_applications.submitter = $1"
    const queryStatusCondition = " AND sales_applications.status = $2"
    const queryServiceCondition = " AND sales_applications_details = $3"
    let queryIntervalCondition = ""
    // I could've made this just one switch statement instead of two but f**k it
    // Anyways, I declared a string var, and this switch statement gives the var a value according to 'date'
    // if date isn't supplied(it's value is 'NONE') it returns an empty string
    switch (date) {
        case "today":
            queryIntervalCondition = " AND submit_time > now() - interval '1 day'"
            break
        case "week":
            queryIntervalCondition = " AND submit_time > now() - interval '7 day'"
            break
        case "month":
            queryIntervalCondition = " AND submit_time > now() - interval '30 day'"
            break
        case "year":
            queryIntervalCondition = " AND submit_time > now() - interval '365 day'"
            break
        case "NONE":
            queryIntervalCondition = ""
            break
        default:
            break;
    }
    let finalQueryString
    console.log("status", status)
    if (status === "ALL") {
        finalQueryString = queryColumnsSelections + queryJoinCondition + querySubmitterCondition + queryIntervalCondition
        const dbQuery = await pool.query(finalQueryString, [dealerName])
        return dbQuery.rows
    } else {
        finalQueryString = queryColumnsSelections + queryJoinCondition + querySubmitterCondition + queryStatusCondition + queryIntervalCondition
        console.log(finalQueryString)
        const dbQuery = await pool.query(finalQueryString, [dealerName, status])

        // returns an array
        return dbQuery.rows
    }
}

const getDealerApplicationsCount = async (dealerName, date, status) => {
    let queryText = ""
    // Before you ask why I did something as horrible as this, I can not pass a dynamic parameter to the 'interval' function
    switch (date) {
        case "today":
            queryText = "SELECT count(*) FROM sales_applications WHERE submit_time > now() - interval '1 day' AND submitter = $1 AND status = $2"
            break
        case "week":
            queryText = "SELECT count(*) FROM sales_applications WHERE submit_time > now() - interval '7 day' AND submitter = $1 AND status = $2"
            break
        case "month":
            queryText = "SELECT count(*) FROM sales_applications WHERE submit_time > now() - interval '30 day' AND submitter = $1 AND status = $2"
            break
        case "year":
            queryText = "SELECT count(*) FROM sales_applications WHERE submit_time > now() - interval '365 day' AND submitter = $1 AND status = $2"
            break
        default:
            break;
    }
    let queryString = ""
    let selectQuery
    //if status = all dont add status param
    if (status === 'ALL') {
        // Returns the querystring without 'AND status...'
        queryString = queryText.slice(0, queryText.search("AND status"))
        selectQuery = await pool.query(queryString, [dealerName])
    }
    //if status = all ADd status param
    else {
        queryString = queryText
        selectQuery = await pool.query(queryString, [dealerName, status])
    }
    //returns an Object        
    return selectQuery.rows[0]
}



module.exports = {
    forDealerGetApplications,
    getDealerApplicationsCount,
    getDealerApplicationsDetails
}