// Consult https://openweathermap.org/forecast5 and https://openweathermap.org/api/geocoding-api for the city search (direct geocoding)

var APIKey = "00cae84c06c0ac5953b157e62ece3d01";
var submitButton = document.getElementById('search-button');
var sanDiegoLat = 32.715736;
var sanDiegoLon = -117.161087;

// Direct geocoding

function directGeocode(cityName) {
    var searchURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + APIKey;

    fetch(searchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            console.log(data[0].lat);
            console.log(data[0].lon);
            // console.log(coordinates.lat);
            // console.log(coordinates.lon);
            return [data[0].lat, data[0].lon];
        });
}

directGeocode('Seattle'); // gets lat and long of Seattle

function getWeather(inputLat, inputLon) {
    // fetch request gets a 5 day weather forecast in 3-hour increments from OpenWeatherMap API
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+inputLat+'&lon=' + inputLon + '&appid=' + APIKey;
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
        });
}

// getWeather();

//getWeather(directGeocode("Chicago"));

getWeather(sanDiegoLat, sanDiegoLon);

var temporaryCoordinates = directGeocode('Boston');

console.log(temporaryCoordinates);