const sendApplication = async (userInfo, selectedService, selectedOffer, clientWantsRouter, clientDescription, clientName, photoURLS, res) => {
    console.log('in SEND APPLICATION')
    if (!selectedService.match(/^(DSL|Taahüt|Tivibu|PSTN|İptal|Nakil|Devir)$/)) {
        console.error("Selected service doesn't match the criteria");
        return res.status(406).json("Selected service doesn't match the criteria")
    }
    const { name, role, userID } = userInfo;
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        //begin the query transaction

        const query = await client.query("INSERT INTO sales_applications(submitter, submit_time, activator, client_name, status) VALUES($1, $2, $3, $4, $5) RETURNING id"
            , [name, 'NOW()', "CHANGE ME", clientName, 'sent'])
        await client.query("INSERT INTO sales_applications_details(client_name, selected_service, selected_offer, description, client_wants_router, id, image_urls) VALUES($1, $2, $3, $4, $5, $6, $7)"
            , [clientName, selectedService, selectedOffer, clientDescription, clientWantsRouter, query.rows[0].id, photoURLS])

        const checkGoalSuccessStatement = "SELECT goal, done, goal_id FROM goals WHERE EXTRACT(month from for_date) = (SELECT date_part('month', (SELECT current_timestamp))) AND service = $1 AND for_user_id = $2"
        const checkGoalSuccessQuery = await client.query(checkGoalSuccessStatement, [selectedService, userID])
        if (checkGoalSuccessQuery.rowCount === 1) {
            if (checkGoalSuccessQuery.rows[0].done === checkGoalSuccessQuery.rows[0].goal)
                await pool.query("UPDATE goals SET success = true, done = done + 1 WHERE goal_id = $1", [checkGoalSuccessQuery.rows[0].goal_id])
            else {
                await pool.query("UPDATE goals SET done = done + 1 WHERE goal_id = $1", [checkGoalSuccessQuery.rows[0].goal_id])
            }
        }

        await client.query('COMMIT')
        //end the query transaction
        res.json("done")
    }
     catch (e) {
        await client.query('ROLLBACK')
        console.error(e)
    }
     finally {
        client.release()
    }
}

module.exports = {
    sendApplication
}