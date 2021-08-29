const sendApplication = async (userInfo, selectedService, selectedOffer, clientWantsRouter, clientDescription, clientName, photoURLS, res) => {
    console.log('in SEND APPLICATION')
    if (!selectedService.match(/^(DSL|Taahüt|Tivibu|PSTN|İptal|Nakil|Devir)$/)) {
        console.error("Selected service doesn't match the criteria");
        return res.status(406).json("Selected service doesn't match the criteria")
    }
    const { username, role } = userInfo;
    const d = new Date()
    const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`    // 2016-06-22 19:10:25
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        //begin the query transaction
        const query = await client.query("INSERT INTO sales_applications(submitter, submit_time, activator, representative, client_name, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id"
            , [username, 'NOW()', "Abdullah Kara", "Erdem Mutlu", clientName, 'processing'])
        await client.query("INSERT INTO sales_applications_details(client_name, selected_service, selected_offer, description, client_wants_router, id, image_urls) VALUES($1, $2, $3, $4, $5, $6, $7)"
            , [clientName, selectedService, selectedOffer, clientDescription, clientWantsRouter, query.rows[0].id, photoURLS])
        await client.query('COMMIT')
        //end the query transaction

        return res.status(200).json("application submitted successfully")
    }
     catch (e) {
        await client.query('ROLLBACK')
        console.error(e)
        return res.status(500).json("an error occurred from the server side")
    }
     finally {
        client.release()
    }
}

module.exports = {
    sendApplication
}