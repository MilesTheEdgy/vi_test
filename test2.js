// const conditionArr = ["submit_time > now() - interval '1 day'", "submitter = ", "status = ", "submit_time > now() - interval '1 day'", "submitter = ", "status = "]

const queryConstructor = (selectStatement, conditionArr) => {
    let conditionText = ""
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0)
            conditionText = ` WHERE ${conditionArr[i]}`
        else
            conditionText = conditionText + " AND " + conditionArr[i] + `$${i}`
    }
    return selectStatement + conditionText
}

const date = "year"
const selectCount = "SELECT count(*) FROM sales_applications"
let conditionTime = "submit_time > now() - interval"
const conditionSubmitter = "submitter = "
const conditionStatus = "status = "

switch (date) {
    case "today":
        conditionTime = conditionTime + "' 1 day'"
        break
    case "week":
        conditionTime = conditionTime + "' 7 day'"
        break
    case "month":
        conditionTime = conditionTime + "' 30 day'"
        break
    case "year":
        conditionTime = conditionTime + "' 365 day'"
        break
    default:
        break;
}

let conditionArr = ["ademiletişim", "approved", "ALL", "something", "ALL"]
for (let i = 0; i < conditionArr.length; i++) {
    console.log("in loop ", i)
    if (conditionArr[i] === "ALL") {
        conditionArr.splice(i, 1)
    }
}
console.log(conditionArr)


// console.log(queryConstructor(selectCount, [conditionTime, conditionStatus, conditionSubmitter]))