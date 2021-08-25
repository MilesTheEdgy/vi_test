const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const pool = require("../../database/index");
const mailgun = require("../../../lib/mailgun")
const uniqid = require('uniqid');
const {
    checkCredentials,
    generateAccessToken
} = require("./functions");

const {
    authenticateToken,
    verifyRegisterRoute
} = require("./middleware");

const {
    handleError
} = require("../../functions")

dotenv.config();
process.env.TOKEN_SECRET;

const app = module.exports = express();

// Checks to see if the user's token is still valid, if it is, respond with the user's username, and role 
app.post("/", authenticateToken, async (req, res) => {
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
        let checkCredentialsResult = await checkCredentials(username, password)
        if (checkCredentialsResult.ok) {
            let token = generateAccessToken({username: username, role: checkCredentialsResult.userRole, userID: checkCredentialsResult.ID})
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

// this code handles the registeration prodcedure by inserting a new record into the database
// that contains the user's info, and sends a verification link to the user's email.
app.post("/register", verifyRegisterRoute, async(req, res) => {
    try {
        const { username, password, dealerName, email } = req.body;

        const uniqueID = uniqid()
        const hash = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO register(username, password, email, verify_email_id, date, dealer_name) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5)",
         [username, hash, email, uniqueID, dealerName])
        console.log('attempt at finding dir: ', __dirname + "/../../../views/emailverification/verifyemail.ejs")
        app.render(__dirname + "/../../../views/emailverification/verifyemail.ejs", 
        {verifyEmailID: "http://localhost:8080/verifymail/" + uniqueID},
         (err, html) => {
            if (err)
                return handleError(err, res, "server error when attempting to register user")
            const emailData = {
                from: '<info@obexport.com>',
                to: email,
                subject: 'Mail adresinizi onaylayın',
                html: html
            }
            mailgun.messages().send(emailData, (err, body) => {
                if (err)
                    return handleError(err, res, "server error when attempting to register user")
                console.log(body);
                res.status(200).json("Register application is successful, awaiting client verification through client's email")
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json("error occurred at register route")
    }
});

//this code handles verifiying the email that was inserted in the database, and sent to the client's email. It takes the
//special ID generated in register route, and placed in the email template URL button as the main argument. Then proceeds
// to verify it. If verifications pass, the user's records gets inserted in the login table, which allows him to log in to
// the application
app.get("/verifymail/:emailID", async (req, res) => {
    const { emailID } = req.params
    const client = await pool.connect()
    try {
        const emailIDQuery = await client.query("SELECT * FROM register WHERE verify_email_id = $1", [emailID])
        if (emailIDQuery.rows.length === 0)
            return res.status(403).json("Your email verification ID has expired or doesn't exist")

        const { username, password, email, dealer_name } = emailIDQuery.rows[0]
        const userID = uniqid()

        await client.query('BEGIN')
        const insertUserQuery = await client.query("INSERT INTO login(username, hash, role, active, register_date, user_id, email, name) VALUES($1, $2, 'dealer', true, CURRENT_DATE, $3, $4, $5) RETURNING email",
         [username, password, userID, email, dealer_name])
        await client.query("DELETE FROM register WHERE email = $1",
         [insertUserQuery.rows[0].email])
        await client.query('COMMIT')

        return res.render(__dirname + '/ejs/emailVerified.ejs', {loginPage: "http://localhost:3000"})
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK')
        return res.status(500).json("An error occurred while attempting to update application")
      } finally {
        client.release()
      }
})


// This code handles resetting the client's password. it takes the client's email as the main
// argument. If the client's email exists in the database, it inserts a reset token into the
// database, and sends the same reset token to the client's email. The token expires in 1 hour
// If the client's email doesn't exist, it sends a 200 status anyways.
app.get("/resetpassword", async (req, res) => {
    const { email } = req.query

    const doesPrevResetToken = await pool.query("SELECT * FROM tempidstore WHERE pass_reset_for = $1", [email])

    // if client has alreacy submitted a reset request, invalidate the previous token
    if (doesPrevResetToken.rows !== 0)
        await pool.query("UPDATE tempidstore SET is_valid = false WHERE pass_reset_for = $1", [email])

    const emailIDQuery = await pool.query("SELECT * FROM login WHERE email = $1", [email])
    if (emailIDQuery.rows.length === 0)
        // I'm returning a fake response to protect a potential attacker from finding a user's email
        // in reality the query failed
        return res.status(200).json("Your account password reset query was successful, check incoming mail")
    const passResetToken = jwt.sign({for: email, date : new Date()}, process.env.TOKEN_SECRET, { expiresIn: 3600 });
    //insert token into database
    await pool.query("INSERT INTO tempidstore VALUES($1, CURRENT_DATE, true, $2)", [passResetToken, email])
    //send email with resetPassword HTML template that contains /resetpassword/:passResetToken link
    app.render(__dirname + "/ejs/resetPassword.ejs", 
    {resetPassPage: "https://b2b-iys.herokuapp.com/resetpassword/" + passResetToken},
     (err, html) => {
        const emailData = {
            from: 'İletişim<info@obexport.com>',
            to: email,
            subject: 'Şifre Resetleme',
            html: html
        }
        mailgun.messages().send(emailData, (error, body) => {
            if (error) {
                console.error(error)
                return res.status(500).json("An error occurred during password reset")
            }
            console.log(body);
            res.status(200).json("Your account password reset query was successful, check incoming mail")
        });
    })
})


// This code runs when the client clicks the link sent to his email in the EMAIL template
// that was sent by the /resetpassword route. If the token is valid, it renders a React
// build that allows the user to reset his password. If the token is invalid, it renders
// an HTML that tells the user the link was expired
app.get("/resetpassword/:passResetToken", async (req, res) => {
    const { passResetToken } = req.params
    if (passResetToken === null)
        return res.sendFile(path.join(__dirname+'/pages/passresetlinkexpired/index.html'));

    const isTokenValid = await pool.query("SELECT * FROM tempidstore WHERE pass_reset_id = $1", [passResetToken])
    if (!isTokenValid.rows[0])
        return res.sendFile(path.join(__dirname+'/pages/passresetlinkexpired/index.html'));
    
    if (isTokenValid.rows[0].is_valid === false)
        return res.sendFile(path.join(__dirname+'/pages/passresetlinkexpired/index.html'));

    jwt.verify(passResetToken, process.env.TOKEN_SECRET, async function(err, decoded) {
        if (err) {
            console.error(err)
            return res.status(403).json("Token authentication failed")
        } else {
            const email = decoded.for
            return res.sendFile(path.join(__dirname+'/pages/enternewpass/build/index.html'));
        }
    });
})


// This code handles the password reset procedure initialized by the previous GET route that
// sent the React build. It takes the original sent token as it's main argument. If validations
// pass, previous/all client's tokens get's deleted, and his database login hash get's updated
// according to his new password.
app.put("/resetpassword/:passResetToken", async (req, res) => {
    const { passResetToken } = req.params
    const { password } = req.body
    if (passResetToken === null)
        return res.sendStatus(401).json("Token was null")
    const isTokenValid = await pool.query("SELECT * FROM tempidstore WHERE pass_reset_id = $1", [passResetToken])
    console.log(isTokenValid.rows[0])
    if (!isTokenValid.rows[0])
        return res.status(403).json("Token has expired")
    
    if (isTokenValid.rows[0].is_valid === false)
        return res.status(403).json("Token has expired")

    jwt.verify(passResetToken, process.env.TOKEN_SECRET, async function(err, decoded) {
        if (err) {
            console.error(err)
            return res.status(403).json("Token authentication failed")
        } else {
            console.log("jwt token verification success, token: ", decoded)
            const email = decoded.for
            const hash = await bcrypt.hash(password, 10);
            const client = await pool.connect()
            try {
                await client.query('BEGIN')

                await client.query("DELETE FROM tempidstore WHERE pass_reset_for = $1", [email])
                await client.query("UPDATE login SET hash = $1 WHERE email = $2", [hash, email])

                await client.query('COMMIT')
                return res.status(200).json("Password reset successfull.")
            } catch (error) {
                console.log(error)
                await client.query('ROLLBACK')
                return res.status(500).json("An error occurred while resetting your password")
            } finally {
                client.release()
            }        
        }
    });
})
