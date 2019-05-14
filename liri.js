require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
const fs = require("fs");
var spotify = new Spotify(keys.spotify);

// Valid commands
const commandsList = ["concert-this", "movie-this", "spotify-this-song", "do-what-it-says"];
const commandsInstruct = ["\t<artist/band name>", "\t<title of movie>", "\t<song title and artist name>", ""];

var actionRequest = process.argv[2];

// Build full strings from process.argv input
function fixRequest(defaultVal) {
    if (process.argv.length < 4) { return defaultVal; }
    else {
        var strBuilder = [];

        for (let i = 3; i < process.argv.length; i++) {
            strBuilder.push(process.argv[i]);
        }
        console.log(strBuilder);
        return strBuilder;
    }
}

// Bands In Town API information
function concertThis(request) {
    if (request === false) {
        console.log("You need to supply an artist name.");
    }
    else {
        axios.get("https://rest.bandsintown.com/artists/" + request.join(" ") + "/events?app_id=codingbootcamp").then(function (response) {
            var concertStuff = response.data;

            for (let ii = 0; ii < concertStuff.length; ii++) {
                console.log("\nVenue: " + concertStuff[ii].venue.name);
                console.log("City, Country: " + concertStuff[ii].venue.city + ", " + concertStuff[ii].venue.country);
                console.log("Date: " + moment(concertStuff[ii].datetime).format("MM/DD/YYYY"));
            }
        });
    }
}

// OMDB API information
function movieThis(request) {
    axios.get("http://www.omdbapi.com/?t=" + request.join(" ") + "&y=&plot=short&apikey=trilogy").then(function (response) {
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

// Spotify song API information
function spotifyThis(request) {

    spotify.search({ type: "track", query: request.join(" "), limit: 10 }, function (error, response) {
        if (error) {
            return console.log(error);
        }

        spotifyDisplay(response.tracks.items[0]);
    });
}

function spotifyDisplay(data) {
    var output = [
        "Artist(s): ",
        "Song Title: ",
        "Preview: ",
        "Album Title: "
    ]

    var outputTemp = "";

    // Select artists
    outputTemp = output[0];
    data.artists.forEach(function (artist) {
        outputTemp += artist.name;
    });
    output[0] = outputTemp;

    // Select song title
    outputTemp = output[1];
    outputTemp += data.name;
    output[1] = outputTemp;

    // Select preview link
    outputTemp = output[2];
    outputTemp += data.preview_url;
    output[2] = outputTemp;

    // Select album title
    outputTemp = output[3];
    outputTemp += data.album.name;
    output[3] = outputTemp;

    output.forEach(function (info) {
        console.log(info);
    })
}

// Read action request input
switch (actionRequest) {
    case commandsList[0]:
        concertThis(fixRequest(false));
        break;

    case commandsList[1]:
        movieThis(fixRequest(["Mr. Nobody"]));
        break;

    case commandsList[2]:
        spotifyThis(fixRequest(["The Sign", "Ace of Base"]));
        break;

    default:
        console.log("Invalid command. Enter one of the following commands on startup:");

        for (let i = 0; i < commandsList.length; i++) {
            console.log(commandsList[i] + commandsInstruct[i]);
        }

        break;
}