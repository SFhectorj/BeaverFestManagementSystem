/*
Citation for this file:
Date Retrieved: February 10, 2026
Adapted From: CS340 Starter Application
Type: Source Code
Author: Oregon State University CS340 Course Staff
Source: https://canvas.oregonstate.edu

Notes:
This file was adapted from the CS340 starter application provided through
Canvas. Additional CRUD routes and functionality were implemented by our team.
*/

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
