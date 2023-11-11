// Consult https://openweathermap.org/forecast5 and https://openweathermap.org/api/geocoding-api for the city search (direct geocoding)

var APIKey = "00cae84c06c0ac5953b157e62ece3d01";
var sanDiegoLat = 32.715736;
var sanDiegoLon = -117.161087;

var submitButton = document.getElementById('search-button');
var inputCity = document.getElementById('user-input-city');

var immediate_weather_placeholder = document.getElementById("immediate-weather");
var searchedCities = document.getElementById('searched-cities');

var fiveday_forecast_placeholder = document.getElementById("five-day-forecast");
var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
cityHistory.forEach(renderButtons);

function renderButtons(city){
    var button = document.createElement('button');
    button.value = city;
    button.textContent = city;
    button.addEventListener("click", function() { 
        directGeocode(city);
    });
    searchedCities.append(button);
};

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    var searchedCity = inputCity.value.trim();

    directGeocode(searchedCity)
        .then(function (coordinates) {
            if (coordinates) {
                getWeather(coordinates.lat, coordinates.lon);
            }
        });
    
});


// Direct geocoding
async function directGeocode(cityName) {
    //var searchURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + APIKey;
    var searchURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=' + APIKey;
    immediate_weather_placeholder.innerHTML = "";
    try {
        const response = await fetch(searchURL);
        const data = await response.json();
        console.log(data);
        if (!cityHistory.includes(data.name)) {
            cityHistory.push(data.name);
            localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
            renderButtons(data.name);
        }

        // Append to current weather section
        const city = document.createElement("h1");
        city.textContent = data.name;
        immediate_weather_placeholder.append(city);

        // Append today's date
        const todayDate = document.createElement("p");
        todayDate.textContent = dayjs().format('YYYY-MM-DD');
        immediate_weather_placeholder.append(todayDate);

        // const todayDate = document.createElement("p");
        // todayDate.textContent = data[0].dt_txt.slice(0,10);
        // immediate_weather_placeholder.append(todayDate);

        // Append date
        // const today = document.createElement("p");
        // today.textContent = data.dt_txt.slice(0,10);
        // immediate_weather_placeholder.append(today);

        // const date = document.createElement("h2");
        // date.textContent = day.dt_txt.slice(0,10);
        // fiveday_forecast_placeholder.append(date);

        // Append weather icons
        const icon = document.createElement('img');
        icon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        immediate_weather_placeholder.append(icon);

        // temp
        const currentTemperature = document.createElement('p');
        currentTemperature.textContent = data.main.temp + " °F";
        immediate_weather_placeholder.append(currentTemperature);
        

        // wind
        const currentWind = document.createElement('p');
        currentWind.textContent = data.wind.speed + " MPH";
        immediate_weather_placeholder.append(currentWind);

        // humidity
        const currentHumidity = document.createElement('p');
        currentHumidity.textContent = data.main.humidity + "%";
        immediate_weather_placeholder.append(currentHumidity);


        getWeather(cityName);

    } catch (error) {
            console.error('Error:', error);
            return null;
    }
}

// directGeocode('Seattle'); // gets lat and long of Seattle


function getWeather(cityName) {
    // fetch request gets a 5 day weather forecast in 3-hour increments from OpenWeatherMap API
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&appid=' + APIKey;
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            console.log(isolateAfternoons(data));
            const response = isolateAfternoons(data);
            fiveday_forecast_placeholder.innerHTML =""; // Clear existing HTML fiveday_forecast_placeholder so that this does not turn into a growing chain of weather info
            response.forEach(function(day) { 
                // date
                const date = document.createElement("h2");
                date.textContent = day.dt_txt.slice(0,10); //.format('MM/DD/YYYY');
                fiveday_forecast_placeholder.append(date);
                
                // icon
                const icon = document.createElement('img');
                icon.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
                fiveday_forecast_placeholder.append(icon);

                // temperature
                const temperature = document.createElement('p');
                temperature.textContent = day.main.temp + " °F";
                fiveday_forecast_placeholder.append(temperature);
                
                // wind speed
                const windSpeed = document.createElement('p');
                windSpeed.textContent = day.wind.speed + " MPH";
                fiveday_forecast_placeholder.append(windSpeed);

                // humidity etc.
                const humidity = document.createElement('p');
                humidity.textContent = day.main.humidity + "%";
                fiveday_forecast_placeholder.append(humidity);
            })
        });
}


// Filter for the afternoon information
function isolateAfternoons(weatherData) {
    const earlyAfterNoon = 13;
    const lateAfterNoon = 17;

    const afternoonData = weatherData.list.filter(item => {
        const timestamp = item.dt * 1000; // Convert to milliseconds
        const date = new Date(timestamp);
        const hour = date.getHours();

        return hour > earlyAfterNoon && hour < lateAfterNoon;
    });

    return afternoonData;
}



