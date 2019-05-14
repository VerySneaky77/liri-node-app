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
const commandsDefault = [false, "Mr. Nobody", "The Sign Ace of Base"];

// Isolate desired request and target
var actionRequest = process.argv.slice(2);

processRequest();

function processRequest() {
    // Process valid requests
    switch (actionRequest[0]) {
        case commandsList[0]:
            concertThis(fixRequest(commandsDefault[0]));
            break;

        case commandsList[1]:
            movieThis(fixRequest(commandsDefault[1]));
            break;

        case commandsList[2]:
            spotifyThis(fixRequest(commandsDefault[2]));
            break;

        case commandsList[3]:
            fs.readFile("./random.txt", "utf8", function (error, doRequest) {
                if (error) { return console.log(error); }
                actionRequest = doRequest.split(",");
                processRequest();
            });
            break;

        // Return special message on invalid requests
        default:
            console.log("Invalid command. Enter one of the following commands on startup:");

            for (let i = 0; i < commandsList.length; i++) {
                console.log(commandsList[i] + commandsInstruct[i]);
            }
            break;
    }
}

function fixRequest(defaultVal) {
    // Return default on blank targets
    if (actionRequest.length < 2) { return defaultVal; }
    // Build full strings from input
    else { return actionRequest.slice(1).join(" "); }
}

// Bands In Town API information
function concertThis(request) {
    if (request === false) { console.log("You need to supply an artist name."); }

    else {
        axios.get("https://rest.bandsintown.com/artists/" + request + "/events?app_id=codingbootcamp").then(function (response) {
            var data = response.data;
            var bandData = [];

            for (let ii = 0; ii < data.length; ii++) {
                bandData.push("Venue: " + data[ii].venue.name);
                bandData.push("City, Country: " + data[ii].venue.city + ", " + data[ii].venue.country);
                bandData.push("Date: " + moment(data[ii].datetime).format("MM/DD/YYYY"));
            }

            for (let i = 0; i < bandData.length; i++) {
                console.log(bandData[i]);
                addActionLog(bandData[i] + "\n");
            }
            addActionLog("\n");
        });
    }
}

// OMDB API information
function movieThis(request) {
    console.log(request);
    axios.get("http://www.omdbapi.com/?t=" + request + "&y=&plot=short&apikey=trilogy").then(function (response) {
        var movieStuff = response.data;
        var movieData = [];

        movieData.push("Title: " + movieStuff.Title);
        movieData.push("Release Year: " + movieStuff.Year);
        movieData.push("Country of Production: " + movieStuff.Country);
        movieData.push("Language: " + movieStuff.Language);
        movieData.push("Plot Synopsis: " + movieStuff.Plot);
        movieData.push("IMDB Rating: " + movieStuff.imdbRating);
        movieData.push(movieStuff.Ratings[1].Source + " Rating: " + movieStuff.Ratings[1].Value);

        movieData.forEach(function (data) {
            console.log(data);
            addActionLog(data + "\n");
        })
    });
}

// Spotify song API information
function spotifyThis(request) {
    spotify.search({ type: "track", query: request, limit: 10 }, function (error, response) {
        if (error) { return console.log(error); }

        var data = response.tracks.items[0];
        var output = [];
        var outputTemp = "";

        // Select artists
        for (let i = 0; i < data.artists.length; i++) {
            if ((i + 1) < data.artists.length) { outputTemp += data.artists[i].name + ", "; }
            else { outputTemp += data.artists[i].name; }
        }
        // Collect data
        output.push("Artist(s): " + outputTemp);
        output.push("Song Title: " + data.name);
        output.push("Preview: " + data.preview_url);
        output.push("Album Title: " + data.album.name);

        // Display info
        output.forEach(function (info) {
            console.log(info);
            addActionLog(info + "\n");
        })
    });
}

// Log successful actions
function addActionLog(data) {
    fs.appendFile("./log.txt", data, function (addError) {
        if (addError) {
            fs.writeFile("./log.txt", data, function (writeError) {
                if (writeError) {
                    return console.log(writeError)
                }

            })
            return console.log(error);
        }
    });
}