const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyUserAndReturnInfo } = require("../../helpers/functions");
const { authenticateToken, verifyReqBodyObjValuesNotEmpty, verifyReqBodyObjNoWhiteSpace } = require("../../helpers/middleware");
const { verifyReqObjExpectedObjKeys, verifyInputNotEmptyFunc } = require("../../helpers/functions")
const { verifyDateNotOlderThanCurnt, verifyGoalDoesNotExist } = require("./functions")

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

app.post("/goal", authenticateToken, verifyReqBodyObjValuesNotEmpty, verifyReqBodyObjNoWhiteSpace, async (req, res) => {
  // const userInfo = {
  //   userID: "1fa591688ksg060ch",
  //   userRole: "sales_assistant_chef"
  // }

  const userInfo = res.locals

  // VERIFICATION BEGINS
  verifyReqObjExpectedObjKeys(["userID", "date", "service", "goal"], req.body, res)
  const { userID, date, service, goal } = req.body
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /goal at"+__dirname, res, 401, "Unauthorized route")
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

    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE active = true AND profitable = TRUE"
    const servicesQuery = await pool.query(servicesStatement)
    const servicesArr = servicesQuery.rows.map(obj => obj.name)
    // check if 'service' value from req.body exists in services array, if false return 401
    if (servicesArr.includes(service) === false) {
      const errorStrUnexpectedInput = "expected input in array '" + servicesArr + "' got " + service
      return customStatusError(errorStrUnexpectedInput, res, 401, "Unexpected input")
    }
    // I'm verifying if the input date is older than the present date, the func below returns an object with keys {ok, error, verifiedDate} and I'm basing my condition on that
    const isDateOlderThanPresent = verifyDateNotOlderThanCurnt(date)
    if (isDateOlderThanPresent.ok === false)
      return customStatusError(isDateOlderThanPresent.error, res, 401, "inputted date is old UNACCEPTED INPUT")
    // doing something similar here, verifiyng if the goal with the same date, service and userID values already exists
    const doesGoalAlreadyExist = await verifyGoalDoesNotExist(date, service, userID)
    if(doesGoalAlreadyExist.ok === false)
      return customStatusError(doesGoalAlreadyExist.error, doesGoalAlreadyExist.statusCode, 401, "This goal already exists")
    // This verification function returns a date value called verifiedDate, that has the normal year month input, but it resets day to 01 EG: 2021-08-01 OR 2022-11-01
    const { verifiedDate } = isDateOlderThanPresent
    // VERIFICATION ENDS
    try {
      const queryString = "INSERT INTO goals(service, goal, for_date, for_user_id, submit_date, done, success) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 0, false)"
      await pool.query(queryString, [service, goal, verifiedDate, userID])
    } catch (error) {
      return status500Error(error, res, "Could not insert goal")
    }

    res.status(200).json("Your goal was added successfully!")
  } catch (err) {
    return status500Error(err, res, "server error occurred while attempting to PUT user")
  }
})

app.post("/service", async (req, res) => {
  const userInfo = {
    userID: "1fa591688ksg060ch",
    userRole: "sales_assistant_chef"
  }
  const { newServiceName, newServiceDescription, isProfitable } = req.body
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE active = true AND profitable = TRUE"
    const servicesQuery = await pool.query(servicesStatement)
    const servicesArr = servicesQuery.rows.map(obj => obj.name)
    // check if 'service' value from req.body exists in services array, if false return 401
    if (servicesArr.includes(service) === false) {
      const errorStrUnexpectedInput = "expected input in array '" + servicesArr + "' got " + service
      return customStatusError(errorStrUnexpectedInput, res, 401, "Unexpected input")
    }
    // I'm verifying if the input date is older than the present date, the func below returns an object with keys {ok, error, verifiedDate} and I'm basing my condition on that
    const isDateOlderThanPresent = verifyDateNotOlderThanCurnt(date)
    if (isDateOlderThanPresent.ok === false)
      return customStatusError(isDateOlderThanPresent.error, res, 401, "inputted date is old UNACCEPTED INPUT")
    // doing something similar here, verifiyng if the goal with the same date, service and userID values already exists
    const doesGoalAlreadyExist = await verifyGoalDoesNotExist(date, service, userID)
    if(doesGoalAlreadyExist.ok === false)
      return customStatusError(doesGoalAlreadyExist.error, doesGoalAlreadyExist.statusCode, 401, "This goal already exists")
    // This verification function returns a date value called verifiedDate, that has the normal year month input, but it resets day to 01 EG: 2021-08-01 OR 2022-11-01
    const { verifiedDate } = isDateOlderThanPresent
    // VERIFICATION ENDS
    try {
      const queryString = "INSERT INTO goals(service, goal, for_date, for_user_id, submit_date, done, success) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 0, false)"
      await pool.query(queryString, [service, goal, verifiedDate, userID])
    } catch (error) {
      return status500Error(error, res, "Could not insert goal")
    }

    res.status(200).json("Your goal was added successfully!")
  } catch (err) {
    return status500Error(err, res, "server error occurred while attempting to PUT user")
  }
})