
const pool = require("./controller/database")

const mapAppsAccordToServices = async (userID, date) => {
    const [month, year] = date
    const FOR_SDC_GET_APPLICATION_CRITERIA_COUNT = "SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = $1 AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $2) AND sales_applications.submitter = $3 AND EXTRACT(YEAR FROM sales_applications.submit_time) = $4"
    // month condition statement
    const extractMonthCondition = " AND EXTRACT(MONTH FROM sales_applications.submit_time) = $5"
    const services = await pool.query("SELECT service_id, name FROM services WHERE active = true")
    const statusArray = ["approved", "rejected", "processing", "sent"]
    // define the final query statement
    let queryStatement = FOR_SDC_GET_APPLICATION_CRITERIA_COUNT
    // insert the month query parameter into a temporary array
    let monthQueryParam = []
    // if month's value is equal to 'ALL', omit adding the month condition statement and the month query parameter, else add them.
    if (month !== "ALL") {
        queryStatement = queryStatement + extractMonthCondition
        monthQueryParam.push(month)
    }
    let result = []
    // mapping over the services array received from query
    for (let i = 0; i < services.rows.length; i++) {
        // mapping over the application status array 
        for (let j = 0; j < statusArray.length; j++) {
            //querying the database based on each status in the array through the for loop
            let query = await pool.query(queryStatement, [statusArray[j], services.rows[i].service_id, userID, year, ...monthQueryParam])

            // storing the result in the object that follows the i index using dynamic keys, example: ${approved}Count: 20
            result[i] = {...result[i], [`${statusArray[j]}Count`]: query.rows[0].count}
        }
        //after status database queries loop is finished, add the service name and ID to the same object
        result[i] = {...result[i], service: services.rows[i].name, service_id: services.rows[i].service_id}
        //repeat
    }
    return result
}

mapAppsAccordToServices("1fa5915jwksg069fe", ['08', '2021']).then(data => {
    console.log('*************************** FINAL RESULT *************************')
    console.log(data)
    process.exit()
}).catch(err => console.log(err))
