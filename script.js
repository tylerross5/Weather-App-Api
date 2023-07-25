var searchHistory=[];
var weatherApiRootUrl='https://api.openweathermap.org';
var weatherApiKey='9218d3f0ac308eb56bb542cad60cea80';
var forecastContainer=document.querySelector('#forecast');
var searchForm=document.querySelector('#search');
var searchHistoryContainer=document.querySelector('#history');
var searchInput=document.querySelector('#searchbtn');
var todayContainer=document.querySelector('#today');

function useSearchHistory() {
    searchHistoryContainer.innerHTML = '';
  for (var i = searchHistory.length - 1; i >= 0; i--) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.classList.add('history-btn', 'history');
      btn.setAttribute('data', searchHistory[i]);
      btn.textContent = searchHistory[i];
      searchHistoryContainer.append(btn);
    }
  }
  function addHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
      return;}
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    useSearchHistory();
  }
  function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory);}
    useSearchHistory();
  }
  function searchsubmit(e) {
    if (!searchInput.value) {
      return;}
    var search = searchInput.value.trim();
    fetchlocation(search);
  }
  
  function searchclick(e) {
    if (!e.target.matches('.history')) {
      return;}
    var btn = e.target;
    var search = btn.getAttribute('data');
    fetchlocation(search);}
function forecastcard(forecast) {
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var tempEl = document.createElement('div');
    var windEl = document.createElement('div');
    var humidityEl = document.createElement('div');
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle,tempEl, windEl, humidityEl);
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    forecastContainer.append(col);
  }
  function fetchlocation(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Unable to locate');} 
          else {
          addHistory(search);
          fetchWeather(data[0]);}
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  function fetchWeather(location) {
    var {lat} = location;
    var {lon} = location;
    var city = location.name;
  var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderItems(city, data);
      })
      .catch(function (err) {
        console.error(err);
      });
}
  function showforecast(dailyForecast) {
        var headingCol = document.createElement('div');
        var heading = document.createElement('h5');
        headingCol.setAttribute('class', 'col-12');
        heading.textContent = '5-Day Forecast:';
         headingCol.append(heading);
        forecastContainer.innerHTML = '';
        forecastContainer.append(headingCol);
  
    for (var i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt  && dailyForecast[i].dt ) {
        if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
          forecastcard(dailyForecast[i]);
        }}}
  }
  function renderItems(city, data) {
    showforecast(data.list);
  }
  
  initSearchHistory();
  searchForm.addEventListener('submit', searchsubmit);
  searchHistoryContainer.addEventListener('click', searchclick);
  