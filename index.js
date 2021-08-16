const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
// const client = require("./db");
const pool = require("./db");
const serverFunction = require("./functions");
const { 
    FOR_SDC_GET_USER_APPS_ACCORDINGTO,
    FOR_SDC_GET_USER_CRITERIA_APPS,
    fetchUserAppsCount,
    fetchUserAppsDetails
} = require("./database/queries")
const { 
    forDealerGetApplications
} = require("./database/dealerqueries")


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

app.get("/bayi/applications", serverFunction.authenticateToken, async(req, res) => {
    try {
        const username = res.locals.userInfo.username
        const { status } = req.query
        const response = await forDealerGetApplications(username, status)
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/applications/:applicationID", async(req, res) => {
    try {
        console.log("route hit")
        const { applicationID } = req.params
        let query = await pool.query("SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service, sales_applications_details.selected_offer, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id WHERE sales_applications.id = $1",
        [applicationID])
        console.log(query.rows)
        res.status(200).json(query.rows)
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
        res.status(200).json(query.rows)
    } catch (error) {
        console.error(error);
    }
})

app.put("/basvurular/:applicationID", serverFunction.authenticateToken, async (req, res) => {
    const client = await pool.connect()
    // if an ID that doesn't exist in database gets sent, nothing get's updated but no error get's triggered.
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant")
        return res.status(401).json("this user does not have sales assistant premission")
    const { applicationID } = req.params
    const { salesRepDetails, statusChange } = req.body
    const d = new Date()
    try {
        const query = await client.query("SELECT last_change_date FROM sales_applications WHERE id = $1", [applicationID])
        // *** because I updated the status records of the database manually, I temporarily commented the lines of code below, I need to uncomment them again
        // if (query.rows[0].last_change_date !== null)
        //     return res.status(401).json("You cannot set application status to approved without first procedures")
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
        // if (query.rows[0].last_change_date !== null)
        //     return res.status(401).json("You cannot set application status to approved without first procedures")
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// SATIŞ DESTEK ÇEF///////////////////////////////////////////////////////////////////////////////////////

app.get("/sdc/users", serverFunction.authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    try {
        const query = await pool.query("SELECT id, username, role, register_date, active FROM login")
        res.status(200).json(query.rows)
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("/sdc/user/:userID", serverFunction.authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    const { userID } = req.params
    try {
        const query = await pool.query("SELECT id, username, role FROM login WHERE id = $1", [userID])
        res.status(200).json(query.rows[0])
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("/sdc/user/:id/count", serverFunction.authenticateToken, async (req, res) => {
    
    // Returns the COUNT of user total sent applications
    // can be filtered through specific criteria in fetchUserAppsCount args
    // EG: fetchUserAppsCount(id, approved, DSL) OR fetchUserAppsCount(id, ALL, ALL)

    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    try {
        const { service, status } = req.query
        const { id } = req.params
        const approvedAppsCountQuery = await fetchUserAppsCount(id, status, service)
        res.status(200).json(approvedAppsCountQuery)
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("/sdc/user/:id/details", serverFunction.authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    if (userInfo.role !== "sales_assistant_chef")
        return res.status(401).json("this user does not have sales assistant premission")
    const { service } = req.query
    const { id } = req.params
    try {
        console.log("service and id", service, id)
        const result = await fetchUserAppsDetails(service, id)
        console.log(result)
        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        return res.status(500).json("An error occurred while attempting to update application")
      }
})

app.get("/", (req, res) => res.json("app worksssssssssss"))


const PORT = process.env.PORT || 8080
console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
app.listen(PORT, ()=>console.log(`Server is listening on port ${PORT}`));