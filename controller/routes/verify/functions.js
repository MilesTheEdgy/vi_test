const bcrypt = require("bcrypt");
const pool = require("../../database");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { status500Error } = require("../../helpers/functions.js");

dotenv.config();
process.env.TOKEN_SECRET;

const verifyCredentials = async (req, res, next) => {
    const clientUsername = req.body.username
    const clientPassword = req.body.password
    try {
        // VERIFY BEGIN
        if (clientUsername === "" || clientPassword === "")
            return res.status(403).json("one of or both of the submitted fields were empty")
        const userQuery = await pool.query("SELECT username, hash, role, user_id, active, name FROM login WHERE username = $1", [clientUsername])
        if (!userQuery.rows[0])
            return res.status(403).json("username or password does not match")
        const { username, hash, role, user_id, active, name } = userQuery.rows[0]
        if (!active)
            return res.status(406).json("Your account has been deactivated, please contact administration")
        const hashResult = await bcrypt.compare(clientPassword, hash);
        if (!hashResult)
            return res.status(403).json("username or password does not match")
        // VERIFY END
        res.locals.userInfo = {
            username, 
            role, 
            userID: user_id,
            name
        };
        next()
    } catch (err) {
        return status500Error(err, res, ("server error, failed to process your login information"))
    }
    
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 1800 });
}

module.exports = {
    generateAccessToken,
    verifyCredentials
}