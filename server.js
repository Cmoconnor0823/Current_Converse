var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("index", __dirname + "/views");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/CurrentConverse", { useNewUrlParser: true });
var results = [];


// Routes
// Start routes here...
app.get("/", function (req, res) {
	db.Article.find({ saved: false }, function (err, result) {
		if (err) throw err;
		res.render("index", { result });
	});

});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
	// First, we grab the body of the html with axios
	axios.get("https://www.nytimes.com/").then(function(response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //console.log(response.data);
  
		// Now, we grab every h2 within an article tag, and do the following:

		//check name change for article and h2 look for something like media-item, media-item-summary media-item image
		// (meta__details p class for authors) (media-item_summary div class tease fo a short summary)
		// (media-item_summary h1 class headline a href for link)
		$("article").each(function(i, element) {
			// Save an empty result object
			var result = [];
            console.log("element", element);
            console.log(result);
            
  
			// Add the text and href of every link, 
			// and save them as properties of the result object
			result.title = $(this)
				.children("a")
				.text();
			result.link = $(this)
				.children("a")
                .attr("href");
                
                console.log(result);
  
			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function(dbArticle) {
					// View the added result in the console
					console.log(dbArticle);
				})
				.catch(function(err) {
					// If an error occurred, log it
					console.log(err);
				});
		});
  
		// Send a message to the client
		res.send("Scrape Complete");
	});
});

app.listen(PORT, function () {
	console.log("Server listening on: http://localhost:" + PORT);
});