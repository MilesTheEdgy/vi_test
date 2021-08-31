const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyUserAndReturnInfo } = require("../../helpers/functions");
const { authenticateToken, verifyReqBodyObjValuesNotEmpty, verifyReqBodyObjNoWhiteSpace } = require("../../helpers/middleware");
const { verifyReqObjExpectedObjKeys, verifyInputNotEmptyFunc } = require("../../helpers/functions")

const app = module.exports = express();

// **** NOTES **** // 
// The below routes use the same verification statements, resulting in atleast 4 repetitions in 4 routes
// I could join them in a single function
// **** NOTES **** // 

// This route is responsible for toggling a user's active status
app.put("/user/active/:userID", authenticateToken, async (req, res) => {
  const userInfo = res.locals.userInfo
  // VERIFICATION BEGIN
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /user/active/:userID at"+__dirname, res, 401, "Unauthorized route")
  const { userID } = req.params
  try {
    const requestedUserInfo = await verifyUserAndReturnInfo(userID) 
    // check if returned user information object from verifyUserAndReturnInfo query is empty
    if (Object.keys(requestedUserInfo).length === 0 && requestedUserInfo.constructor === Object) {
      const errorUserDoesNotExist = "user with ID '" + userID + "' does not exist in database"
      return customStatusError(errorUserDoesNotExist, res, 400, "This user does not exist")
    }
    const requestedUserRole = requestedUserInfo.role
    // Requester cannot update sales_assistant_chef or admin.
    if (requestedUserRole === "sales_assistant_chef" || requestedUserRole === "admin") {
      const errorUnauthorizedUpdate = "user ID '" + userID + "' who is a '" + requestedUserRole +  "' attempted to get updated by requester, unauthorized! at "+__dirname
      return customStatusError(errorUnauthorizedUpdate, res, 400, "You are not authorized to make this update")      
    }
    // VERIFICATION END
    await pool.query("UPDATE login SET active = NOT active WHERE user_id = $1", [userID])
    res.status(200).json("User status update was a success")
  } catch (err) {
    return status500Error(err, res, "server error occurred while attempting to PUT user")
  }
})

// This route is responsible for assigning a user to an area
app.put("/user/assign/area", authenticateToken, async (req, res) => {
  const { userInfo } = res.locals
  // VERIFICATION BEGIN
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /user/assign/area at"+__dirname, res, 401, "Unauthorized route")
  const errorEmptyObjValue = "empty input in request object at " + __dirname
  verifyReqObjExpectedObjKeys(["userID", "toArea"], req.query, res)
  if (!verifyInputNotEmptyFunc(req.query, res))
    return customStatusError(errorEmptyObjValue, res, 400, "Empty input is not allowed")
  const { userID, toArea } = req.query
  try {
    const requestedUserInfo = await verifyUserAndReturnInfo(userID) 
    // check if returned user information object from verifyUserAndReturnInfo query is empty
    if (Object.keys(requestedUserInfo).length === 0 && requestedUserInfo.constructor === Object) {
      const errorUserDoesNotExist = "user with ID '" + userID + "' does not exist in database"
      return customStatusError(errorUserDoesNotExist, res, 400, "This user does not exist")
    }
    const requestedUserRole = requestedUserInfo.role
    // Requester cannot update sales_assistant_chef or admin.
    if (requestedUserRole === "sales_assistant_chef" || requestedUserRole === "admin") {
      const errorUnauthorizedUpdate = "user ID '" + userID + "' who is a '" + requestedUserRole +  "' attempted to get updated by requester, unauthorized! at "+__dirname
      return customStatusError(errorUnauthorizedUpdate, res, 400, "You are not authorized to make this update")      
    }
    // VERIFICATION END
    else {
      await pool.query("UPDATE login SET assigned_area = $1 WHERE user_id = $2", [toArea, userID])
      res.status(200).json("User area assignment update was a success")
    }
  } catch (err) {
    return status500Error(err, res, "server error occurred while attempting to PUT user")
  }
})

// This route is responsible for assigning a user to a role
app.put("/user/assign/role", authenticateToken, async (req, res) => {
  // selectable roles are hardcoded
  const { userInfo } = res.locals 
  const selectableRoles = ["dealer", "sales_assistant"]
  // VERIFICATION BEGINS
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /user/assign/role at"+__dirname, res, 401, "Unauthorized route")
  const { userID, toRole } = req.query
  // check if toRole request query input exist as element in selectableRoles array
  if (selectableRoles.includes(toRole) === false) {
    const errorStr = "expected input in array '" + selectableRoles + "' instead got " + toRole
    return customStatusError(errorStr, res, 401, "Unexpected input")
  }
  try {
    const requestedUserInfo = await verifyUserAndReturnInfo(userID) 
    // check if returned user information object from verifyUserAndReturnInfo query is empty
    if (Object.keys(requestedUserInfo).length === 0 && requestedUserInfo.constructor === Object) {
      const errorUserDoesNotExist = "user with ID '" + userID + "' does not exist in database"
      return customStatusError(errorUserDoesNotExist, res, 400, "This user does not exist")
    }
    const requestedUserRole = requestedUserInfo.role
    // Requester cannot update sales_assistant_chef or admin.
    if (requestedUserRole === "sales_assistant_chef" || requestedUserRole === "admin") {
      const errorUnauthorizedUpdate = "user ID '" + userID + "' who is a '" + requestedUserRole +  "' attempted to get updated by requester, unauthorized! at "+__dirname
      return customStatusError(errorUnauthorizedUpdate, res, 400, "You are not authorized to make this update")      
    }
    // VERIFICATION ENDS
    await pool.query("UPDATE login SET role = $1 WHERE user_id = $2", [toRole, userID])
    res.status(200).json("User status update was a success")
  } catch (err) {
    return status500Error(err, res, "server error occurred while attempting to PUT user")
  }
})

app.post("/goal", verifyReqBodyObjValuesNotEmpty, verifyReqBodyObjNoWhiteSpace, async (req, res) => {
  const userInfo = {
    userID: "1fa591688ksg060ch",
    userRole: "sales_assistant_chef"
  }

  // VERIFICATION BEGINS
  verifyReqObjExpectedObjKeys(["userID", "date", "service", "goal"], req.body, res)
  const { userID, date, service, goal } = req.body
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /user/assign/role at"+__dirname, res, 401, "Unauthorized route")
  try {
    const requestedUserInfo = await verifyUserAndReturnInfo(userID) 
    // check if returned user information object from verifyUserAndReturnInfo query is empty
    if (Object.keys(requestedUserInfo).length === 0 && requestedUserInfo.constructor === Object) {
      const errorUserDoesNotExist = "user with ID '" + userID + "' does not exist in database"
      return customStatusError(errorUserDoesNotExist, res, 400, "This user does not exist")
    }
    const requestedUserRole = requestedUserInfo.role
    // Requester cannot update sales_assistant_chef or admin.
    if (requestedUserRole === "sales_assistant_chef" || requestedUserRole === "admin") {
      const errorUnauthorizedUpdate = "user ID '" + userID + "' who is a '" + requestedUserRole +  "' attempted to get updated by requester, unauthorized! at "+__dirname
      return customStatusError(errorUnauthorizedUpdate, res, 400, "You are not authorized to make this update")
    }

    const servicesStatement = "SELECT "

    // VERIFICATION ENDS

    await pool.query("UPDATE login SET role = $1 WHERE user_id = $2", [toRole, userID])
    res.status(200).json("User status update was a success")
  } catch (err) {
    return status500Error(err, res, "server error occurred while attempting to PUT user")
  }

  
})