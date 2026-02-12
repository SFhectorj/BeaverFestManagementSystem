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
        // For now, we will just render the page. Later we will add the SELECT query.
        res.render('venues');
    });

// 4. Performances Page
app.get('/performances', function(req, res)
    {
        res.render('performances');
    });

// 5. Managers Page
app.get('/managers', function(req, res)
    {
        res.render('managers');
    });

// 6. Sponsors Page
app.get('/sponsors', function(req, res)
    {
        res.render('sponsors');
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
