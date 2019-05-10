require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);
var actionRequest = process.argv[2];
var request = fixRequest();

switch (actionRequest) {
    case "concert-this":

        concertThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    default:
        console.log("Invalid command. \nEnter one of the following commands on startup:\nconcert-this\n");
}

// Build full strings from process.argv input
function fixRequest() {
    var strBuilder = "";

    for (let i = 3; i < process.argv.length; i++) {
        strBuilder += process.argv[i];
    }
    return strBuilder;
}

// Bands In Town API information
function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + request + "/events?app_id=codingbootcamp").then(function (response) {
        var concertStuff = response.data;

        for (let ii = 0; ii < concertStuff.length; ii++) {
            console.log("\nVenue: " + concertStuff[ii].venue.name);
            console.log("City, Country: " + concertStuff[ii].venue.city + ", " + concertStuff[ii].venue.country);
            console.log("Date: " + moment(concertStuff[ii].datetime).format("MM/DD/YYYY"));
        }
    });
}

// OMDB API information
function movieThis() {
    axios.get("http://www.omdbapi.com/?t=" + request + "&y=&plot=short&apikey=trilogy").then(function (response) {
        var movieStuff = response.data;

        console.log("Title: " + movieStuff.Title);
        console.log("Release Year: " + movieStuff.Year);
        console.log("Country of Production: " + movieStuff.Country);
        console.log("Language: " + movieStuff.Language);
        console.log("Plot Synopsis: " + movieStuff.Plot);
        console.log("IMDB Rating: " + movieStuff.imdbRating);
        console.log(movieStuff.Ratings[1].Source + " Rating: " + movieStuff.Ratings[1].Value);
    });
}