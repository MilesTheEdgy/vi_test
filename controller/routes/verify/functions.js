const bcrypt = require("bcrypt");
const pool = require("../../database");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();
process.env.TOKEN_SECRET;

const checkCredentials = async (clientUsername, clientPassword) => {
    try {
        const dbUserTable = await pool.query("SELECT username, hash, role, user_id, active FROM login WHERE username = $1", [clientUsername]);
        const dbUsername = dbUserTable.rows[0]?.username;
        const dbUserHash = dbUserTable.rows[0]?.hash;
        const dbUserRole = dbUserTable.rows[0]?.role;
        const dbUserID = dbUserTable.rows[0]?.user_id;
        if (dbUserTable.rows[0]?.active === false)
            return {ok: false}
        if (dbUsername === clientUsername) {
            let hashResult = await bcrypt.compare(clientPassword, dbUserHash);
            if (hashResult) {
                return {ok: hashResult, username: dbUsername, userRole: dbUserRole, ID: dbUserID}
            } else {
                return {ok: hashResult}
            }
        } else {
            return {ok: false}
        }
    } catch (error) {
        console.error(error);
    }
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 1800 });
}

module.exports = {
    checkCredentials, 
    generateAccessToken
}