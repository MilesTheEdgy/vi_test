const pool = require("../controller/database")
const { parentPort } = require("worker_threads")

let isCancelled = false;


// **** this is the select from month ago statement
// SELECT * FROM transactions 
// WHERE EXTRACT(month from date) = 
//  	(SELECT date_part('month', (SELECT date_trunc('day', NOW() - interval '1 month'))))
// AND EXTRACT(year from date) = 
//  	(SELECT date_part('year', (SELECT date_trunc('day', NOW() - interval '1 month'))))

(async () => {
    try {
        const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
        const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        
        const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT current_timestamp))) AND user_id = $1"
        for (let i = 0; i < dealers.length; i++) {
            const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
            const transactionSum = transactionsQuery.rows[0].sum
            if (transactionSum !== null) {
                await pool.query("INSERT INTO transaction_reports VALUES ($1, $2)", [dealers[i], transactionSum])
                console.log('REPORT PRINT SUCCESS!!!')
            }
        }
        if (parentPort) parentPort.postMessage('done');
        else process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(0);
    }
})();



















// (async () => {
//     try {
//         const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
//         const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        
//         const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT current_timestamp))) AND user_id = $1"
//         for (let i = 0; i < dealers.length; i++) {
//             const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
//             const transactionSum = transactionsQuery.rows[0].sum
//             if (transactionSum !== null) {
//                 await pool.query("INSERT INTO transaction_reports VALUES ($1, $2)", [dealers[i], transactionSum])
//                 console.log('REPORT PRINT SUCCESS!!!')
//             }
//         }        
//     } catch (err) {
//         console.log(err)
//     }    
// })()

// const printReport = async () => {
//     try {
//         const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
//         const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        
//         const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT current_timestamp))) AND user_id = $1"
//         for (let i = 0; i < dealers.length; i++) {
//             const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
//             const transactionSum = transactionsQuery.rows[0].sum
//             if (transactionSum !== null) {
//                 await pool.query("INSERT INTO transaction_reports VALUES ($1, $2)", [dealers[i], transactionSum])
//                 console.log('REPORT PRINT SUCCESS!!!')
//             }
//         }        
//     } catch (err) {
//         console.log(err)
//     }

// }

// printReport()

