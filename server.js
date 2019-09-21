//requires
var express = require("express");
var mongoose = require("mongoose");
//scrapers
var axios = require("axios");
var cheerio = require('cheerio');
//port and express initializer
var PORT = process.env.PORT || 3000;
var db = require("./models");
var app = express();

//config, req json, exp hndlebrs, mongodb
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

//the routess, axios scraping the NYT website
app.get("/", function(req,res) {
    db.Article.find({saved: true})
    .then(function (dbSaved) {
        res.render("index", {dbSaved: dbSaved});
    })
    .catch(function (error) {
        console.log(error);
    });
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com")
    .then(function (response) {
        var $ = cheerio.load(response.data);
        // 
        $("article").each(function(i, element) {
            
            var result = {};

        // Add all items to the result object
        result.title = $(this).children("div").children("h3").children("a").text();result.link = $(this).children("a").attr("href");
        result.image = $(this).children("a").children("div").children("div").children("picture").children("source").attr("data-srcset");
        result.excerpt = $(this).children("div").children("p").text();

        db.Article.create(result).catch(function (error) {
            console.log(error);
        });

        });
        db.Article.find({})
            .then(function(all) {
            res.render("scrape", {dbArticle: all});
            })
            .catch(function (error) {
                console.log(error);
            });
    });
});

app.get("/saved", function (req, res) {

    db.Article.find({saved: true})
    .then(function (dbSaved) {
      res.render("saved", {dbSaved: dbSaved});
    })
    .catch(function (error) {
    console.log(error);
    });
});

//article grab, notes
app.get("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate(
      {_id: req.params.id},
      {$set: {saved: true}})
      .catch(function (err) {
        res.json(err);
    });
});
app.get("/remove/:id", function (req, res) {
    db.Article.remove(
      {_id: req.params.id})
      .catch(function (err) {
        res.json(err);
    });
});


//start the server listener
app.listen(PORT, function() {
    console.log("App listening on port" + PORT);
});
