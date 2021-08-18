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
            let result = []
            for (let i = 0; i < services.rows.length; i++) {
                let approvedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                 ['approved', services.rows[i].name, id])
                let rejectedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                 ['rejected', services.rows[i].name, id])
                let processingQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                 ['processing', services.rows[i].name, id])
                let sentQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                 ['sent', services.rows[i].name, id])
                result.push({
                    service: services.rows[i].name,
                    approvedCount: approvedQuery.rows[0].count,
                    sentCount: sentQuery.rows[0].count,
                    processingCount: processingQuery.rows[0].count,
                    rejectedCount: rejectedQuery.rows[0].count
                })
            }
            return result
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

const fetchUserAppsDetails = async (service, id) => {
    let q_service = "INSERT SERVICE TYPE"
    let isOtherServices = false
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
        case "diger":
            isOtherServices = true
        default:
            q_service = service;
    }
    if (isOtherServices) {
        const otherServicesQuery = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_OTHER_SERVICES_AND_USERID, [id])
        return otherServicesQuery.rows
    }
    const query = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_SERVICE_AND_USERID, [q_service, id]) 
    return query.rows
}

module.exports = {
    FOR_SDC_GET_USER_APPS_ACCORDINGTO_SERVICE_AND_USERID,
    FOR_SDC_GET_USER_CRITERIA_APPS,
    fetchUserAppsCount,
    fetchUserAppsDetails
}