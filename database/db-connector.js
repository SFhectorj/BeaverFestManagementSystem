var mysql = require('mysql');

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_ONID',      // REPLACE THIS
    password        : 'password',    // REPLACE THIS
    database        : 'cs340_ONID'       // REPLACE THIS
});

// Export it for use in our application
module.exports.pool = pool;