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

module.exports = {
    forDealerGetApplications
}