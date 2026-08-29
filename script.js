const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherDescription =
    document.getElementById("weatherDescription");


/* Hide weather card when page opens */

weatherCard.style.display = "none";


/* Search button */

button.addEventListener("click", searchWeather);


/* Press Enter to search */

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchWeather();
    }

});


/* Main weather function */

async function searchWeather() {

    const city = input.value.trim();

    /* Clear previous messages */

    error.textContent = "";
    loading.textContent = "";

    if (!city) {

        error.textContent = "Please enter a city name.";

        weatherCard.style.display = "none";

        return;
    }


    loading.textContent = "Loading weather...";


    try {

        let location;


        /*
        Special case for Mangalore.

        This prevents the API from selecting
        "Mangalore Tota" or another place.
        */

        if (city.toLowerCase() === "mangalore") {

            location = {
                name: "Mangalore",
                admin1: "Karnataka",
                country: "India",
                latitude: 12.9141,
                longitude: 74.8560
            };

        } else {

            /*
            Search for other cities using
            Open-Meteo Geocoding API.
            */

            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`
            );


            if (!geoResponse.ok) {

                throw new Error(
                    "Unable to connect to location service."
                );

            }


            const geoData = await geoResponse.json();


            if (
                !geoData.results ||
                geoData.results.length === 0
            ) {

                throw new Error("City not found.");

            }


            /*
            Prefer an exact city-name match.
            */

            location = geoData.results.find(
                place =>
                    place.name &&
                    place.name.toLowerCase() === city.toLowerCase()
            );


            /*
            If exact match is not available,
            use the first result.
            */

            if (!location) {

                location = geoData.results[0];

            }

        }


        /*
        Get latitude and longitude
        */

        const latitude = location.latitude;
        const longitude = location.longitude;


        /*
        Get weather data
        */

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to get weather data."
            );

        }


        const weatherData = await weatherResponse.json();


        const current = weatherData.current;


        /*
        Display city name
        */

        let displayName = location.name;

        if (location.admin1) {

            displayName += `, ${location.admin1}`;

        }

        if (location.country) {

            displayName += `, ${location.country}`;

        }


        cityName.textContent = displayName;


        /*
        Display weather values

        IMPORTANT:
        Do NOT add °C, %, or km/h here
        because HTML already contains them.
        */

        temperature.textContent =
            current.temperature_2m;

        humidity.textContent =
            current.relative_humidity_2m;

        windSpeed.textContent =
            current.wind_speed_10m;


        /*
        Weather description
        */

        weatherDescription.textContent =
            getWeatherDescription(
                current.weather_code
            );


        /*
        Show weather card
        */

        weatherCard.style.display = "block";


        loading.textContent = "";


    } catch (err) {

        loading.textContent = "";

        weatherCard.style.display = "none";

        error.textContent = err.message;

        console.error(err);

    }

}


/*
Convert weather code into
human-readable description
*/

function getWeatherDescription(code) {

    if (code === 0) {

        return "Clear sky";

    }

    if (code === 1) {

        return "Mainly clear";

    }

    if (code === 2) {

        return "Partly cloudy";

    }

    if (code === 3) {

        return "Overcast";

    }

    if (code >= 45 && code <= 48) {

        return "Foggy";

    }

    if (code >= 51 && code <= 57) {

        return "Drizzle";

    }

    if (code >= 61 && code <= 67) {

        return "Rain";

    }

    if (code >= 71 && code <= 77) {

        return "Snow";

    }

    if (code >= 80 && code <= 82) {

        return "Rain showers";

    }

    if (code >= 95 && code <= 99) {

        return "Thunderstorm";

    }

    return "Unknown";

}