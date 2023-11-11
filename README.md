# WM-Weather-Dashboard

## Description ##

This Weather Dashboard was made to practice the use of third-party APIs and Bootstrap. I used the [5 Day Weather Forecast](https://openweathermap.org/forecast5) to retrieve weather data for the city's that the user searched for. 

## Credits ## 

Initially, my code was throwing all sorts of errors because I failed to realize that the getWeather call relied on the directGeocode call and I had omitted use of an async function and the await keyword. I had to consult ChatGPT to realize this error and then I referenced [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) to fix it.

I had a tutoring session with Mila Hose on 11/11/2023. Mila helped me with getting the getWeather function to work based on input city name rather than relying on the directGeocode function. Mila also instructed me to use camelCasing wherever possible so I am making an effort to do that in the variable names in the script.js. Mila also helped me to get the date and weather icon to display in the five day forecast with DOM manipulation. Mila helped me to write a renderButtons function so that each previously searched city can be clicked again and have the results display again that utilized localStorage within the directGeocode storage. Thanks Mila!


## Screenshots of Deployed Application ##


## Link to Deployed Application ##
[William's Weather Dashboard](https://wmason1997.github.io/WM-Weather-Dashboard/)