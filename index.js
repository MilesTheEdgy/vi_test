const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
// const client = require("./db");
const pool = require("./db");
const serverFunction = require("./functions");


app.use(cors());
app.use(express.json());

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  


// app.post("/superuser", async (req, res) => {
//     try {
//         let token = serverFunction.generateAccessToken({username: "superuser", status: "admin"})
//         res.json({token})
//     } catch (error) {
//         console.error(error);
//     }
// });
app.post("/", serverFunction.authenticateToken, async (req, res) => {
    try {
        const dbUserTable = await pool.query("SELECT username, role FROM login WHERE username = $1", [res.locals.userInfo.username]);
        const { username, role } = dbUserTable.rows[0];
        console.log(role);
        return res.status(200).json({
            username: username,
            userRole: role,
        })
    } catch (error) {
        console.error(error);
    }
});

app.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        let checkCredentialsResult = await serverFunction.checkCredentials(username, password)
        console.log("checkCredentialsResult", checkCredentialsResult)
        if (checkCredentialsResult.ok) {
            let token = serverFunction.generateAccessToken({username: username, role: checkCredentialsResult.userRole})
            // console.log("token from login: ", token)
            console.log(checkCredentialsResult.userRole);
            return res.status(200).json({
                token: token,
                username: checkCredentialsResult.username,
                userRole: checkCredentialsResult.userRole,
            });
        } else {
            return res.status(404).json("error ocurred while loggin in")
        }

    } catch (error) {
        console.error(error);
    }
});

app.post("/register", async(req, res) => {
    try {
        const { username, password } = req.body;
        bcrypt.hash(password, 10, function(err, hash) {
            res.json({username, hash})
        });
    } catch (error) {
        console.error(error);
        res.json("error occurred at register route")
    }
});



app.get("/bayi/anasayfa", serverFunction.authenticateToken, async(req, res) => {
    try {
        let query = await serverFunction.loadAnasayfa(res.locals.userInfo.username, res.locals.userInfo.role)
        if (query.ok) 
            return res.status(200).json(query.result)
        else
            return res.status(500).json("error at /bayi/anasayfa")
    } catch (error) {
        console.error(error)
        res.status(500).json("error at /bayi/anasayfa")
    }
})

app.post("/bayi/basvuru/yeni", serverFunction.authenticateToken, async(req, res) => {
    try {
        const { selectedService, selectedOffer, clientDescription, clientWantsRouter, clientName} = req.body;
        const userInfo = res.locals.userInfo
        await serverFunction.sendApplication(userInfo, selectedService, selectedOffer, clientWantsRouter, clientDescription, clientName, res) 
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/bayi/basvuru/takip", serverFunction.authenticateToken, async(req, res) => {
    try {
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id")
        const resArr = query.rows.map(client => {
            return {
                id: client.id,
                name: client.client_name,
                date: client.submit_time.toISOString().slice(0, 10),
                description: client.description,
                service: client.selected_service,
                offer: client.selected_offer,
                status: client.status,
                salesRepDetails: client.sales_rep_details,
                statusChangeDate: client.status_change_date ? client.status_change_date.toISOString().slice(0, 10) : null,
                finalSalesRepDetails: client.final_sales_rep_details,
                lastChangeDate: client.last_change_date ? client.last_change_date.toISOString().slice(0, 10) : null
            }
        })
        console.log(resArr);
        res.status(200).json(resArr)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/bayi/rapor/onaylanan", serverFunction.authenticateToken, async(req, res) => {
    try {
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.status = 'Onaylandı'")
        const resArr = query.rows.map(client => {
            return {
                id: client.id,
                name: client.client_name,
                date: client.submit_time.toISOString().slice(0, 10),
                description: client.description,
                service: client.selected_service,
                offer: client.selected_offer,
                status: client.status,
                salesRepDetails: client.sales_rep_details,
                statusChangeDate: client.status_change_date ? client.status_change_date.toISOString().slice(0, 10) : null,
                finalSalesRepDetails: client.final_sales_rep_details,
                lastChangeDate: client.last_change_date ? client.last_change_date.toISOString().slice(0, 10) : null
            }
        })
        console.log(resArr);
        res.status(200).json(resArr)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/bayi/rapor/iptal", serverFunction.authenticateToken, async(req, res) => {
    try {
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.status = 'İptal'")
        const resArr = query.rows.map(client => {
            return {
                id: client.id,
                name: client.client_name,
                date: client.submit_time.toISOString().slice(0, 10),
                description: client.description,
                service: client.selected_service,
                offer: client.selected_offer,
                status: client.status,
                salesRepDetails: client.sales_rep_details,
                statusChangeDate: client.status_change_date ? client.status_change_date.toISOString().slice(0, 10) : null,
                finalSalesRepDetails: client.final_sales_rep_details,
                lastChangeDate: client.last_change_date ? client.last_change_date.toISOString().slice(0, 10) : null
            }
        })
        console.log(resArr);
        res.status(200).json(resArr)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/bayi/rapor/bekleyen", serverFunction.authenticateToken, async(req, res) => {
    try {
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.status = 'İşleniyor'")
        const resArr = query.rows.map(client => {
            return {
                id: client.id,
                name: client.client_name,
                date: client.submit_time.toISOString().slice(0, 10),
                description: client.description,
                service: client.selected_service,
                offer: client.selected_offer,
                status: client.status,
                salesRepDetails: client.sales_rep_details,
                statusChangeDate: client.status_change_date ? client.status_change_date.toISOString().slice(0, 10) : null,
                finalSalesRepDetails: client.final_sales_rep_details,
                lastChangeDate: client.last_change_date ? client.last_change_date.toISOString().slice(0, 10) : null
            }
        })
        console.log(resArr);
        res.status(200).json(resArr)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// SATIŞ DESTEK///////////////////////////////////////////////////////////////////////////////////////

app.get("/sd/basvurular/goruntule", serverFunction.authenticateToken, async (req, res) => {
    try {
        const userInfo = res.locals.userInfo
        if (userInfo.role !== "sales_assistant")
            return res.status(401).json("this user does not have sales assistant premission")
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id")
        const resArr = query.rows.map(client => {
            return {
                id: client.id,
                name: client.client_name,
                date: client.submit_time.toISOString().slice(0, 10),
                description: client.description,
                service: client.selected_service,
                offer: client.selected_offer,
                status: client.status,
                salesRepDetails: client.sales_rep_details,
                statusChangeDate: client.status_change_date ? client.status_change_date.toISOString().slice(0, 10) : null,
                finalSalesRepDetails: client.final_sales_rep_details,
                lastChangeDate: client.last_change_date ? client.last_change_date.toISOString().slice(0, 10) : null
            }
        })
        console.log(resArr);
        res.status(200).json(resArr)
    } catch (error) {
        console.error(error);
    }
})

app.put("/basvurular/:applicationID", serverFunction.authenticateToken, async (req, res) => {
    const client = await pool.connect()
    // if an ID that doesn't exist in database gets sent, nothing get's updated but no error get's triggered.
    const userInfo = res.locals.userInfo
    // console.log(userInfo.role);
    if (userInfo.role !== "sales_assistant")
        return res.status(401).json("this user does not have sales assistant premission")
    const { applicationID } = req.params
    const { salesRepDetails, statusChange } = req.body
    const d = new Date()
    try {
        const query = await client.query("SELECT last_change_date FROM sales_applications WHERE id = $1", [applicationID])
        if (query.rows[0].last_change_date !== null)
            return res.status(401).json("You cannot set application status to approved without first procedures")
        console.log("query", query.rows)
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        await client.query('BEGIN')
        await client.query("UPDATE sales_applications_details SET sales_rep_details = $1, status_change_date = $2 WHERE id = $3",
         [salesRepDetails, currentDate, applicationID])
        await client.query("UPDATE sales_applications SET status = $1 WHERE id = $2", [statusChange, applicationID])
        await client.query('COMMIT')
        res.status(200).json("Application was updated successfully")
      } catch (e) {
        console.log(e)
        await client.query('ROLLBACK')
        return res.status(500).json("An error occurred while attempting to update application")
      } finally {
        client.release()
      }
})

app.put("/basvurular/:applicationID/sp", serverFunction.authenticateToken, async (req, res) => {
    const client = await pool.connect()
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant")
        return res.status(401).json("this user does not have sales assistant premission")
    const { applicationID } = req.params
    const { salesRepDetails, statusChange } = req.body
    const d = new Date()
    const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    try {
        const query = await client.query("SELECT last_change_date FROM sales_applications WHERE id = $1", [applicationID])
        if (query.rows[0].last_change_date !== null)
            return res.status(401).json("You cannot set application status to approved without first procedures")
        await client.query('BEGIN')
        await client.query("UPDATE sales_applications_details SET final_sales_rep_details = $1 WHERE id = $2",
         [salesRepDetails, applicationID])
        await client.query("UPDATE sales_applications SET status = $1, last_change_date = $2 WHERE id = $3", [statusChange, currentDate, applicationID])
        await client.query('COMMIT')
        res.status(200).json("Application was updated successfully")
      } catch (e) {
        console.log(e)
        await client.query('ROLLBACK')
        return res.status(500).json("An error occurred while attempting to update application")
      } finally {
        client.release()
      }
})

app.get("/", (req, res) => res.json("app worksssssssssss"))


const PORT = process.env.PORT || 8080
console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));