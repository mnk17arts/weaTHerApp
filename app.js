

// Selecting the elements from the DOM
const messageElement = document.querySelector(".message");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const datetimeElement = document.querySelector(".datetime p");
const minmaxElement = document.querySelector(".min-max-temp p");
const windElement = document.querySelector(".wind-speed-visibility p");
const seagroundElement = document.querySelector(".sea-ground-level p");
const pressureElement = document.querySelector(".humidity-pressure p");
const sunriseElement = document.querySelector(".sunrise-sunset p");

const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0"; // API key

// storing the weather data

const weather = {
    temperature: {
        value: 18,
        unit: "celsius"
    },
    description: "few clouds",
    iconId: "02d",
    city: "London",
    country: "UK"
};

// set user's position
setPosition = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// show error when there is an issue with geolocation service
showError = (error) => {
    messageElement.style.display = "block";
    messageElement.innerHTML = `<p> ${error.message} </p>`;
}
// get user's location
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    messageElement.style.display = "block";
    messageElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


// get weather from API provider
getWeather = (latitude, longitude) => {

    console.log(latitude, longitude);

    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.datetime = data.dt;
            weather.minmax = "Min : " + Math.floor(data.main.temp_min- KELVIN) + " °C / Max : " + Math.floor(data.main.temp_max- KELVIN) + " °C";
            weather.wind = data.wind.speed + " m/s";
            weather.seaground = "Sea Level: "+ data.main.sea_level + " hPa  | Ground Level: " + data.main.grnd_level + " hPa";
            weather.pressure = data.main.pressure + " hPa";
            weather.sunrise = data.sys.sunrise;
            weather.sunset = data.sys.sunset;
            weather.humidity = data.main.humidity + " %";
            weather.visibility = data.visibility + " m";
        })
        .then(function(){
            displayWeather();
        });
}
// convert milliseconds to HH:MM AM/PM format
function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100),
        seconds = parseInt((duration/1000)%60),
        minutes = parseInt((duration/(1000*60))%60),
        hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes;
}
// Displaying the weather data
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    var date = new Date(weather.datetime * 1000);
    datetimeElement.innerHTML = date.toLocaleString();
    minmaxElement.innerHTML = weather.minmax;
    windElement.innerHTML = `Wind speed: ${weather.wind} | Visibility: ${weather.visibility}`;
    seagroundElement.innerHTML = weather.seaground;
    pressureElement.innerHTML = `Humidity: ${weather.humidity} | Pressure: ${weather.pressure}`;
    var sunrise = new Date(weather.sunrise*1000);
    var sunset = new Date(weather.sunset*1000);
    sunriseElement.innerHTML = `Sunrise: ${sunrise.toLocaleString().slice(9)} | Sunset: ${sunset.toLocaleString().slice(9)}`;
    
}

// Converting the temperature from celsius to fahrenheit
celsiusToFahrenheit = (temperature) => {
    return (temperature * 9/5) + 32;
}

// Converting the temperature from fahrenheit to celsius
fahrenheitToCelsius = (temperature) => {
    return (temperature - 32) * 5/9;
}


// When the user clicks on the temperature element
tempElement.addEventListener("click", () => {
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit === "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = "celsius"
    }
}
);

