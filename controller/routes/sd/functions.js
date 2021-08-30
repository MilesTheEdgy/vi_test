
const updateApplicationPhase1 = async (client, statusChange, salesRepDetails, appID) => {
    try {
        console.log('status is PROCESSING')
        await client.query("UPDATE sales_applications_details SET sales_rep_details = $1, status_change_date = CURRENT_TIMESTAMP WHERE id = $2",
            [salesRepDetails, appID])
        await client.query("UPDATE sales_applications SET status = $1 WHERE id = $2", [statusChange, appID])
        return {done: true}
    } catch (err) {
        return {done: false, error: err}
    }
}

const updateApplicationPhase2 = async (client, statusChange, salesRepDetails, appID) => {
    try {
        console.log('status is PROCESSING')
        await client.query("UPDATE sales_applications_details SET final_sales_rep_details = $1 WHERE id = $2",
        [salesRepDetails, appID])
        await client.query("UPDATE sales_applications SET status = $1, last_change_date = CURRENT_TIMESTAMP WHERE id = $2", [statusChange, appID])
        return {done: true}
    } catch (err) {
        return {done: false, error: err}
    }
}

module.exports = {
    updateApplicationPhase1,
    updateApplicationPhase2
}