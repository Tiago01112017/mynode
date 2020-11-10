const mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit:1000,
    //adiciona o limits se a função execute for fechada automaticamente
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
})

// exports.execute = (query, params=[])=>{
//     return new Promise((resolve, reject)=>{
//         pool.getConnection((error, conn)=>{
//             if(error){ 
//                 reject(error)
//             }else{
//                 conn.query(query, params, (err, result, fields)=>{
//                     conn.release();
//                     if(err){
//                         reject(err)
//                     }else{
//                         resolve(result)
//                     }
//                 })
//             }
//         })
//     })
// }
exports.execute = (query, params=[])=>{
    return new Promise((resolve, reject)=>{
        pool.query(query, params, (err, result, fields)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

exports.pool = pool;