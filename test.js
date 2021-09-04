
const date = new Date()
console.log('date ', date)

const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
console.log('dateStr ', dateStr)

const prevMonth = `${date.getFullYear()}-${date.getMonth()}-${'01'}`
console.log('prevMonth ', prevMonth)