const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyUserAndReturnInfo, replaceTURCharWithENG } = require("../../helpers/functions");
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
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["userID", "toArea"], req.query, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const isInputEmpty = verifyInputNotEmptyFunc(res.query)
  if (isInputEmpty.ok === false)
    return customStatusError(isInputEmpty.error, res, isInputEmpty.statusCode, isInputEmpty.resString)
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
  const userInfo = res.locals

  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["userID", "date", "service", "goal"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
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

app.post("/service", authenticateToken, verifyReqBodyObjValuesNotEmpty, async (req, res) => {
  const { userInfo } = res.locals
  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["newServiceName", "newServiceDescription", "isProfitable"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const { newServiceName, newServiceDescription, isProfitable } = req.body
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array to check if user's submitted service is not duplicate (The name column in db
    // already has a unique constraint but still having a custom error message would be usefull)
    const servicesStatement = "SELECT * FROM services WHERE active = true AND profitable = TRUE"
    const servicesQuery = await pool.query(servicesStatement)
    const servicesArr = servicesQuery.rows.map(obj => obj.name)
    // check if 'service' value from req.body exists in services array, if true return 401
    if (servicesArr.includes(newServiceName) === true) {
      const errorStrUnexpectedInput = "services array '" + servicesArr + "' already contains the value '" + newServiceName + "' submitted by requester"
      return customStatusError(errorStrUnexpectedInput, res, 401, "Service already exists")
    }
    // VERIFICATION ENDS
    const serviceNameEng = replaceTURCharWithENG(newServiceName)
    const queryString = "INSERT INTO services(name, description, profitable, eng_equivalent) VALUES ($1, $2, $3, $4)"
    await pool.query(queryString, [newServiceName, newServiceDescription, isProfitable, serviceNameEng])
    return res.status(200).json("Your service was added successfully!")
  } catch (err) {
    return status500Error(err, res, "Could not insert service")
  }
})

app.put("/service/name", authenticateToken, verifyReqBodyObjNoWhiteSpace, async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const { newServiceName } = req.body
  const userInfo = res.locals

  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["newServiceName"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const isInputEmpty = verifyInputNotEmptyFunc(res.body)
  if (isInputEmpty.ok === false)
    return customStatusError(isInputEmpty.error, res, isInputEmpty.statusCode, isInputEmpty.resString)
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/name at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    if (newServiceName === servicesQuery.rows[0].name) {
      const errorStrSameName = "requested service name change '" + newServiceName + "' is no different than " + servicesQuery.rows[0].name
      return customStatusError(errorStrSameName, res, 401, "Service name is already the same, no change required")
    }
    // VERIFICATION ENDS
    const serviceEngEquivalent = replaceTURCharWithENG(newServiceName)
    const queryString = "UPDATE services SET name = $1, eng_equivalent = $2 WHERE eng_equivalent = $3"
    await pool.query(queryString, [newServiceName, serviceEngEquivalent, serviceEngName])
    res.status(200).json("Your service name was updated successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service name")
  }
})

app.put("/service/description", async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const { newServiceDescription } = req.body
  const userInfo = res.locals

  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["newServiceDescription"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const isInputEmpty = verifyInputNotEmptyFunc(res.body)
  if (isInputEmpty.ok === false)
    return customStatusError(isInputEmpty.error, res, isInputEmpty.statusCode, isInputEmpty.resString)
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/description at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    if (newServiceDescription === servicesQuery.rows[0].description) {
      const errorStrSameDescription = "requested service description change '" + newServiceDescription + "' is no different than " + servicesQuery.rows[0].description
      return customStatusError(errorStrSameDescription, res, 401, "Service description is already the same, no change required")
    }
    // VERIFICATION ENDS
    const queryString = "UPDATE services SET description = $1 WHERE eng_equivalent = $2"
    await pool.query(queryString, [newServiceDescription, serviceEngName])
    res.status(200).json("Your service description was updated successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service description")
  }
})

app.put("/service/active", authenticateToken, async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const userInfo = res.locals

  // VERIFICATION BEGINS
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/active at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    // VERIFICATION ENDS
    const queryString = "UPDATE services SET active = NOT active, active_last_change_date = CURRENT_TIMESTAMP WHERE eng_equivalent = $1"
    await pool.query(queryString, [serviceEngName])
    res.status(200).json("Your service's active state was toggled successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service active")
  }
})

app.put("/service/profitable", authenticateToken, async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const userInfo = res.locals

  // VERIFICATION BEGINS
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/active at"+__dirname, res, 401, "Unauthorized route")
  try {
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    // VERIFICATION ENDS
    const queryString = "UPDATE services SET profitable = NOT profitable WHERE eng_equivalent = $1"
    await pool.query(queryString, [serviceEngName])
    res.status(200).json("Your service's profitable state was toggled successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service active")
  }
})

// app.put("/service/value", async (req, res) => {
//   const { service } = req.query
//   const serviceEngName = service
//   const { newServiceValue } = req.body
//   const userInfo = res.locals

//   // VERIFICATION BEGINS
//   const isReqObjVerified = verifyReqObjExpectedObjKeys(["newServiceValue"], req.body, res)
//   if (isReqObjVerified.ok === false)
//     return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
//   const isInputEmpty = verifyInputNotEmptyFunc(res.body)
//   if (isInputEmpty.ok === false)
//     return customStatusError(isInputEmpty.error, res, isInputEmpty.statusCode, isInputEmpty.resString)
//   if (userInfo.userRole !== "sales_assistant_chef")
//     return customStatusError("unauthorized access, no sales_assistant_chef role /service/value at"+__dirname, res, 401, "Unauthorized route")
//   try {
//     // get services and store them in array
//     const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
//     const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
//     // check if 'service' value exists in DB, else return 401
//     if (servicesQuery.rowCount === 0) {
//       const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
//       return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
//     }
//     if (newServiceValue === servicesQuery.rows[0].value) {
//       const errorStrSameDescription = "requested service value change '" + newServiceValue + "' is no different than " + servicesQuery.rows[0].value
//       return customStatusError(errorStrSameDescription, res, 401, "Service description is already the same, no change required")
//     }
//     // VERIFICATION ENDS
//     const queryString = "UPDATE services SET value = $1 WHERE eng_equivalent = $2"
//     await pool.query(queryString, [newServiceValue, serviceEngName])
//     res.status(200).json("Your service description was updated successfully")
//   } catch (err) {
//     return status500Error(err, res, "server error while PUTTING service description")
//   }
// })

app.post("/offer", authenticateToken, verifyReqBodyObjValuesNotEmpty, async (req, res) => {
  const { userInfo } = res.locals
  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["newOfferName", "newOfferDescription", "newOfferValue", "forServiceID"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const { newOfferName, newOfferDescription, newOfferValue, forServiceID } = req.body
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service at"+__dirname, res, 401, "Unauthorized route")
  try {
    // Verify if service exists
    const servicesStatement = "SELECT name FROM services WHERE service_id = $1"
    const servicesQuery = await pool.query(servicesStatement, [forServiceID])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service ID '" + forServiceID + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your service ID that includes the offer does not exist")
    }
    const offersStatement = "SELECT name FROM offers WHERE name = $1 AND service_id = $2"
    const offersQuery = await pool.query(offersStatement, [newOfferName, forServiceID])
    if (offersQuery.rowCount !== 0) {
      const errorStrUnexpectedInput = "requester's requested offer '" + newOfferName + "' already exists in database "
      return customStatusError(errorStrUnexpectedInput, res, 401, "Your new offer's name already exists")
    }
    // VERIFICATION ENDS
    const queryString = "INSERT INTO offers(name, description, service_id, value) VALUES ($1, $2, $3, $4)"
    await pool.query(queryString, [newOfferName, newOfferDescription, forServiceID, newOfferValue])
    return res.status(200).json("Your offer was added successfully!")
  } catch (err) {
    return status500Error(err, res, "Could not insert offer")
  }
})

// I'M WORKING ON ADDING PUT ROUTES FOR OFFERS
app.put("/service/name", authenticateToken, verifyReqBodyObjNoWhiteSpace, async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const { newServiceName } = req.body
  const userInfo = res.locals

  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["newServiceName"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const isInputEmpty = verifyInputNotEmptyFunc(res.body)
  if (isInputEmpty.ok === false)
    return customStatusError(isInputEmpty.error, res, isInputEmpty.statusCode, isInputEmpty.resString)
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/name at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    if (newServiceName === servicesQuery.rows[0].name) {
      const errorStrSameName = "requested service name change '" + newServiceName + "' is no different than " + servicesQuery.rows[0].name
      return customStatusError(errorStrSameName, res, 401, "Service name is already the same, no change required")
    }
    // VERIFICATION ENDS
    const serviceEngEquivalent = replaceTURCharWithENG(newServiceName)
    const queryString = "UPDATE services SET name = $1, eng_equivalent = $2 WHERE eng_equivalent = $3"
    await pool.query(queryString, [newServiceName, serviceEngEquivalent, serviceEngName])
    res.status(200).json("Your service name was updated successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service name")
  }
})

app.put("/service/description", async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const { newServiceDescription } = req.body
  const userInfo = res.locals

  // VERIFICATION BEGINS
  const isReqObjVerified = verifyReqObjExpectedObjKeys(["newServiceDescription"], req.body, res)
  if (isReqObjVerified.ok === false)
    return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)
  const isInputEmpty = verifyInputNotEmptyFunc(res.body)
  if (isInputEmpty.ok === false)
    return customStatusError(isInputEmpty.error, res, isInputEmpty.statusCode, isInputEmpty.resString)
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/description at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    if (newServiceDescription === servicesQuery.rows[0].description) {
      const errorStrSameDescription = "requested service description change '" + newServiceDescription + "' is no different than " + servicesQuery.rows[0].description
      return customStatusError(errorStrSameDescription, res, 401, "Service description is already the same, no change required")
    }
    // VERIFICATION ENDS
    const queryString = "UPDATE services SET description = $1 WHERE eng_equivalent = $2"
    await pool.query(queryString, [newServiceDescription, serviceEngName])
    res.status(200).json("Your service description was updated successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service description")
  }
})

app.put("/service/active", authenticateToken, async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const userInfo = res.locals

  // VERIFICATION BEGINS
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/active at"+__dirname, res, 401, "Unauthorized route")
  try {
    // get services and store them in array
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    // VERIFICATION ENDS
    const queryString = "UPDATE services SET active = NOT active, active_last_change_date = CURRENT_TIMESTAMP WHERE eng_equivalent = $1"
    await pool.query(queryString, [serviceEngName])
    res.status(200).json("Your service's active state was toggled successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service active")
  }
})

app.put("/service/profitable", authenticateToken, async (req, res) => {
  const { service } = req.query
  const serviceEngName = service
  const userInfo = res.locals

  // VERIFICATION BEGINS
  if (userInfo.userRole !== "sales_assistant_chef")
    return customStatusError("unauthorized access, no sales_assistant_chef role /service/active at"+__dirname, res, 401, "Unauthorized route")
  try {
    const servicesStatement = "SELECT * FROM services WHERE eng_equivalent = $1"
    const servicesQuery = await pool.query(servicesStatement, [serviceEngName])
    // check if 'service' value exists in DB, else return 401
    if (servicesQuery.rowCount === 0) {
      const errorStrUnexpectedInput = "requester's requested service '" + serviceEngName + "' does not exist "
      return customStatusError(errorStrUnexpectedInput, res, 401, "your requested service does not exist")
    }
    // VERIFICATION ENDS
    const queryString = "UPDATE services SET profitable = NOT profitable WHERE eng_equivalent = $1"
    await pool.query(queryString, [serviceEngName])
    res.status(200).json("Your service's profitable state was toggled successfully")
  } catch (err) {
    return status500Error(err, res, "server error while PUTTING service active")
  }
})