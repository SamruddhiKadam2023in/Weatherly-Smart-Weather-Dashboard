🌤️ Weatherly - Smart Weather Dashboard

A responsive, single-page weather dashboard that shows current conditions, a 5-day forecast, UV index, sunrise/sunset times, and a live clock for any city — with light/dark themes, unit switching, and search history. Built with vanilla JS, jQuery, and the OpenWeatherMap API.

📌 Overview

Weatherly lets users search for any city and instantly view its current weather along with a 5-day forecast. It features a modern glassmorphism UI, day/night-aware weather icons, a persistent search history (via localStorage), and toggles for both theme (dark/light) and temperature units (°F/°C).

✨ Features
🔍 City search with autocomplete - powered by the OpenWeatherMap Geocoding API
🌡️ Current weather metrics - temperature, humidity, wind speed, UV index (color-coded by severity), sunrise & sunset times
📅 5-day forecast - displayed as individual forecast cards with date, condition, icon, temperature, and humidity
🌗 Day/night-aware icons - weather icons switch between sun/moon variants based on the time of day
🕒 Live clock - real-time updating clock in the header
🌓 Dark / Light theme toggle
🌡️ Imperial / Metric unit toggle (°F ↔ °C)
🕘 Search history - recently searched cities are saved locally and can be revisited or cleared
📱 Responsive layout - collapsible search history panel on smaller screens
🛠️ Tech Stack
Layer	Technology
Structure	HTML5
Styling	CSS3 (custom properties/theming, glassmorphism, Flexbox/Grid), Bootstrap 4
Logic	JavaScript (jQuery)
Date & Time	Day.js
Autocomplete	jQuery UI Autocomplete
Icons	Font Awesome 6
Fonts	Google Fonts (Inter)
Data Source	OpenWeatherMap API — Current Weather, 5-Day Forecast, UV Index, and Geocoding endpoints
Storage	Browser localStorage (for search history)

No build tools or frameworks required — it's a static site that runs directly in the browser.

📂 Project Structure
Smart_Weather_Dashboard/
├── index.html      # Page markup & layout
├── style.css        # Theming, glassmorphism cards, responsive styling
└── app.js            # App logic: API calls, DOM updates, event handlers
⚙️ Setup & Installation
Clone the repository
bash
   git clone <your-repo-url>
   cd Smart_Weather_Dashboard
Get a free OpenWeatherMap API key
Sign up at openweathermap.org/api
Generate an API key from your account dashboard
Add your API key
Open app.js and set your key:
js
     var APIKey = "YOUR_OPENWEATHERMAP_API_KEY";
Run it
Simply open index.html in your browser, or serve it with a local static server, e.g.:
bash
     npx serve .

No installation of dependencies is needed — all libraries (jQuery, jQuery UI, Bootstrap, Day.js, Font Awesome) are loaded via CDN in index.html.

🔒 Important: API Key Security

⚠️ The current version of app.js has the OpenWeatherMap API key hardcoded directly in the client-side script. Since this is public/static JavaScript, anyone viewing the page source (or the GitHub repo) can see and use that key.

Before pushing this to a public GitHub repository:

Remove/replace the real key in app.js with a placeholder (e.g. "YOUR_API_KEY") and instruct users to add their own, as shown above.
If a real key was already committed or shared anywhere, regenerate it from your OpenWeatherMap account to invalidate the old one.
For a production deployment, consider proxying API requests through a small backend/serverless function so the key is never exposed client-side.
🚀 Usage
Type a city name in the search box (autocomplete suggestions appear after 3 characters) and press enter or click the search icon.
Toggle °C / °F using the switch in the header to convert all displayed values.
Click the moon/sun icon to switch between dark and light themes.
Previously searched cities appear under Recent Searches — click one to reload its weather, or use Clear to wipe the history.
📄 License

This project is open-source. Feel free to use, modify, and distribute it as per your needs (add your preferred license, e.g. MIT, here).

🙌 Acknowledgements
Weather, forecast, UV index, and geocoding data from OpenWeatherMap
Icons by Font Awesome
UI components via Bootstrap and jQuery UI
Date/time handling via Day.js
