/*
    WEBPAGE SETUP
*/
var express = require('express');   
var app     = express();            
var PORT    = 4932;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.urlencoded({extended: true}));  // This allows us to parse the body of POST requests

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
        let query1 = "SELECT Venues.venueID, Venues.venueName, Venues.capacity, Venues.venueType, Venues.locationDescription, CONCAT(Managers.firstName, ' ', Managers.lastName) AS managerName, Sponsors.sponsorName FROM Venues LEFT JOIN Managers ON Venues.managerID = Managers.managerID LEFT JOIN Sponsors ON Venues.sponsorID = Sponsors.sponsorID;";
        // Query 2: Get all Managers for the dropdown
        let query2 = "SELECT managerID, firstName, lastName FROM Managers;";

        // Query 3: Get all Sponsors for the dropdown
        let query3 = "SELECT sponsorID, sponsorName FROM Sponsors;";

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
        let query1 = "SELECT Performances.performanceID, Bands.bandName, Venues.venueName, Performances.performanceDate, Performances.startTime, Performances.durationMinutes FROM Performances INNER JOIN Bands ON Performances.bandID = Bands.bandID INNER JOIN Venues ON Performances.venueID = Venues.venueID ORDER BY Performances.performanceDate, Performances.startTime;";
        // Query 2: Get all Bands to populate the "Band" dropdown
        let query2 = "SELECT bandID, bandName FROM Bands;";

        // Query 3: Get all Venues to populate the "Venue" dropdown
        let query3 = "SELECT venueID, venueName FROM Venues;";

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

// 7. Route to display the Update Band form
app.get('/update-band/:id', function(req, res) {
    // Grab the bandId from the URL parameter
    let bandID = req.params.id;

    // Query the database for this specific band
    let query1 = "SELECT * FROM Bands WHERE bandID = ?;";

    // We use [bandID] to safely insert the variable into the '?' placeholder
    db.pool.query(query1, [bandID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Render the update-band template, passing it the single row we found
            res.render('update-band', { band: rows[0] });
        }
    });
});

// 8. Route to display the Update Venue form
app.get('/update-venue/:id', function(req, res) {
    let venueID = req.params.id;

    // Query 1: Get the specific venue we want to update
    let query1 = "SELECT * FROM Venues WHERE venueID = ?;";
    // Query 2: Get all managers for the dropdown
    let query2 = "SELECT managerID, firstName, lastName FROM Managers;";
    // Query 3: Get all sponsors for the dropdown
    let query3 = "SELECT sponsorID, sponsorName FROM Sponsors;";

    // Run Query 1
    db.pool.query(query1, [venueID], function(error, rows, fields) {
        let venue = rows[0]; // Save the single venue row
        
        // Run Query 2
        db.pool.query(query2, function(error, rows, fields) {
            let managers = rows; // Save the managers list
            
            // Run Query 3
            db.pool.query(query3, function(error, rows, fields) {
                let sponsors = rows; // Save the sponsors list
                
                // Render the page with all the necessary data
                res.render('update-venue', {
                    venue: venue,
                    managers: managers,
                    sponsors: sponsors
                });
            });
        });
    });
});


// 9. Route to display the Update Performance form
app.get('/update-performance/:id', function(req, res) {
    let performanceID = req.params.id;
    let query1 = "SELECT * FROM Performances WHERE performanceID = ?;";
    let query2 = "SELECT bandID, bandName FROM Bands;";
    let query3 = "SELECT venueID, venueName FROM Venues;";

    db.pool.query(query1, [performanceID], function(error, rows, fields) {
        let performance = rows[0];
        db.pool.query(query2, function(error, rows, fields) {
            let bands = rows;
            db.pool.query(query3, function(error, rows, fields) {
                let venues = rows;
                res.render('update-performance', {
                    performance: performance,
                    bands: bands,
                    venues: venues
                });
            });
        });
    });
});


// 10. Route to display the Update Manager form
app.get('/update-manager/:id', function(req, res) {
    let managerID = req.params.id;
    let query1 = "SELECT * FROM Managers WHERE managerID = ?;";
    db.pool.query(query1, [managerID], function(error, rows, fields) {
        res.render('update-manager', { manager: rows[0] });
    });
});

// 11. Route to display the Update Sponsor form
app.get('/update-sponsor/:id', function(req, res) {
    let sponsorId = req.params.id;
    let query1 = "SELECT * FROM Sponsors WHERE sponsorID = ?;";
    db.pool.query(query1, [sponsorId], function(error, rows, fields) {
        res.render('update-sponsor', { sponsor: rows[0] });
    });
});

// 12. Route to Reset the Database
app.post('/sp_reset_beaverfest', function(req, res) {
    let query1 = "CALL sp_reset_beaverfest();";

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Redirect back to the home page after resetting
            res.redirect('/'); 
        }
    });
});

// 13. Route to Demo the Delete Operation
app.post('/demo-delete', function(req, res) {
    let query1 = "CALL DemoDeleteBand();";

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Redirect to the Bands page so you can immediately see they are gone
            res.redirect('/bands'); 
        }
    });
});

// 14. Route to Delete a Band
app.post('/delete-band', function(req, res) {
    // Grab the bandID from the form submission (hidden input)
    let bandID = req.body.bandID;
    let query = "DELETE FROM Bands WHERE bandID = ?;";

    // Execute the query
    db.pool.query(query, [bandID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Redirect to the Bands page so you can see the updated list
            res.redirect('/bands');
        }
    });
});

// 15. Route to Delete a Venue
app.post('/delete-venue', function(req, res) {
    let venueID = req.body.venueID;
    let query = "DELETE FROM Venues WHERE venueID = ?;";

    db.pool.query(query, [venueID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/venues');
        }
    });
});

// 16. Route to Add a New Band
app.post('/add-band-form', function(req, res) {
    let data = req.body; // Get the data from the form submission
    let query = "INSERT INTO Bands (bandName, genre, contactEmail, estimatedDraw) VALUES (?, ?, ?, ?);";
    // We create an array of values that matches the order of the '?' placeholders in our query
    let values = [
        data['input-bandName'],
        data['input-genre'],
        data['input-email'],
        data['input-estimatedDraw']
    ];
    // Execute the query, passing in the array of values to safely insert them into the query
    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/bands');
        }
    });
});

//17. Route to Add a New Venue
app.post('/add-venue-form', function(req, res) {
    let data = req.body;
    let managerID = data['input-manager'] === '' ? null : data['input-manager']; // Get the selected managerID from the form
    let sponsorID = data['input-sponsor'] === '' ? null : data['input-sponsor']; // Get the selected sponsorID from the form
    let query = "INSERT INTO Venues (venueName, capacity, venueType, locationDescription, managerID, sponsorID) VALUES (?, ?, ?, ?, ?, ?);";
    let values = [
        data['input-venueName'],
        data['input-capacity'],
        data['input-venueType'],
        data['input-locationDescription'],
        managerID,
        sponsorID
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/venues');
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
