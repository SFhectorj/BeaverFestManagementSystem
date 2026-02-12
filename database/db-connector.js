var mysql = require('mysql');

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_yourOnid',      // REPLACE THIS
    password        : 'your_db_password',    // REPLACE THIS
    database        : 'cs340_yourOnid'       // REPLACE THIS
});

// Export it for use in our application
module.exports.pool = pool;