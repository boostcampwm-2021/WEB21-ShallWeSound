import mysql from 'mysql';
const db_info:mysql.ConnectionConfig = {
    host: `${process.env.DB_HOST}`,
    port: 3306,
    user: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`
}
const connection = mysql.createConnection(db_info);
const initDB = function () {
    return mysql.createConnection(db_info);
}
const connect = function(conn:mysql.Connection) {
    conn.connect(function(err) {
        if(err) console.error('mysql connection error : ' + err);
        else console.log('mysql is connected successfully!');
    });
}
export {
    initDB,
    connect
}