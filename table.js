// Get API key from OpenWeather API
const apiKey = "95fa9ecba354ea24ef4612889bc18172";

// Get city input field and get weather button
const cityInput = document.getElementById("city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");

// Get weather forecast elements
const forecastContainer = document.getElementById("forecast-container");
const paginationContainer = document.getElementById("pagination-container");
const chatIcon = document.getElementById('chat-icon');
let isCelsius = true; // By default, it's Celsius
const unitToggle = document.getElementById('unit-toggle');


const sidebar = document.getElementById('sidebar');
const loadingOverlay = document.getElementById('loading-overlay');


let forecastData = []; // Global variable for 5-day forecast data
let currentPage = 1;
const entriesPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {

  setTimeout(() => {
    sidebar.classList.add('open');
    adjustContentMargins(); // Ensure content margins are set correctly
  }, 100); // Small delay to ensure the animation is visible

  // Check for geolocation support
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeatherForGeolocation, handleGeolocationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
  const forecastData1 = JSON.parse(localStorage.getItem('fiveDayForecast'));
  const cityNameFromStorage = localStorage.getItem('cityName'); // Retrieve city name from local storage
  const backgroundImageFromStorage = localStorage.getItem('backgroundImage'); // Get the saved background description
  
    // Apply the saved background image if it exists
    if (backgroundImageFromStorage) {
      updateBackgroundImage(backgroundImageFromStorage);
    }
  

  if (cityNameFromStorage) {
      document.getElementById('forecast-heading').textContent = `Five-Day Forecast for ${cityNameFromStorage}`; // Set the heading
  }
  
  if (forecastData1) {
    renderFiveDayWeather(forecastData1);
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


// Fetch weather and forecast data
async function fetchWeather(city) {
  if (!city) {
    alert("Please enter a valid city name.");
    return;
  }
  loadingOverlay.style.display = 'flex'; // Show overlay


  // Fetch current weather data
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const currentResponse = await fetch(currentWeatherUrl);

  if (!currentResponse.ok) {
    loadingOverlay.style.display = 'none'; // Hide overlay on error

    alert("City not found");
    return;
  }

  const currentWeatherData = await currentResponse.json();
  document.getElementById('forecast-heading').textContent = `Five-Day Forecast for ${currentWeatherData.name}`; // Add this line
  updateBackgroundImage(currentWeatherData.weather[0].description);

  localStorage.setItem('cityName', currentWeatherData.name);
  localStorage.setItem('backgroundImage', currentWeatherData.weather[0].description); // Save the description to set the background later


  // Fetch 5-day weather forecast
  const lat = currentWeatherData.coord.lat;
  const lon = currentWeatherData.coord.lon;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    loadingOverlay.style.display = 'none'; // Hide overlay on error

    alert("Error fetching forecast data");
    return;
  }

  forecastData = await forecastResponse.json();

  localStorage.setItem('fiveDayForecast', JSON.stringify(forecastData));

  loadingOverlay.style.display = 'none'; // Hide overlay after loading

  renderFiveDayWeather(forecastData);
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



// Show weather based on geolocation
function showWeatherForGeolocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherByCoordinates(lat, lon);
}

// Handle geolocation error
function handleGeolocationError(error) {
  console.error("Geolocation error:", error.message);
  alert("Unable to retrieve your location.");
}

// Fetch weather data by coordinates (used for geolocation)
async function fetchWeatherByCoordinates(lat, lon) {
  loadingOverlay.style.display = 'flex'; // Show overlay

  // Fetch current weather
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const currentResponse = await fetch(currentWeatherUrl);


  if (!currentResponse.ok) {
    loadingOverlay.style.display = 'none'; // Hide overlay on error
    alert("Error fetching current weather data");
    return;
  }

  currentWeatherData = await currentResponse.json();
  updateBackgroundImage(currentWeatherData.weather[0].description);

  // Fetch 5-day weather forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    loadingOverlay.style.display = 'none'; // Hide overlay on error
    alert("Error fetching forecast data");
    return;
  }

  forecastData = await forecastResponse.json();


  localStorage.setItem('cityName', currentWeatherData.name); // Store the city name

  localStorage.setItem('fiveDayForecast', JSON.stringify(forecastData));

  document.getElementById('forecast-heading').textContent = `Five-Day Forecast for ${currentWeatherData.name}`; // Add this line

  
  loadingOverlay.style.display = 'none'; // Hide overlay after loading

  renderFiveDayWeather(forecastData);
}


// Function to display 5-day weather forecast in table
// Function to display 5-day weather forecast
function renderFiveDayWeather(data, page = 1) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';  // Clear previous forecast cards

  const totalPages = Math.ceil(data.list.length / entriesPerPage);
  const startIndex = (page - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPageData = data.list.slice(startIndex, endIndex);

  // Generate the forecast cards for the current page
  currentPageData.forEach(item => {
      const weatherCard = document.createElement('div');
      weatherCard.classList.add('forecast-card');

      // Get the weather description
      const weatherDescription = item.weather[0].description;

      // Update the background image of the weather card
      updateCardBackgroundColor(weatherCard, weatherDescription);

      weatherCard.innerHTML = `
        <div class="card-date">${formatDate(item.dt_txt)}</div>
        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon" class="weather-icon" />
        <div class="temperature">${Math.round(item.main.temp)}°C</div>
        <div class="description">${weatherDescription}</div>
        <div class="card-details">
          <p>Humidity: ${item.main.humidity}%</p>
          <p>Wind: ${item.wind.speed} m/s</p>
        </div>
      `;
      forecastContainer.appendChild(weatherCard);
  });

  


  // Handle Pagination Buttons
  document.getElementById('prev-page').disabled = page === 1;
  document.getElementById('next-page').disabled = page === totalPages;

  // Update current page display
  document.getElementById('current-page').textContent = page;

  document.getElementById('prev-page').onclick = () => {
      if (page > 1) renderFiveDayWeather(data, page - 1);
  };

  document.getElementById('next-page').onclick = () => {
      if (page < totalPages) renderFiveDayWeather(data, page + 1);
  };
}


  // Helper function to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
}

// Function to update the background color of the weather card based on the weather description
function updateCardBackgroundColor(card, weatherDescription) {
  let bgColor;

  switch (weatherDescription.toLowerCase()) {
    case 'clear sky':
      bgColor = 'linear-gradient(to bottom, #87CEEB, #4682B4)'; // Light blue to deep sky blue
      break;
    case 'few clouds':
      bgColor = 'linear-gradient(to bottom, #D3D3D3, #A9A9A9)'; // Light gray to darker gray
      break;
    case 'scattered clouds':
      bgColor = 'linear-gradient(to bottom, #B0C4DE, #778899)'; // Light steel blue to slate gray
      break;
    case 'broken clouds':
      bgColor = 'linear-gradient(to bottom, #A9A9A9, #696969)'; // Dark gray to dim gray
      break;
    case 'overcast clouds':
      bgColor = 'linear-gradient(to bottom, #808080, #505050)'; // Gray to dark gray
      break;
    case 'shower rain':
      bgColor = 'linear-gradient(to bottom, #76C7C0, #4682B4)'; // Light blue to medium blue
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
      bgColor = 'linear-gradient(to bottom, #5F9EA0, #2F4F4F)'; // Cadet blue to dark slate gray
      break;
      case 'thunderstorm':
        case 'light thunderstorm':
        case 'heavy thunderstorm':
        case 'ragged thunderstorm':
        case 'thunderstorm with light drizzle':
        case 'thunderstorm with drizzle':
        case 'thunderstorm with heavy drizzle':
      bgColor = 'linear-gradient(to bottom, #4B0082, #000080)'; // Indigo to navy
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
      bgColor = 'linear-gradient(to bottom, #FFFFFF, #D3D3D3)'; // White to light gray
      break;
    case 'mist':
      bgColor = 'linear-gradient(to bottom, #E0E0E0, #B0B0B0)'; // Light misty gray to gray
      break;
    case 'smoke':
      bgColor = 'linear-gradient(to bottom, #696969, #2F4F4F)'; // Dim gray to dark slate gray
      break;
    case 'haze':
      bgColor = 'linear-gradient(to bottom, #F5F5DC, #D3D3D3)'; // Beige to light gray
      break;
    case 'dust':
      bgColor = 'linear-gradient(to bottom, #DAA520, #B8860B)'; // Goldenrod to dark goldenrod
      break;
    case 'fog':
      bgColor = 'linear-gradient(to bottom, #A9A9A9, #696969)'; // Dark gray to dim gray
      break;
    case 'sand':
      bgColor = 'linear-gradient(to bottom, #F4A460, #D2B48C)'; // Sandy brown to tan
      break;
    case 'squall':
      bgColor = 'linear-gradient(to bottom, #778899, #2F4F4F)'; // Slate gray to dark slate gray
      break;
    case 'tornado':
      bgColor = 'linear-gradient(to bottom, #808080, #2F4F4F)'; // Gray to dark slate gray
      break;
    default:
      bgColor = 'linear-gradient(to bottom, #A9A9A9, #505050)'; // Default to gray shades
  }

  // Apply the gradient color as the background
  card.style.backgroundImage = bgColor;
  card.style.backgroundSize = 'cover';
  card.style.backgroundRepeat = 'no-repeat';
  card.style.backgroundAttachment = 'fixed';
}



  // Function to setup pagination
  function setupPagination() {
    paginationContainer.innerHTML = ""; // Clear existing pagination
    const totalPages = Math.ceil(forecastData.length / entriesPerPage);
  
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.disabled = i === currentPage; // Disable current page button
      button.addEventListener("click", () => {
        currentPage = i;
        displayFiveDayForecast();
      });
      paginationContainer.appendChild(button);
    }
  }

  getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
      alert('Please enter a valid city name.');
      return;
    }
  
    await fetchWeather(city);
  });

  
  
// Add event listener for the filter dropdown
document.getElementById('filter-dropdown').addEventListener('change', function() {
    const selectedFilter = this.value;
    const forecastData = JSON.parse(localStorage.getItem('fiveDayForecast'));
  
    if (forecastData) {
      let filteredData = forecastData.list;
  
      switch (selectedFilter) {
        case 'ascending':
          // Sort temperatures in ascending order
          filteredData = filteredData.sort((a, b) => a.main.temp - b.main.temp);
          break;
  
        case 'rain':
          filteredData = filteredData.filter(item => 
            item.weather.some(condition => condition.main.toLowerCase().includes('rain'))
          );
          break;
        case 'withoutrain':
          filteredData = filteredData.filter(item => 
            !item.weather.some(condition => condition.main.toLowerCase().includes('rain'))
          );
          break;
        case 'highest':
          // Show the day with the highest temperature
          const highestTempEntry = filteredData.reduce((prev, current) => (prev.main.temp > current.main.temp) ? prev : current);
          filteredData = [highestTempEntry]; // Wrap in an array to maintain consistency
          break;
  
        case 'descending':
          // Sort temperatures in descending order
          filteredData = filteredData.sort((a, b) => b.main.temp - a.main.temp);
          break;
  
        default:
          // If no filter is selected, use the original data
          filteredData = forecastData.list;
          break;
      }
  
      // Render the filtered data
      renderFiveDayWeather({ city: forecastData.city, list: filteredData });
    }
  });

  
  
// Sidebar sliding functionality
document.getElementById('hamburger-menu').addEventListener('click', function() {
    sidebar.classList.toggle('open');
  
    adjustContentMargins();
    
  });

  
function adjustContentMargins() {
  if (sidebar.classList.contains('open')) {
   
    chatIcon.style.marginLeft = '1400px'; // Reset chat icon to original position when sidebar closes

} else {
    chatIcon.style.marginLeft = '1600px'; // Reset chat icon to original position when sidebar closes
}
}

const chatboxInput = document.getElementById('chatbox-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const chatboxMessages = document.getElementById('chatbox-messages');

  // Send message functionality for chatbox
  sendMessageBtn.addEventListener('click', async () => {
    const userMessage = chatboxInput.value.trim();
    if (!userMessage) return;

    displayMessage('You', userMessage);
    chatboxInput.value = '';

    // Check if the message contains the word "weather"
    if (userMessage.toLowerCase().includes('weather')) {
        const city = userMessage.split(' ').slice(-1)[0]; // Gets the last word as city
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            displayMessage('Bot', `The weather in ${weatherData.name} is ${weatherData.main.temp} °C with ${weatherData.weather[0].description}.`);
        } else {
            displayMessage('Bot', 'Sorry, I could not fetch the weather data.');
        }
    } else {
        // Handle non-weather-related queries using Gemini API
        const response = await fetchGeminiResponse(userMessage);
        displayMessage('Bot', response);
    }
});

// Function to display messages in the chatbox
function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  
  // Set the class based on the sender (user or bot)
  if (sender === 'You') {
    messageElement.classList.add('user-message');
  } else {
    messageElement.classList.add('bot-message');
  }

  messageElement.textContent = `${sender}: ${message}`;

  // Add the message to the chatbox
  chatboxMessages.appendChild(messageElement);

  // Add a divider between messages
  const divider = document.createElement('div');
  divider.classList.add('chat-divider');
  chatboxMessages.appendChild(divider);

  // Scroll to the bottom of the chatbox to show the latest message
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}


// Function to fetch weather data
async function fetchWeatherData(city) {
  const apiKey = "95fa9ecba354ea24ef4612889bc18172"; // Your weather API key
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
      console.log(`Fetching weather data for city: ${city}`); // Log city
      const response = await fetch(currentWeatherUrl);
      
      console.log(`Weather API response status: ${response.status}`); // Log response status
      
      if (!response.ok) {
          const errorText = await response.text(); // Get error text
          console.error('Weather API error:', errorText); // Log error
          throw new Error('City not found'); // Update this as necessary based on the error
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
  }
}
async function fetchGeminiResponse(query) {
  console.log(query);

  const apiKey = 'AIzaSyDuWokKPF1mnZcxAj3P0sSP2HHRASqPFjo';  
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
        {
            parts: [
                {
                    text: query
                }
            ]
        }
    ]
};

console.log(payload);

try {
    const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Error communicating with the Gemini API');
    }

    const data = await response.json();
    console.log('API Response Data:', data);

    // Extract the chatbot response text
    const chatbotMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from the chatbot';
    return chatbotMessage;
} catch (error) {
    console.error('Error sending message:', error);
    return 'Sorry, I couldn’t get a response from the chatbot.';
}

}


// JavaScript for toggling the chatbox with animations
const chatboxContainer = document.getElementById('chatbox-container');
const closeChatboxBtn = document.querySelector('.close-chatbox'); // Select the close button
let chatboxVisible = false;

function toggleChatbox() {
  if (!chatboxVisible) {
    // Open chatbox with animation
    chatboxContainer.classList.add('show'); // Show with animation
    chatboxContainer.style.display = 'block'; // Make it visible
    setTimeout(() => {
      chatboxContainer.style.transform = 'translateY(0)'; // Animate upwards
      chatboxContainer.style.opacity = '1';
    }, 10); // Small delay for smooth transition
  } else {
    // Close chatbox with animation
    chatboxContainer.style.transform = 'translateY(100%)'; // Animate downwards
    chatboxContainer.style.opacity = '0';
    setTimeout(() => {
      chatboxContainer.style.display = 'none';
    }, 400); // Wait for animation to complete before hiding
  }
  chatboxVisible = !chatboxVisible; // Toggle chatbox visibility state
}


// Event listeners for both the chat icon and the close button
chatIcon.addEventListener('click', toggleChatbox);
closeChatboxBtn.addEventListener('click', toggleChatbox);

function convertToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function convertToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}
unitToggle.addEventListener('click', () => {
  const forecastCards = document.querySelectorAll('.forecast-card .temperature');
  forecastCards.forEach(card => {
    let currentTemp = parseFloat(card.textContent);

    if (isCelsius) {
      // Convert Celsius to Fahrenheit
      let tempInFahrenheit = convertToFahrenheit(currentTemp);
      card.textContent = `${tempInFahrenheit.toFixed(1)}°F`;
      unitToggle.textContent = 'Switch to °C'; // Update button text for switching back
    } else {
      // Convert Fahrenheit to Celsius
      let tempInCelsius = convertToCelsius(currentTemp);
      card.textContent = `${tempInCelsius.toFixed(1)}°C`;
      unitToggle.textContent = 'Switch to °F'; // Update button text for switching back
    }
  });
  isCelsius = !isCelsius; // Toggle the unit state after processing
});

  
