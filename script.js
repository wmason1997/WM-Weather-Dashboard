// Consult https://openweathermap.org/forecast5 and https://openweathermap.org/api/geocoding-api for the city search (direct geocoding)

var APIKey = "00cae84c06c0ac5953b157e62ece3d01";
var submitButton = document.getElementById('search-button');
var sanDiegoLat = 32.715736;
var sanDiegoLon = -117.161087;

// Direct geocoding



// This might not be working simply because of incorrect coordinates. Try to get the direct geocoding working above first
function getWeather() {
    // fetch request gets a 5 day weather forecast in 3-hour increments from OpenWeatherMap API
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+sanDiegoLat+'&lon=' + sanDiegoLon + '&appid=' + APIKey;
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
        });
}

getWeather();