# liri-node-app

LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters (a "command" and "search string") and returns data in the terminal and in the log.txt file as follows:

Enter the command "concert-this" and the name of an artist. LIRI will search the Bands In Town API and return:
  - Name of the venue
  - Venue location
  - Date of the Event (use moment to format this as "MM/DD/YYYY")
  - EX. node liri.js concert-this drake

Enter the command "spotify-this-song" and the name of a song. LIRI will use the node-spotify-api to return:
  - Artist(s)
  - Title
  - Song preview link
  - Album
  - NOTE: User must proivde a Spotify API Key and Secret in a .env file in order to use this feature
  - NOTE: If no song is provided, LIRI will default to "The Sign" by Ace of Base
  - EX. node liri.js spotify-this-song all of it

Enter the command "movie-this" and the name of a movie. LIRI will search the OMDB API and return:
   - Title
   - Year
   - IMDB Rating
   - Rotten Tomatoes Rating
   - Country of Production
   - Language
   - Plot
   - Actors
   - NOTE: If no movie is provided, LIRI will search for "Mr. Nobody."
   - EX. node liri.js movie-this jurassic park 

Enter the command "do-what-it-says." LIRI will will run spotify-this-song for "I Want it That Way," using the fs node package random.txt.
  - EX. node liri.js do-what-it-says
