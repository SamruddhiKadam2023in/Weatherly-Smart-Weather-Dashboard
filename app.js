$(document).ready(function() {

  var cities = [];
  var currentCity = "New York";
  var currentUnits = "imperial";
  var now = dayjs();
  var currentDate = now.format("dddd, MMM D, YYYY");

  var baseURL = "https://api.openweathermap.org/data/2.5/";
  var APIKey = "f4d6848eb3a488816cecbd2392d8a108";

  var icons = [
    { code: "01", day: "fas fa-sun", night: "fas fa-moon" },
    { code: "02", day: "fas fa-cloud-sun", night: "fas fa-cloud-moon" },
    { code: "03", day: "fas fa-cloud", night: "fas fa-cloud" },
    { code: "04", day: "fas fa-cloud-sun", night: "fas fa-cloud-moon" },
    { code: "09", day: "fas fa-cloud-rain", night: "fas fa-cloud-rain" },
    { code: "10", day: "fas fa-cloud-showers-heavy", night: "fas fa-cloud-showers-heavy" },
    { code: "11", day: "fas fa-bolt", night: "fas fa-bolt" },
    { code: "13", day: "fas fa-snowflake", night: "fas fa-snowflake" },
    { code: "50", day: "fas fa-smog", night: "fas fa-smog" }
  ];

  init();

  function init() {
    $("#today").text(currentDate);

    // Initialize Unit Toggle Position
    $("#unit-toggle").prop("checked", currentUnits === "imperial");

    // Start Real-Time Internet Clock
    startLiveClock();

    if (window.innerWidth >= 768) {
      $("#search-history").addClass("show");
      $("#collapse-search-history").hide();
    }

    getSearchHistory();

    if (cities.length === 0) {
      currentCity = "New York";
    } else {
      currentCity = cities[cities.length - 1];
      $.each(cities, function(index, city) {
        displayCity(city);
      });
    }

    getWeather(currentCity);
    initAutocomplete();
  }

  // Live Clock Functionality
  function startLiveClock() {
    function updateClock() {
      var liveTime = dayjs().format("hh:mm:ss A");
      $("#live-clock span").text(liveTime);
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  function getWeather(city) {
    var responseData = {};
    currentCity = city;

    $.ajax({
      url: baseURL + "weather",
      method: "GET",
      data: { q: city, units: currentUnits, appid: APIKey }
    }).then(function(response) {
      responseData.current = response;
      var coordinates = {
        lat: responseData.current.coord.lat,
        lon: responseData.current.coord.lon
      };
      getUVindex(coordinates);
      displayCurrentWeather(responseData);
    });

    $.ajax({
      url: baseURL + "forecast",
      method: "GET",
      data: { q: city, units: currentUnits, appid: APIKey }
    }).then(function(response) {
      responseData.forecast = response;
      displayForecast(responseData);
    });
  }

  function getUVindex(coordinates) {
    $.ajax({
      url: baseURL + "uvi",
      method: "GET",
      data: { lat: coordinates.lat, lon: coordinates.lon, appid: APIKey }
    }).then(function(response) {
      displayUV(response);
    }); 
  }

  function replaceIcon(iconCode) {
    var number = iconCode.slice(0, 2);
    var currentHour = dayjs().hour();

    var index = icons.findIndex(function(icon) {
      return icon.code === number;
    });

    if (index === -1) return "fas fa-cloud";

    if (currentHour >= 6 && currentHour < 18) {
      return icons[index].day;
    } else {
      return icons[index].night;
    }
  }

  function displayCurrentWeather(data) {
    var tempSymbol = currentUnits === "imperial" ? "\u00B0 F" : "\u00B0 C";
    var speedUnit = currentUnits === "imperial" ? "mph" : "m/s";

    $("#city").text(data.current.name);
    $("#conditions").text(data.current.weather[0].main);
    $("#temperature").text(`${parseInt(data.current.main.temp)}${tempSymbol}`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} ${speedUnit}`);

    if (data.current.sys) {
      var sunriseTime = dayjs.unix(data.current.sys.sunrise).format("h:mm A");
      var sunsetTime = dayjs.unix(data.current.sys.sunset).format("h:mm A");
      $("#sunrise").text(sunriseTime);
      $("#sunset").text(sunsetTime);
    }

    var newIcon = replaceIcon(data.current.weather[0].icon);
    $("#icon").removeClass().addClass(newIcon);
  }

  function displayUV(data) {
    $("#uv-index").text(data.value);
    $("#uv-index").removeClass("bg-success bg-warning bg-danger");

    if (data.value < 3) {
      $("#uv-index").addClass("bg-success");
    } else if (data.value >= 3 && data.value < 6) {
      $("#uv-index").addClass("bg-warning");
    } else if (data.value >= 6) {
      $("#uv-index").addClass("bg-danger");
    }
  }

  function displayForecast(data) {
    var forecast = createForecast(data);
    var tempSymbol = currentUnits === "imperial" ? "\u00B0 F" : "\u00B0 C";

    $.each(forecast, function(i, day) {
      var date = dayjs(day.dt_txt).format("MMM D");
      var year = dayjs(day.dt_txt).format("YYYY");
      var iconClasses = replaceIcon(day.weather[0].icon);

      $(`#day-${i + 1}-icon`).removeClass().addClass(`forecast-icon ${iconClasses}`);
      $(`#day-${i + 1}-date`).text(date);
      $(`#day-${i + 1}-year`).text(year);
      $(`#day-${i + 1}-conditions`).text(day.weather[0].main);
      $(`#day-${i + 1}-temp`).text(`${parseInt(day.main.temp)}${tempSymbol}`);
      $(`#day-${i + 1}-humidity`).text(`${day.main.humidity}% Hum`);
    });
  }

  function createForecast(data) {
    var forecastData = data.forecast.list;
    var fiveDayForecast = [];

    var firstResult = {
      date: dayjs(data.forecast.list[0].dt_txt).date(),
      hour: dayjs(data.forecast.list[0].dt_txt).hour()
    };

    if (firstResult.hour === 6) {
      for (var i = 10; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }
      fiveDayForecast.push(forecastData[38]);
    } else if (firstResult.hour <= 9 && firstResult.hour >= 12) {
      for (var i = 9; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }
      fiveDayForecast.push(forecastData[39]);
    } else {
      var firstNoonIndex = forecastData.findIndex(function(forecast) {
        var isTomorrow = dayjs().isBefore(forecast.dt_txt);
        var hour = dayjs(forecast.dt_txt).hour();
        return isTomorrow && hour === 12;
      });

      if (firstNoonIndex === -1) firstNoonIndex = 0;

      for (var i = firstNoonIndex; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }
    }
    
    return fiveDayForecast.slice(0, 5);
  }

  function initAutocomplete() {
    $("#search").autocomplete({
      minLength: 3,
      source: function(request, response) {
        $.ajax({
          url: "https://api.openweathermap.org/geo/1.0/direct",
          dataType: "json",
          data: {
            q: request.term,
            limit: 5,
            appid: APIKey
          },
          success: function(data) {
            var suggestions = $.map(data, function(item) {
              var locationLabel = item.state 
                ? `${item.name}, ${item.state}, ${item.country}` 
                : `${item.name}, ${item.country}`;

              return {
                label: locationLabel,
                value: item.name
              };
            });
            response(suggestions);
          }
        });
      },
      select: function(event, ui) {
        getWeather(ui.item.value);
        displayCity(ui.item.value);
        saveToHistory(ui.item.value);
      }
    });
  }

  function displayCity(city) {
    var li = $("<li>");
    li.addClass("history-item");
    li.text(city);
    $("#search-history").prepend(li);
  }

  function saveToHistory(city) {
    getSearchHistory();
    if (!cities.includes(city)) {
      cities.push(city);
      setSearchHistory();
    }
  }

  function getSearchHistory() {
    if (localStorage.getItem("cities") === null) {
      cities = [];
    } else {
      cities = JSON.parse(localStorage.getItem("cities"));
    }
  }

  function setSearchHistory() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  // Theme Switcher Event Handler
  $("#theme-toggle").on("click", function() {
    $("body").toggleClass("dark-theme light-theme");
    var isLight = $("body").hasClass("light-theme");
    $(this).find("i").toggleClass("fa-moon fa-sun");
  });

  // Toggle Unit Event Handler
  $("#unit-toggle").on("change", function() {
    currentUnits = $(this).is(":checked") ? "imperial" : "metric";
    if (currentCity) {
      getWeather(currentCity);
    }
  });

  $("#delete-history").on("click", function() {
    $(".history-item").remove();
    cities = [];
    setSearchHistory();
  });

  $("#search-history").on("click", ".history-item", function() {
    getWeather($(this).text());
  });

  $("#search-form").on("submit", function(event) {
    event.preventDefault();
    var city = $("#search").val().trim();
    if (city === "") return;

    getWeather(city);
    displayCity(city);
    saveToHistory(city);
    $("#search").val("");
  });
});