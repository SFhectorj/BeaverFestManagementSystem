/*
    WEBPAGE SETUP
*/
var express = require('express');   
var app     = express();            
var PORT    = 9124;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

// 1. Home Page
app.get('/', function(req, res)
    {
        res.render('index');                    // Renders the index.hbs file
    });

// 2. Bands Page
app.get('/bands', function(req, res)
    {
        let query1 = "SELECT * FROM Bands;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('bands', {data: rows});                  // Render the bands.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we received
    });

// 3. Venues Page
app.get('/venues', function(req, res)
    {
        // Query 1: Get all Venues (Joined with Managers and Sponsors for readable names)
        let query1 = "SELECT Venues.venueId, Venues.venueName, Venues.capacity, Venues.type, CONCAT(Managers.firstName, ' ', Managers.lastName) AS managerName, Sponsors.sponsorName FROM Venues LEFT JOIN Managers ON Venues.managerId = Managers.managerId LEFT JOIN Sponsors ON Venues.sponsorId = Sponsors.sponsorId;";

        // Query 2: Get all Managers for the dropdown
        let query2 = "SELECT managerId, firstName, lastName FROM Managers;";

        // Query 3: Get all Sponsors for the dropdown
        let query3 = "SELECT sponsorId, sponsorName FROM Sponsors;";

        // Run Query 1...
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the venues
            let venues = rows;
            
            // Run Query 2 (inside the first callback)...
            db.pool.query(query2, function(error, rows, fields){
                
                // Save the managers
                let managers = rows;

                // Run Query 3 (inside the second callback)...
                db.pool.query(query3, function(error, rows, fields){

                    // Save the sponsors
                    let sponsors = rows;

                    // render the page with all 3 pieces of data
                    res.render('venues', {
                        venues: venues,
                        managers: managers,
                        sponsors: sponsors
                    });
                });
            });
        });
    });

// 4. Performances Page
app.get('/performances', function(req, res)
    {
        // Query 1: Get the table data (Performances + readable Names)
        let query1 = "SELECT Performances.performanceId, Bands.bandName, Venues.venueName, Performances.performanceDate, Performances.startTime, Performances.duration FROM Performances INNER JOIN Bands ON Performances.bandId = Bands.bandId INNER JOIN Venues ON Performances.venueId = Venues.venueId ORDER BY Performances.performanceDate, Performances.startTime;";

        // Query 2: Get all Bands to populate the "Band" dropdown
        let query2 = "SELECT bandId, bandName FROM Bands;";

        // Query 3: Get all Venues to populate the "Venue" dropdown
        let query3 = "SELECT venueId, venueName FROM Venues;";

        // Run Query 1...
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the performances
            let performances = rows;
            
            // Run Query 2 (inside the first callback)...
            db.pool.query(query2, function(error, rows, fields){
                
                // Save the bands
                let bands = rows;

                // Run Query 3 (inside the second callback)...
                db.pool.query(query3, function(error, rows, fields){

                    // Save the venues
                    let venues = rows;

                    // NOW render the page with all 3 pieces of data
                    res.render('performances', {
                        performances: performances,
                        bands: bands,
                        venues: venues
                    });
                });
            });
        });
    });

// 5. Managers Page
app.get('/managers', function(req, res)
    {
        let query1 = "SELECT * FROM Managers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('managers', {data: rows});               // Render the managers.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we received
    });

// 6. Sponsors Page
app.get('/sponsors', function(req, res)
    {
        let query1 = "SELECT * FROM Sponsors;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('sponsors', {data: rows});               // Render the sponsors.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we received
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
