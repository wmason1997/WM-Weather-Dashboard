// Consult https://openweathermap.org/forecast5 and https://openweathermap.org/api/geocoding-api for the city search (direct geocoding)

var APIKey = "00cae84c06c0ac5953b157e62ece3d01"; // my API key

var submitButton = document.getElementById('search-button');
var inputCity = document.getElementById('user-input-city');

var immediateWeatherPlaceholder = document.getElementById("immediate-weather");
var searchedCities = document.getElementById('searched-cities');

var fivedayForecastPlaceholder = document.getElementById("five-day-forecast");
var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
cityHistory.forEach(renderButtons);

function renderButtons(city){
    var button = document.createElement('button');
    button.classList.add("searchedCitiesButtons");
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
    var searchURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + APIKey;
    immediateWeatherPlaceholder.innerHTML = "";
    try {
        const response = await fetch(searchURL);
        const data = await response.json();

        if (data.length > 0) {
            const coordinates = {
                lat: data[0].lat,
                lon: data[0].lon
            };
        

        console.log(data);
        if (!cityHistory.includes(data.name)) {
            cityHistory.push(data.name);
            localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
            renderButtons(data.name);
        }

        // Append to current weather section
        const city = document.createElement("h1");
        city.textContent = data.name;
        immediateWeatherPlaceholder.append(city);

        // Append today's date
        const todayDate = document.createElement("p");
        todayDate.textContent = dayjs().format('MM/DD/YYYY');
        immediateWeatherPlaceholder.append(todayDate);

        // Append weather icons
        // const icon = document.createElement('img');
        // icon.src = `https://openweathermap.org/img/w/${data.weather.icon}.png`;
        // immediateWeatherPlaceholder.append(icon);

        // // temp
        // const currentTemperature = document.createElement('p');
        // currentTemperature.textContent = "Temp: " + data.main.temp + " °F";
        // immediateWeatherPlaceholder.append(currentTemperature);

        // // wind
        // const currentWind = document.createElement('p');
        // currentWind.textContent = "Wind: " + data.wind.speed + " MPH";
        // immediateWeatherPlaceholder.append(currentWind);

        // // humidity
        // const currentHumidity = document.createElement('p');
        // currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
        // immediateWeatherPlaceholder.append(currentHumidity);

        // immediateWeatherPlaceholder.classList.add("immediateBorder");


        getWeather(directGeocode(cityName));

            return coordinates;
        } else {
            console.error('City not found');
            return null;
        }
    } catch (error) {
            console.error('Error:', error);
            return null;
    }
}

function getWeather(inputLat, inputLon) {
    // fetch request gets a 5 day weather forecast in 3-hour increments from OpenWeatherMap API
    // var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&appid=' + APIKey;
    // https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    // var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+inputLat+'&lon=' + inputLon + '&appid=' + APIKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            console.log(isolateAfternoons(data));
            const response = isolateAfternoons(data);
            fivedayForecastPlaceholder.innerHTML =""; // Clear existing HTML fivedayForecastPlaceholder so that this does not turn into a growing chain of weather info
            response.forEach(function(day) { 

                const verticalCard = document.createElement("div");

                // date
                const date = document.createElement("h2");
                date.textContent = dayjs(day.dt_txt.slice(0,10)).format('MM/DD/YYYY'); // Used dayjs to get the format to match the example picture
                verticalCard.append(date);
                
                // icon
                const icon = document.createElement('img');
                icon.src = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
                verticalCard.append(icon);

                // temperature
                const temperature = document.createElement('p');
                temperature.textContent = "Temp: " + day.main.temp + " °F";
                verticalCard.append(temperature);
                
                // wind speed
                const windSpeed = document.createElement('p');
                windSpeed.textContent = "Wind: " + day.wind.speed + " MPH";
                verticalCard.append(windSpeed);

                // humidity etc.
                const humidity = document.createElement('p');
                humidity.textContent = "Humidity: " + day.main.humidity + "%";
                verticalCard.append(humidity);

                fivedayForecastPlaceholder.append(verticalCard);

            })
        });
}

// Filter for the afternoon information
function isolateAfternoons(weatherData) {
    //const today = new Date();

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