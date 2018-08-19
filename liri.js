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
var title = "";

// Capture all of the words in the title
for (var i = 3; i < nodeArgs.length; i++) {

  // Build a string with the title, add a dash in between words (dashes are needed for all APIs except for bands-in-town). This will be modified only when calling for the bands-in-town API).
    title = title + "-" + nodeArgs[i];

}

function concertThis(){
    request("https://rest.bandsintown.com/artists/" + titleNoSpaces + "/events?app_id=codingbootcamp", function(error, response, data) {
        // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

        //var to hold bands-in-town API response
        var bITInfo = JSON.parse(data);

        var venueInfo = bITInfo[0].venue;
        console.log("Venue Name: " + venueInfo.name);
        console.log("Venue Location: " + venueInfo.city + "," + venueInfo.region + "," + venueInfo.country);
        // var to convert date to MM/DD/YYYY format using moent.js
        var convertedDate = moment(bITInfo[0].datetime, "YYYY-MM-DD[T]HH:mm:ss").format("MM/DD/YY");
        console.log("Concert Date: " + convertedDate);

        // BONUS: update log.txt file
        fs.appendFile('log.txt', "\n" + "CONCERT THIS REQUEST: " + "Search Term: " + title + " // " + "Venue Name: " + venueInfo.name + " // " + "Location: " + venueInfo.city + "," + venueInfo.region + "," + venueInfo.country + " // " + "Date: " + convertedDate  + "\n", (err) => {  
            if (err) throw err;
            console.log('log.txt updated');
        });
        console.log("---------------------");
    }
        
    else {
        console.log("error: " + error);
        console.log("---------------------");

    }
});
}

function spotifyThis(qry){
spotify.search({ type: 'track', query: titleNoSpaces }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
          console.log("---------------------");
        }
       
        //var to hold spotify API response
        var spotifyInfo = data.tracks.items;

        console.log("Artist(s): " + spotifyInfo[0].artists[0].name);
        console.log("Song's Name: " + spotifyInfo[0].name);
        console.log("Preview Link: " + spotifyInfo[0].preview_url);
        console.log("Album Name: " + spotifyInfo[0].album.name);
        
        // BONUS: update log.txt file
        fs.appendFile('log.txt', "\n" + "SPOTIFY-THIS-SONG REQUEST : " + "Search Term: " + title +  + "Artist(s): " + spotifyInfo[0].artists[0].name + " // " + "Song's Name: " + spotifyInfo[0].name + " // " + "Preview Link: " + spotifyInfo[0].preview_url + " " + "Album Name: " + spotifyInfo[0].album.name + "\n", (err) => {  
            if (err) throw err;
            console.log('log.txt updated');
        });
        console.log("---------------------");
      });
    spotify
}

function movieThis(){

    request("https://www.omdbapi.com/?apikey=trilogy&t=" + title, function(error, response, data) {
            // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

        //var to hold OMBD API response
            oMDBInfo = JSON.parse(data);

            console.log("Title: " + oMDBInfo.Title);
            console.log("Year: " + oMDBInfo.Year);
            console.log("IMDB Rating: " + oMDBInfo.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + oMDBInfo.Ratings[1].Value);
            console.log("Country of Production: " + oMDBInfo.Country);
            console.log("Language: " + oMDBInfo.Language);
            console.log("Plot: " + oMDBInfo.Plot);
            console.log("Actors: " + oMDBInfo.Actors);

            // BONUS: update log.txt file
            fs.appendFile('log.txt', "\n" + "MOVIE-THIS REQUEST:  " + "Title: : " + oMDBInfo.Title + " // " + "Year: " + oMDBInfo.Year + " // " + "IMDB Rating: " + oMDBInfo.Ratings[0].Value + " // " + "Rotten Tomoatoes Rating: " + oMDBInfo.Ratings[1].Value + " " + "Country of Production: " + oMDBInfo.Country + " " + "Language: " + oMDBInfo.Language + " // " + "Plot: " + oMDBInfo.Plot + " // " + "Actors: " + oMDBInfo.Actors + "\n", (err) => {  
            if (err) throw err;
            console.log('log.txt updated');
        });
        console.log("---------------------");
        }
            
        else {
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
    movieThis();
      break;

    case "do-what-it-says":
    doWhatItSays();
      break;
    }