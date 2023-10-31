function display5DayWeatherData(data) {
    var weatherContainer = document.getElementById('weather-container');

    weatherContainer.innerHTML = ''; // Clear previous data

    if (data) {
        var forecastList = data.list; // Get the full list of weather data

        var dailyDataArray = [];
        console.log(dailyDataArray);

        // Go through the weather data and filter to get one data point per day
        forecastList.forEach((dayData) => {
            var date = new Date(dayData.dt * 1000);
            date.setHours(0, 0, 0, 0);

            var existingDayData = dailyDataArray.find((dailyData) => {
                return dailyData.date.getTime() === date.getTime();
            });

            if (!existingDayData) {
                dailyDataArray.push({
                    date: date,
                    temperature: dayData.main.temp,
                    weatherDescription: dayData.weather[0].description,
                    windSpeed: dayData.wind.speed,
                    humidity: dayData.main.humidity,
                    icon: dayData.weather[0].icon,
                });
            }
        });

        dailyDataArray.slice(0, 5).forEach((dailyData) => {
            var dayContainer = document.createElement('div');
            dayContainer.classList.add('day-container');

            var dateElement = document.createElement('p');
            dateElement.textContent = `Date: ${dailyData.date.toDateString()}`;
            dayContainer.appendChild(dateElement);

            var weatherDescriptionElement = document.createElement('p');
            weatherDescriptionElement.textContent = `Weather: ${dailyData.weatherDescription}`;
            dayContainer.appendChild(weatherDescriptionElement);

            var temperatureElement = document.createElement('p');
            temperatureElement.textContent = `Temperature: ${Math.round(dailyData.temperature - 273.15)}°C`;
            dayContainer.appendChild(temperatureElement);

            var windSpeedElement = document.createElement('p');
            windSpeedElement.textContent = `Wind Speed: ${dailyData.windSpeed} m/s`;
            dayContainer.appendChild(windSpeedElement);

            var humidityElement = document.createElement('p');
            humidityElement.textContent = `Humidity: ${dailyData.humidity}%`;
            dayContainer.appendChild(humidityElement);

            var iconElement = document.createElement('img');
            iconElement.src = `http://openweathermap.org/img/wn/${dailyData.icon}.png`;
            dayContainer.appendChild(iconElement);

            weatherContainer.appendChild(dayContainer);
        });
    } else {
        var errorMessage = document.createElement('p');
        errorMessage.textContent = 'No 5-day weather forecast data found.';
        weatherContainer.appendChild(errorMessage);
    }
}
function saveSearch(cityName) {
    var recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches.push(cityName);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
}

function displayRecentSearches() {
    var recentSearchList = document.getElementById('recent-search-list');
    recentSearchList.innerHTML = '';

    var recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    recentSearches.forEach((search) => {
        var listItem = document.createElement('li');
        listItem.textContent = search;

        listItem.addEventListener('click', function () {
        
            var storedWeatherData = JSON.parse(localStorage.getItem(search));

            if (storedWeatherData) {
                display5DayWeatherData(storedWeatherData);
            } else {
                // If data is not found, this message will be displayed
                console.log('Weather data not found for this search.');
            }
        });

        recentSearchList.appendChild(listItem);
    });
}
var storedWeatherData = JSON.parse(localStorage.getItem('5DayWeatherData'));
display5DayWeatherData(storedWeatherData);

var cityForm = document.getElementById('city-form');
cityForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var cityNameInput = document.getElementById('city-name');
    var cityName = cityNameInput.value;

    fetch5DayWeatherForecast(cityName);
});

// Fetch 5-day weather forecast data from OpenWeatherMap API
    function fetch5DayWeatherForecast(cityName) {
        var apiKey = '902b7fbf828e8bf7fbbc5d053cb56e49';
        var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    
        fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Save the search term and data to local storage
            saveSearch(cityName, data);

            // Display the weather data and recent searches
            display5DayWeatherData(data);
            displayRecentSearches();
        })
        .catch((error) => {
            console.error('Error fetching 5-day weather forecast data:', error);
        });
    }
// Display 5-day weather forecast data from local storage on page load
var storedWeatherData = JSON.parse(localStorage.getItem('5DayWeatherData'));
display5DayWeatherData(storedWeatherData);

// Display recent weather searches
displayRecentSearches();


    
    
    

