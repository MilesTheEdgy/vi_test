


const date = "2021-08-15"

console.log('date: ', date)    
const tempInputDate = new Date(date);
console.log('tempInputDate: ', tempInputDate)
const tempInputDateString = `${tempInputDate.getFullYear()}-${tempInputDate.getMonth()+1}`
console.log('tempInputDateString: ', tempInputDateString)
const inputDate = new Date(tempInputDateString);
console.log('inputDate: ', inputDate)

const tempCurntDate = new Date()
console.log('tempCurntDate: ', tempCurntDate)
const tempCurntDateString = `${tempCurntDate.getFullYear()}-${tempCurntDate.getMonth()+1}`
console.log('tempCurntDateString: ', tempCurntDateString)
const currentDate = new Date(tempCurntDateString)
console.log('currentDate: ', currentDate)

console.log('INPUT DATE FALLS 1 MONTH BEHIND, if we were to extract its month we would get: ', inputDate.getMonth()+1)

console.log('inputDate.setHours ', inputDate.setHours(0, 0, 0, 0))
console.log('currentDate.setHours', currentDate.setHours(0, 0, 0, 0))
console.log('-------------------------')
if (currentDate.setHours(0, 0, 0, 0) < inputDate.setHours(0, 0, 0, 0)) {
    // const errInputDateOlder = "input date '" + tempCurnDateString + "' is older than current date '" + currentDate
    // return customStatusError()
    return console.log("date is older than current date")
} else {
    return console.log("date is newer than current date")
}