require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);
var actionRequest = process.argv[2];

switch(actionRequest) {
    case "concert-this":
    var dataRequest = "";

    for (let i = 3; i < process.argv.length; i++) {
        dataRequest += process.argv[i];
    }
    concertThis(dataRequest);
}

function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (response) {
        var concertStuff = response.data;

        for (let ii = 0; ii < concertStuff; ii++) {
            console.log(concertStuff[ii].venue);
        }
    });
}