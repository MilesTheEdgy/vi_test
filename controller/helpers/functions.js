const uniqid = require("uniqid")
const pool = require("../database")

const status500Error = (err, res, resErrorString) => {
    console.log(err)
    const errorDate = new Date()
    const errorID = uniqid("ERROR-ID-")
    console.log("-*-*-*-" + errorID + " DATE: ", errorDate)
    return res.status(500).json(resErrorString  + " " + errorID)
}
const customStatusError = (err, res, resStatus, resErrorString) => {
    console.log(err)
    const errorDate = new Date()
    const errorID = uniqid("ERROR-ID-")
    console.log("-*-*-*-" + errorID + " DATE: ", errorDate)
    return res.status(resStatus).json(errorID + " " + resErrorString)
}
// A function that compares two arrays to check if they have equal values(regardles
// of different sorting ) I recall using it for verifyObjKeys function.
const arrayCompare = (_arr1, _arr2) => {
    if (
      !Array.isArray(_arr1)
      || !Array.isArray(_arr2)
      || _arr1.length !== _arr2.length
      ) {
        return false;
      }
    
    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();
    
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
         }
    }
    
    return true;
}

const verifyReqObjExpectedObjKeys = (objKeysArr, reqObj) => {
    let requestObjArr = []
    for (const key in reqObj) {
        requestObjArr.push(key)
    }
    if (!arrayCompare(requestObjArr, objKeysArr)) {
        const errorStr = `Expected object keys: { ${objKeysArr} } GOT: { ${requestObjArr} } at ${__dirname}`
        return {
            ok: false,
            error: errorStr,
            statusCode: 401,
            resString: "Unexpected input"
        }
    }
    return {
        ok: true
    }   
}

const verifyInputNotEmptyFunc = (reqObj) => {
    const errorStr = `one of the object's values was empty`
    if (!reqObj)
        return {
            ok: false,
            error: errorStr,
            statusCode: 401,
            resString: "One of your inputs was empty"
        }
    const reqObjArr = Object.values(reqObj)
    for (let i = 0; i < reqObjArr.length; i++) {
        if (reqObjArr[i].trim() === "") {
            return {
                ok: false,
                error: errorStr,
                statusCode: 401,
                resString: "One of your inputs was empty"
            }
        }
    }
    return {
        ok: true
    }
}

const switchServiceNameToTurkish = (service) => {
    let q_service = ""
    switch (service) {
        case "Faturasiz":
            q_service = "Faturasız"; break;
        case "Faturali":
            q_service = "Faturalı"; break;
        case "taahut":
            q_service = "Taahüt"; break;
        case "iptal":
            q_service = "İptal"; break;
        case "tivibu":
            q_service = "Tivibu"; break;
        default:
            q_service = service;
    }
    return q_service
}

// a query constructor specific to DATE queries
const queryConstructorDate = (selectStatement, conditionArr) => {
    let conditionText = ""
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0)
            conditionText = ` WHERE ${conditionArr[i]} $${i+1}`
        else
            conditionText = conditionText + " AND " + conditionArr[i] + `$${i+1}`
    }
    return selectStatement + conditionText
}

const getDealerName = async (userID) => {
    const query = await pool.query("SELECT username FROM login WHERE user_id = $1", [userID])
    return query.rows[0].username
}

const verifyUserAndReturnInfo = async (userID) => {
    const query = await pool.query("SELECT username, hash, role, active, register_date, user_id, email, name, assigned_area FROM login WHERE user_id = $1", [userID])
    if (query.rows.length === 0)
        return {}
    return query.rows[0]
}

// returns a lowercased string that had it's turkish characters replaced with english ones
const replaceTURCharWithENG = (string) => {
    const turkishCharactersArray = [ "İ", "ı", "Ö", "ö", "Ü", "ü", "Ç", "ç", "Ğ", "ğ", "Ş", "ş"]
    const englishEquivilant = ["I", "i", "O", "o", "U", "u", "C", "c", "G", "g", "S", "s"]
    const strArray = string.split("")
    let newStr = ""

    for (let i = 0; i < strArray.length; i++) {
        let tempStr = []
        for (let j = 0; j < turkishCharactersArray.length; j++) {
            if (strArray[i] === turkishCharactersArray[j]) {
                tempStr.push(englishEquivilant[j])
            }
        }
        if (tempStr.length !== 0)
            newStr = newStr + tempStr[0]
        else
            newStr = newStr + strArray[i]
        tempStr.splice(0, tempStr.length)
    }
    return newStr.toLowerCase()
}

const verifyServiceNameFromInput = async (service = undefined, serviceEng = undefined) => {
    let errorStr = ""
    let query
    if (service) {
        errorStr = "service name '" + service + " does not exist in database"
        query = await pool.query("SELECT name FROM services WHERE name = $1", [service])
    }
    else {
        errorStr = "service name's english equivalent '" + serviceEng + " does not exist in database"
        query = await pool.query("SELECT eng_equivalent FROM services WHERE eng_equivalent = $1", [serviceEng])
    }
    if (query.rowCount === 0)
        return {
            ok: false,
            err: errorStr,
            statusCode: 401,
            resString: "Service input does not exist in database"
        }
    return {ok: true}
}

module.exports = {
    status500Error,
    customStatusError,
    verifyReqObjExpectedObjKeys,
    verifyInputNotEmptyFunc,
    switchServiceNameToTurkish,
    queryConstructorDate,
    getDealerName,
    verifyUserAndReturnInfo,
    replaceTURCharWithENG,
    verifyServiceNameFromInput
}