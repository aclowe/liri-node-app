// required to pull personal keys from local .env file
require("dotenv").config();

// required to read random.txt file
var fs = require("fs");

// required to read keys.js file
var keys = require("./keys.js");

// requried to request info from OMDB and Bands In Town APIs
var request = require("request");

// required to import node-spotify-api files
var Spotify = require('node-spotify-api');

// required to convert dates using moment.js
var moment = require('moment');

// required to retrieve Spotify/OMDB/Bands in Town keys from keys.js file
var spotify = new Spotify(keys.spotify);

// take in command line arguments
var userCmd = process.argv[2];

// Allow the user to input a artist name/song name/movie title and create an empty string for holding this title
var nodeArgs = process.argv;
var userInput = "";
var title = "";

// Capture all of the words in the title
for (var i = 3; i < nodeArgs.length; i++) {

    // original user input, separated by spaces will be used to report info back to the user in the log.txt file and console
    userInput = (title + " " + nodeArgs[i]).replace("-", "");
  
    // user input (title) with dashes are needed for all APIs except for bands-in-town). This will be modified only when calling for the bands-in-town API).
    title = title + "-" + nodeArgs[i];
}

function concertThis(){
    request("https://rest.bandsintown.com/artists/" + titleNoSpaces + "/events?app_id=codingbootcamp", function(error, response, data) {
        // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

        //var to hold bands-in-town API response
        var bITInfo = JSON.parse(data);
        var venueInfo = bITInfo[0].venue;
        var venueName = venueInfo.name;
        var venueLocation = venueInfo.city + "," + venueInfo.region + "," + venueInfo.country;

        // var to convert date to MM/DD/YYYY format using moment.js
        var convertedDate = moment(bITInfo[0].datetime, "YYYY-MM-DD[T]HH:mm:ss").format("MM/DD/YY");

        console.log("---------------------");
        console.log("User Input: " + userInput);
        console.log("Venue Name: " + venueName);
        console.log("Venue Location: " + venueLocation);
        console.log("Concert Date: " + convertedDate);
        console.log("---------------------");

        // BONUS: update log.txt file
        fs.appendFile('log.txt', "\n" + "CONCERT THIS REQUEST: " + "Search Term: " + userInput + " // " + "Venue Name: " + venueName + " // " + "Location: " + venueLocation + " // " + "Date: " + convertedDate  + "\n", (err) => {  
            if (err) throw err;
            console.log("---------------------");
            console.log('log.txt updated');
            console.log("---------------------");
        });
    }
        
    else {
        console.log("User Input: " + userInput);
        console.log("error: " + error);
        console.log("---------------------");

    }
});
}

function spotifyThis(qry){
spotify.search({ type: 'track', query: titleNoSpaces }, function(err, data) {
        if (err) {
        
        console.log("---------------------");
        console.log("User Input: " + userInput);
        console.log('Error occurred: ' + err);
        console.log("---------------------");
        return
        }
       
        //var to hold spotify API response
        var spotifyInfo = data.tracks.items;
        var artists = spotifyInfo[0].artists[0].name;
        var songsName = spotifyInfo[0].name;
        var previewLink = spotifyInfo[0].preview_url;
        var albumName = spotifyInfo[0].album.name;

        console.log("---------------------");
        console.log("User Input: " + userInput);
        console.log("Artist(s): " + artists);
        console.log("Song's Name: " + songsName);
        console.log("Preview Link: " + previewLink);
        console.log("Album Name: " + albumName);
        console.log("---------------------");
        
        // BONUS: update log.txt file
        fs.appendFile('log.txt', "\n" + "SPOTIFY-THIS-SONG REQUEST : " + "Search Term: " + userInput + " // " + "Artist(s): " + artists + " // " + "Song's Name: " + songsName + " // " + "Preview Link: " + previewLink + " " + "Album Name: " + albumName + "\n", (err) => {  
            if (err) throw err;
            console.log('log.txt updated');
            console.log("---------------------");
        });
      });
    spotify
}

function movieThis(){

    request("https://www.omdbapi.com/?apikey=trilogy&t=" + title, function(error, response, data) {
            // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

        //var to hold OMBD API response
            oMDBInfo = JSON.parse(data);
            var title = oMDBInfo.Title;
            var year = oMDBInfo.Year;
            var iMDBRating = oMDBInfo.Ratings[0].Value;
            var rotTomRating = oMDBInfo.Ratings[1].Value;
            var country = oMDBInfo.Country;
            var language = oMDBInfo.Language;
            var plot = oMDBInfo.Plot;
            var actors = oMDBInfo.Actors;

            console.log("---------------------");
            console.log("User Input: " + userInput);
            console.log("Title: " + title);
            console.log("Year: " + year);
            console.log("IMDB Rating: " + iMDBRating);
            console.log("Rotten Tomatoes Rating: " + rotTomRating);
            console.log("Country of Production: " + country);
            console.log("Language: " + language);
            console.log("Plot: " + plot);
            console.log("Actors: " + actors);
            console.log("---------------------");

            // BONUS: update log.txt file
            fs.appendFile('log.txt', "\n" + "MOVIE-THIS REQUEST: " +  "Search Term: " + userInput + " // " + "Title: " + title + " // " + "Year: " + year + " // " + "IMDB Rating: " + iMDBRating + " // " + "Rotten Tomoatoes Rating: " + rotTomRating + " " + "Country of Production: " + country + " " + "Language: " + language + " // " + "Plot: " + plot + " // " + "Actors: " + actors + "\n", (err) => {  
            if (err) throw err;
            console.log('log.txt updated');
            console.log("---------------------");
        });
        }
            
        else {
            console.log("---------------------");
            console.log("User Input: " + userInput);
            console.log("error: " + err);
            console.log("---------------------");

        }
    });
}

function doWhatItSays(){
    // pull the "userCmd" and "title" listed in the random.txt file, then run the spotifyThis function with them
    fs.readFile("random.txt", "UTF-8", function(error, data){
        var splitRead = data.split(',');
        userCmd = splitRead[0];
        titleNoSpaces = splitRead[1];
        spotifyThis(title); spotifyThis(title);
    });
   
}

// switch statement used to read the userCmd and determine which function to run
switch (userCmd) {
    case "concert-this":
    // bands-in-town API does not allow dashes in the search string (only spaces or no spaces). This replaces removes all dashes in var title.
    var titleNoSpaces = title.replace(/-/g, "");
    concertThis();
    break;
    
    case "spotify-this-song":
     // spotify API does not allow dashes in the search string (only spaces or no spaces). This replaces removes all dashes in var title.
    var titleNoSpaces = title.replace(/-/g, "");
    if (title === "" ) {
        titleNoSpaces = "The Sign Ace of Base"
        }
    spotifyThis(title)
      break;
    
    case "movie-this":
    if (title === "" ) {
        title = "Mr. Nobody"
        }
    movieThis();
      break;

    case "do-what-it-says":
    doWhatItSays();
      break;
    }