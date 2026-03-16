// Get API key from OpenWeather API
const apiKey = "95fa9ecba354ea24ef4612889bc18172";

// Get city input field and get weather button
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");

// Get weather data section elements
const weatherWidget = document.getElementById("weather-widget");
const cityNameElement = document.getElementById("city-name");
const weatherDescriptionElement = document.getElementById("weather-description");
const tempElement = document.getElementById("temperature");

const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const weatherIconElement = document.getElementById("weather-icon");
const loadingSpinner = document.getElementById("loading-spinner");
const sidebar = document.getElementById('sidebar');

const unitToggle = document.getElementById("unit-toggle");

// Get chart elements
const barChartCanvas = document.getElementById("bar-chart");
const doughnutChartCanvas = document.getElementById("doughnut-chart");
const lineChartCanvas = document.getElementById("line-chart");

let barChart, doughnutChart, lineChart; // Declare chart variables

// Get weather forecast elements
const forecastContainer = document.getElementById("forecast-container");
const paginationContainer = document.getElementById("pagination-container");
let isCelsius = true; // By default, it's Celsius

let currentWeatherData = null; // Global variable for current weather data
let forecastData = []; // Global variable for 5-day forecast data


document.addEventListener('DOMContentLoaded', () => {

  setTimeout(() => {
    sidebar.classList.add('open');
    adjustContentMargins(); // Call the margin adjustment function here

  }, 100); // Small delay to ensure the animation is visible

  const currentWeatherData1 = JSON.parse(localStorage.getItem('currentWeather'));
  const forecastData1 = JSON.parse(localStorage.getItem('fiveDayForecast'));

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeatherForGeolocation, handleGeolocationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  if (currentWeatherData1) {
    displayCurrentWeather(currentWeatherData1);
  }
  if (forecastData1) {
    displayFiveDayForecastInCharts(forecastData1);
  }
});

function typeWriter(element, text, delay = 100) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, delay);
    }
  }
  typing();
}

// Call this function on page load
document.addEventListener('DOMContentLoaded', () => {
  const titleElement = document.querySelector('.logo-container h1');
  titleElement.innerHTML = ''; // Clear existing text
  typeWriter(titleElement, "Weather App"); // Type the title
});
function adjustContentMargins() {
  const mainContent = document.querySelector('.main-content');
  const weatherWidget = document.getElementById('weather-widget');
  const chartsContainer = document.getElementById('charts-container');
  
  if (sidebar.classList.contains('open')) {
 
    
  } else {
  }
}

async function fetchWeather(city) {
  if (!city) {
    alert("Please enter a valid city name.");
    return;
  }
  document.getElementById('loading-overlay').style.display = 'flex'; // Show overlay

  // Fetch current weather data
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const currentResponse = await fetch(currentWeatherUrl);
  
  if (!currentResponse.ok) {
    document.getElementById('loading-overlay').style.display = 'none'; // Hide overlay on error

    
    alert("City not found");
    return;
  }
  
  currentWeatherData = await currentResponse.json();
  console.log('Current weather data:', currentWeatherData);
  
  // Fetch 5-day weather forecast
  const lat = currentWeatherData.coord.lat;
  const lon = currentWeatherData.coord.lon;
  
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);
  
  if (!forecastResponse.ok) {
    document.getElementById('loading-overlay').style.display = 'none'; // Hide overlay on error
    return;
  }

  forecastData = await forecastResponse.json();
  console.log('5-day weather forecast data:', forecastData);

  localStorage.setItem('currentWeather', JSON.stringify(currentWeatherData));
  localStorage.setItem('fiveDayForecast', JSON.stringify(forecastData));

  document.getElementById('loading-overlay').style.display = 'none'; // Hide overlay once data is loaded


  displayCurrentWeather(currentWeatherData);
  displayFiveDayForecastInCharts(forecastData);
  
}

function showWeatherForGeolocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Fetch the current weather and 5-day forecast based on user's geolocation
  fetchWeatherByCoordinates(lat, lon);
}


// Handle geolocation error
function handleGeolocationError(error) {
  console.error("Geolocation error:", error.message);
  alert("Unable to retrieve your location.");
}


async function fetchWeatherByCoordinates(lat, lon) {
  document.getElementById('loading-overlay').style.display = 'flex'; // Show overlay


  // Fetch current weather
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const currentResponse = await fetch(currentWeatherUrl);

  if (!currentResponse.ok) {
    alert("Error fetching current weather data");
    document.getElementById('loading-overlay').style.display = 'none'; // Hide overlay on error
    return;
  }

  currentWeatherData = await currentResponse.json();
  
  // Fetch 5-day weather forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    alert("Error fetching forecast data");
    document.getElementById('loading-overlay').style.display = 'none'; // Hide overlay on error
    return;
  }

  forecastData = await forecastResponse.json();
  
  // Store fetched data in localStorage
  localStorage.setItem('currentWeather', JSON.stringify(currentWeatherData));
  localStorage.setItem('fiveDayForecast', JSON.stringify(forecastData));
  
  // Hide the loading spinner after data is loaded
  document.getElementById('loading-overlay').style.display = 'none'; // Hide overlay on error

  // Display the fetched data
  displayCurrentDateTime();

  displayCurrentWeather(currentWeatherData);
  displayFiveDayForecastInCharts(forecastData);
}

function displayCurrentDateTime() {
  const dateTimeElement = document.getElementById("date-time");
  const now = new Date();

  // Get the current day, date, and time
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedDateTime = now.toLocaleDateString('en-GB', options);

  // Set the content of the date-time element
  dateTimeElement.textContent = formattedDateTime;
}


// Function to display current weather data
function displayCurrentWeather(data) {
  if (cityNameElement) {
    cityNameElement.textContent = data.name;
  }
  if (weatherDescriptionElement) {
    weatherDescriptionElement.textContent = data.weather[0].description;
  }
  if (tempElement) {
    tempElement.textContent = `${data.main.temp} °C`;
  }
  if (humidityElement) {
    humidityElement.textContent = `${data.main.humidity}%`;
  }
  if (windSpeedElement) {
    windSpeedElement.textContent = `${data.wind.speed} km/h`;
  }
  if (weatherIconElement) {
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  if (weatherWidget) {
    const weatherCondition = data.weather[0].description.toLowerCase().replace(/\s/g, '-');
    weatherWidget.className = 'weather-widget'; // Ensure base class is added
    weatherWidget.classList.add(weatherCondition); // Add specific weather condition class
  }

  updateBackgroundImage(weatherDescriptionElement.textContent);

}

function updateBackgroundImage(weatherDescription) {
  console.log("Weather Description:", weatherDescription); // Debugging line
  const backgroundDiv = document.getElementById('background-blur');
  let bgImage;

  switch (weatherDescription.toLowerCase()) {
    case 'clear sky':
      bgImage = 'url("ClearSky.jpg")';
      break;
    case 'few clouds':
      bgImage = 'url("FewClouds.jpg")'; // Fixed extension to .jpg
      break;
    case 'scattered clouds':
      bgImage = 'url("ScatteredClouds.jpg")';
      break;
    case 'broken clouds':
      bgImage = 'url("BrokenClouds.jpg")'; // Fixed extension to .jpg
      break;
    case 'overcast clouds':
      bgImage = 'url("OverCastClouds.jpg")';
      break;
    case 'shower rain':
      bgImage = 'url("ShowerRain.jpg")';
      break;
    case 'drizzle':
    case 'light intensity drizzle':
    case 'heavy intensity drizzle':
    case 'light intensity drizzle rain':
    case 'drizzle rain':
    case 'heavy intensity drizzle rain':
    case 'shower drizzle':
    case 'heavy shower drizzle':
      bgImage = 'url("Drizzle.jpg")'; // All drizzle conditions use Drizzle.jpg
      break;
    case 'thunderstorm':
    case 'light thunderstorm':
    case 'heavy thunderstorm':
    case 'ragged thunderstorm':
    case 'thunderstorm with light drizzle':
    case 'thunderstorm with drizzle':
    case 'thunderstorm with heavy drizzle':
      bgImage = 'url("Thunderstorm.jpg")'; // All thunderstorm conditions use Thunderstorm.jpg
      break;
    case 'rain':
    case 'light rain':
    case 'moderate rain':
    case 'heavy intensity rain':
    case 'very heavy rain':
    case 'extreme rain':
    case 'freezing rain':
    case 'light intensity shower rain':
    case 'heavy intensity shower rain':
    case 'ragged shower rain':
      bgImage = 'url("RainImage.webp")'; // All rain conditions use RainImage.webp
      break;
    case 'snow':
    case 'light snow':
    case 'heavy snow':
    case 'sleet':
    case 'light shower sleet':
    case 'shower sleet':
    case 'light rain and snow':
    case 'rain and snow':
    case 'light shower snow':
    case 'shower snow':
    case 'heavy shower snow':
      bgImage = 'url("Snow.jpg")'; // All snow conditions use Snow.jpg
      break;
    case 'mist':
      bgImage = 'url("Mist.jpg")'; // Fixed extension to .jpg
      break;
    case 'smoke':
      bgImage = 'url("Smoke.jpg")';
      break;
    case 'haze':
      bgImage = 'url("Haze.webp")';
      break;
    case 'dust':
      bgImage = 'url("Dust.jpeg")';
      break;
    case 'fog':
      bgImage = 'url("Fog.webp")';
      break;
    case 'sand':
      bgImage = 'url("Sand.jpeg")';
      break;
    case 'squall':
      bgImage = 'url("Squall.jpeg")';
      break;
    case 'tornado':
      bgImage = 'url("Tornado.jpeg")';
      break;
    default:
      bgImage = 'url("OverCastClouds.jpg")'; // Default background
  }

  // Apply the background image and blur only to the background-blur div
  backgroundDiv.style.backgroundImage = bgImage;
}




// Function to display 5-day weather forecast in charts
function displayFiveDayForecastInCharts(data) {
  if (barChart) barChart.destroy();
  if (doughnutChart) doughnutChart.destroy();
  if (lineChart) barChart.destroy();

  const forecastData = data.list;
  const temperatures = [];
  const weatherConditions = [];
  const dates = [];

  // To store counts of weather conditions
  const conditionCounts = {};

  forecastData.forEach((day, index) => {
    const condition = day.weather[0].main;
    conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;

    if (index % 8 === 0) {
      temperatures.push(day.main.temp);
      const date = new Date(day.dt * 1000);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      dates.push(date.toLocaleDateString('en-US', options));
    }
  });

  // Create bar chart
  barChart = new Chart(barChartCanvas, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [{
        label: "Temperature",
        data: temperatures,
        backgroundColor: "rgba(245, 245, 245, 0.85)", // Off-white background
        borderColor: "rgba(10, 10, 40, 1)",

        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: "Temperature Forecast",
        fontColor: "white" // Title color
      },
      scales: {
        x: {
          ticks: {
            color: "white", // X-axis label color
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)" // Lighter grid line for X-axis
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "white", // Y-axis label color
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)" // Lighter grid line for Y-axis
          }
        }
      },
      animation: {
        delay: 600
      }
    }
  });

  // Doughnut Chart
  doughnutChart = new Chart(doughnutChartCanvas, {
    type: "doughnut",
    data: {
      labels: Object.keys(conditionCounts),
      datasets: [{
        label: "Weather Conditions",
        data: Object.values(conditionCounts),
        backgroundColor: [
          "rgba(245, 245, 245, 0.85)", // Off-white background
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: "Weather Conditions Over 5 Days",
        fontColor: "white" // Title color
      },
      animation: {
        delay: 600
      }
    }
  });

  // Create line chart
  lineChart = new Chart(lineChartCanvas, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Temperature",
        data: temperatures,
        backgroundColor: "rgba(245, 245, 245, 0.85)", // Off-white background
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: "Temperature Forecast",
        fontColor: "white" // Title color
      },
      scales: {
        x: {
          ticks: {
            color: "white", // X-axis label color
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)" // Lighter grid line for X-axis
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "white", // Y-axis label color
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)" // Lighter grid line for Y-axis
          }
        }
      },
      animation: {
        easing: "easeInOutQuart",
        duration: 1200
      }
    }
  });
}



getWeatherBtn.addEventListener('click', async () => {
  localStorage.removeItem('currentWeather');
  localStorage.removeItem('fiveDayForecast');

  const city = cityInput.value.trim();
  if (!city) {
    alert('Please enter a valid city name.');
    return;
  }

  await fetchWeather(city); // Fetch weather data and store in local storage
  displayCurrentWeather(currentWeatherData); // Display the fetched current weather
  displayFiveDayForecastInCharts(forecastData); // Display forecast in charts
  renderFiveDayWeather(forecastData); // Render 5-day forecast
});



// Sidebar sliding functionality
document.getElementById('hamburger-menu').addEventListener('click', function() {
  sidebar.classList.toggle('open');
  adjustContentMargins(); // Call margin adjustment function here as well
});



// Function to convert Celsius to Fahrenheit
function convertToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Function to convert Fahrenheit to Celsius
function convertToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}
// Event listener for unit toggle button
unitToggle.addEventListener('click', () => {
  if (currentWeatherData) {
    let tempInCelsius = currentWeatherData.main.temp;
    
    if (isCelsius) {
      // Convert the temperature to Fahrenheit and update the UI
      let tempInFahrenheit = convertToFahrenheit(tempInCelsius);
      tempElement.textContent = `${tempInFahrenheit.toFixed(2)} °F`;
      unitToggle.textContent = 'Switch to °C'; // Update button text for switching back
      updateChartsToUnit(forecastData, 'F'); // Update the chart data to Fahrenheit
      isCelsius = false;
    } else {
      // Switch back to Celsius
      tempElement.textContent = `${tempInCelsius.toFixed(2)} °C`;
      unitToggle.textContent = 'Switch to °F'; // Update button text for switching back
      updateChartsToUnit(forecastData, 'C'); // Update the chart data to Celsius
      isCelsius = true;
    }
  }
});

// Function to update the charts based on the temperature unit
function updateChartsToUnit(forecastData, unit) {
  const temperatures = forecastData.list.map(day => {
    let temp = day.main.temp;
    if (unit === 'F') {
      return convertToFahrenheit(temp); // Convert to Fahrenheit
    } else {
      return temp; // Keep in Celsius, no need to reconvert
    }
  });

  // Update the bar chart
  if (barChart) {
    barChart.data.datasets[0].data = temperatures;
    barChart.data.datasets[0].label = `Temperature (°${unit})`; // Update label for unit
    barChart.update();
  }

  // Update the line chart
  if (lineChart) {
    lineChart.data.datasets[0].data = temperatures;
    lineChart.data.datasets[0].label = `Temperature (°${unit})`; // Update label for unit
    lineChart.update();
  }
}
