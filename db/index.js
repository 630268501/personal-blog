const mysql = require('mysql')
const dbOption = require('./config')
const poor = mysql.createPool(dbOption)
function query (sql,params){
    return new Promise((resolve, reject) => {
        poor.getConnection((err, conn) => {
            if (err){
                reject(err)
                return
            }
            conn.query(sql, params, (err, result) => {
                conn.release()
                if (err) {
                    reject(err)
                    return
                }
                resolve(result)
            })
        })
    })
}
module.exports = query