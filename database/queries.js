
// FOR SALES ASSISTANT CHEF GET USER'S SUBMISSIONS ACCORDING TO SELECTED SERVICE TYPE
const FOR_SDC_GET_USER_APPS_ACCORDINGTO = "SELECT sales_applications.submitter, sales_applications.submit_time, sales_applications.activator, sales_applications.representative, sales_applications.client_name, sales_applications.status, sales_applications.id, sales_applications.last_change_date, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications_details.client_wants_router, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $1) AND submitter = (SELECT username FROM login WHERE id = $2)"

const FOR_SDC_GET_USER_CRITERIA_APPS = "SELECT COUNT(submitter) FROM sales_applications WHERE status = $1 AND submitter = (SELECT username FROM login WHERE id = $2)"

const FOR_SDC_GET_APPLICATION_CRITERIA_COUNT = "SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = $1 AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $2) AND sales_applications.submitter = (SELECT username FROM login WHERE id = $3)"

module.exports = {
    FOR_SDC_GET_USER_APPS_ACCORDINGTO,
    FOR_SDC_GET_USER_CRITERIA_APPS,
    FOR_SDC_GET_APPLICATION_CRITERIA_COUNT
}