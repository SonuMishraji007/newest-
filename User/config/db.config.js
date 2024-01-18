const mysql = require('mysql2');

/*var mysqlConnection = mysql.createPool({
    host: "nrs.ccm3xq5r6lrv.us-west-1.rds.amazonaws.com",
    user: "posadmin",
    password: "GVwIKnqGYnuMotg1YKQr",
    database: "Pointofsale",
    // connectionLimit: 20, // increase the connection limit here
});*/

/*var mysqlConnection = mysql.createPool({
    host: "192.168.29.174",
    user: "devops",
    password: "KeNi@0408",
    database: "Pointofsale",
    // connectionLimit: 20, // increase the connection limit here
});*/

var mysqlConnection = mysql.createPool({
    host: "db-sonarpos.c39oymxcii7e.us-east-1.rds.amazonaws.com",
    // user: "devops",
    // password: "Dots@1234",
    user: "kenimaster",
    password: "1hTC88limW60BKw4RZ4m",
    database: "Pointofsale",
    mode:"loca",
    // connectionLimit: 20, // increase the connection limit here
});




mysqlConnection.getConnection((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error :'); // + JSON.stringify(err, undefined, 2));
});

module.exports = mysqlConnection;   
