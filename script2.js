var APIKey = "00cae84c06c0ac5953b157e62ece3d01";
var submitButton = document.getElementById('search-button');
var sanDiegoLat = 32.715736;
var sanDiegoLon = -117.161087;

// var userCityInput = document.getElementById("search-button");
// userCityInput.addEventListener("click", function (event) {
//     // feed this to the functions
// }
// )

// Direct geocoding
async function directGeocode(cityName) {
    var searchURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + APIKey;

    try {
        const response = await fetch(searchURL);
        const data = await response.json();

        console.log(data);
        console.log(data[0].lat);
        console.log(data[0].lon);

        return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Usage of directGeocode with async/await
async function getWeatherForCity(cityName) {
    const coordinates = await directGeocode(cityName);

    if (coordinates) {
        getWeather(coordinates.lat, coordinates.lon);
    }
}

getWeatherForCity('Seattle'); // Call this function to get the 5-day weather forecast for Seattle

function getWeather(inputLat, inputLon) {
    // fetch request gets a 5-day weather forecast in 3-hour increments from OpenWeatherMap API
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + inputLat + '&lon=' + inputLon + '&appid=' + APIKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

// Usage of directGeocode with async/await
async function getWeatherForCoordinates(cityName) {
    const temporaryCoordinates = await directGeocode(cityName);

    if (temporaryCoordinates) {
        await getWeather(temporaryCoordinates.lat, temporaryCoordinates.lon);
    }
}

getWeatherForCoordinates();