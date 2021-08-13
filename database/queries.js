const pool = require("../db")
// FOR SALES ASSISTANT CHEF GET USER'S SUBMISSIONS ACCORDING TO SELECTED SERVICE TYPE
const FOR_SDC_GET_USER_APPS_ACCORDINGTO = "SELECT sales_applications.submitter, sales_applications.submit_time, sales_applications.activator, sales_applications.representative, sales_applications.client_name, sales_applications.status, sales_applications.id, sales_applications.last_change_date, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications_details.client_wants_router, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND submitter = (SELECT username FROM login WHERE id = $2)"

const FOR_SDC_GET_USER_CRITERIA_APPS = "SELECT COUNT(submitter) FROM sales_applications WHERE status = $1 AND submitter = (SELECT username FROM login WHERE id = $2)"

const FOR_SDC_GET_APPLICATION_CRITERIA_COUNT = "SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = $1 AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $2) AND sales_applications.submitter = (SELECT username FROM login WHERE id = $3)"

const fetchUserAppsCount = async (id, status, service) => {
    try {
        if (service === "ALL" && status === "ALL") {
            const services = await pool.query("SELECT (name) FROM services WHERE active = true")
            let result = []
            for (let i = 0; i < services.rows.length; i++) {
                let approvedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                ['Onaylandı', services.rows[i].name, id])
                let deniedQuery = await pool.query(FOR_SDC_GET_APPLICATION_CRITERIA_COUNT,
                    ['İptal', services.rows[i].name, id])
                result.push({
                    service: services.rows[i].name,
                    approvedCount: approvedQuery.rows[0].count,
                    deniedCount: deniedQuery.rows[0].count
                })
            }
            return result
        }
        if (status === "ALL") {
            const deniedCount = await pool.query("SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = 'İptal' AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND sales_applications.submitter = (SELECT username FROM login WHERE id = $2)",
             [service, id])
            const approvedCount = await pool.query("SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = 'Onaylandı' AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND sales_applications.submitter = (SELECT username FROM login WHERE id = $2)",
             [service, id])
            return {
                approved: approvedCount.rows[0].count,
                denied: deniedCount.rows[0].count
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

module.exports = {
    FOR_SDC_GET_USER_APPS_ACCORDINGTO,
    FOR_SDC_GET_USER_CRITERIA_APPS,
    fetchUserAppsCount
}