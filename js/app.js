//API keys
const ipregistrykey = "ira_6Ep5a9o0Kp9C7jUix5AaJX6hea31C40IBpGM";
const openweathrkey = "3e47c1570e1e6c8480182d878001cdf0";

//default location
let latitude = "16.9345949";
let longitude = "97.3462813";

let map;
let marker;

//date - navbar
showTodayDate();

//show user location on map
createMap();

//fetch lat & logi for user current location 
fetchLocation().then(data => {

    //overwrite default location with user current location
    latitude = data.location.latitude;
    longitude = data.location.longitude;

    //change map view and marker with user location
    updateMap();

    //display weather info
    setTimeout(() => {
        fetchWeather()
            .then(data => {
                displayWeatherData(data);
            });
    }, 1000);

}).catch(err => {
    console.log("Please use a VPN!!");
});


//------------------------------------fetch API

async function fetchLocation() {
    const response = await fetch(`https://api.ipregistry.co?key=${ipregistrykey}&fields=location`);
    const data = await response.json();
    return data;
}

async function fetchWeather() {

    const currentweatheruri = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openweathrkey}`
    const weeklyuri = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${openweathrkey}`;

    const current = await fetch(currentweatheruri);
    const weekly = await fetch(weeklyuri);

    const [currentresponse, weeklyresponse] = await Promise.all([current, weekly]);
    const currentData = await currentresponse.json();
    const weeklyData = await weeklyresponse.json();

    return { currentData, weeklyData };
}

//------------------------------------functions

function showTodayDate(){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    const date = new Date();
    document.querySelector("#date").textContent = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function displayWeatherData(data) {

    const weatherData = extractWeatherData(data);

    showCurrentWeather(weatherData.currentinfo);
    showHourlyWeather(weatherData.hourlyData);

    showCharts(weatherData.humidity, weatherData.temperature, weatherData.pressure);
}

//just extract weather data
function extractWeatherData(data) {

    //extract necessary current weather info
    const current = data.currentData;

    const currentinfo = {
        country: current.sys.country,
        city: current.name,
        temp: current.main.temp,
        humidity: current.main.humidity,
        windspeed: current.wind.speed,
    }

    //extract necessary weekly weather info
    const lists = data.weeklyData.list;

    const humidityData = lists.map(item => ([
        item.dt * 1000,
        item.main.humidity
    ]));

    const temperatureData = lists.map(item => ([
        item.dt * 1000,
        item.main.temp
    ]));

    const pressureData = lists.map(item => ([
        item.dt * 1000,
        item.main.pressure
    ]));

    const hourlyData = lists.map(item => ({
        hour: new Date(item.dt_txt).getHours(),
        weathericon: item.weather[0].icon,
        temp: item.main.temp,
    }));

    const weatherData = {
        currentinfo,
        hourlyData,
        humidity: humidityData,
        temperature: temperatureData,
        pressure: pressureData,
    }

    return weatherData;
}

function showCurrentWeather(item) {

    document.querySelector("#flag").className = `flag-icon flag-icon-${item.country.toLowerCase()}`; 
    document.querySelector("#countryCode").textContent = item.country;
    document.querySelector("#cityName").textContent = item.city;
    document.querySelector("#currentTemp").textContent = item.temp;
    document.querySelector("#currentHumidity").textContent = item.humidity + "%";
    document.querySelector("#currentWindSpeed").textContent = item.windspeed + "km/h";

}

function showHourlyWeather(items) {

    const container = document.querySelector(".hourlyweather");

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add("card", "shadow-sm", "text-center", "flex-shrink-0", "p-2", "me-2");

        const icon = document.createElement('img');
        icon.setAttribute("src", `https://openweathermap.org/img/wn/${item.weathericon}.png`);
        icon.classList.add("p-1");

        const hour = document.createElement('span');
        hour.textContent = `${item.hour} : 00`;

        const temp = document.createElement('span');
        temp.textContent = item.temp;

        card.appendChild(hour);
        card.appendChild(icon);
        card.appendChild(temp);

        container.append(card);
    });
}

function createMap() {
    //initialize the map
    map = L.map('map', {
        center: [latitude, longitude],
        zoom: 7
    });

    //marker
    marker = L.marker([latitude, longitude]).addTo(map)
        .openPopup();


    //add openstreetmap titles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //map is clicked, show weather info
    map.on('click', function (e) {

        const { lat, lng } = e.latlng;

        //overwrite user current location with user clicked map location
        latitude = lat;
        longitude = lng;

        //change view and marker with user clicked location
        updateMap();

        fetchWeather()
            .then(data => {
                displayWeatherData(data);
            });
    });
}

function updateMap() {
    map.setView([latitude, longitude], 7);
    marker.setLatLng([latitude, longitude]);
}

//prepare data for charts
//and then create charts
function showCharts(...weatherData) {

    //chart series
    const series = [
        {
            name: "humidity",
            data: weatherData[0],
            lineWidth: 5
        },
        {
            name: "temperature",
            data: weatherData[1],
            lineWidth: 5,
            color: '#e0225b',
        },
        {
            name: "pressure",
            data: weatherData[2],
            lineWidth: 5,
            color: 'darkred',
        },
    ];

    //information for creating charts
    const createCharts = {
        humidity: {
            id: 'humidity',
            title: 'Average Weekly Humidity',
            yTitle: 'Humidity',
            data: [series[0]],
        },
        temperature: {
            id: 'temperature',
            title: 'Average Weekly Temperature',
            yTitle: 'Temperature °C',
            data: [series[1]],
        },
        pressure: {
            id: 'pressure',
            title: 'Average Weekly Pressure',
            yTitle: 'Pressure',
            data: [series[2]]
        },
        overall: {
            id: 'weeklyOverview',
            title: 'Weekly Overview',
            yTitle: 'Over All Chart',
            data: series,
        }

    };

    createSplineChart(createCharts.humidity);
    createSplineChart(createCharts.overall);

    createAreaChart(createCharts.temperature);
    createAreaChart(createCharts.pressure);
}

function createSplineChart({ id, title, yTitle, data }) {

    Highcharts.chart(id, {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
        },

        title: {
            floating: false,
            align: 'left',
            text: title,
            style: {
                color: "#FFF",
            }
        },

        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: "#FFF",
                }
            },

            dateTimeLabelFormats: {
                day: '%b %e',
            },
            tickInterval: 12 * 3600 * 1000,

        },

        yAxis: {
            title: {
                text: yTitle,
                style: {
                    color: "#FFF",
                }
            },
            labels: {
                style: {
                    color: "#FFF",
                }
            },

            gridLineColor: 'transparent',

        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    align: 'right',
                    formatter: function () {
                        if (this.point.x === this.series.data[this.series.data.length - 1].x) {
                            return this.series.name;
                        }
                        return null;
                    },
                    style: {
                        color: "#fff",
                        fontWeight: 'bloder',
                        fontSize: 16
                    },
                },
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                        }
                    }
                }
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF </span>{series.name} : <b>{point.y}%</b>'
        },

        series: data,

    });

}

function createAreaChart({ id, title, yTitle, data }) {

    Highcharts.chart(id, {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
        },

        title: {
            floating: false,
            align: 'left',
            text: title,
            style: {
                color: '#fff',
            }
        },

        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: "#FFF",
                }
            },

            dateTimeLabelFormats: {
                day: '%b %e',
            },
            tickInterval: 12 * 3600 * 1000,

        },
        yAxis: {
            title: {
                text: yTitle,
                style: {
                    color: '#fff',
                }
            },
            labels: {
                style: {
                    color: "#FFF",
                }
            },
            gridLineColor: 'transparent',
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF </span>{series.name} : <b>{point.y}%</b>'
        },
        plotOptions: {
            area: {

                dataLabels: {
                    enabled: true,
                    align: 'right',
                    formatter: function () {
                        if (this.point.x === this.series.data[this.series.data.length - 1].x) {
                            return this.series.name;
                        }
                        return null;
                    },
                    style: {
                        color: "#fff",
                        fontWeight: 'bloder',
                        fontSize: 16
                    },
                },

                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: data,
    });
}


//------------------------------------Jquery UI autocomplete with ajax

$(function () {
    // Initialize jQuery UI Autocomplete
    $('#searchCity').autocomplete({
        source: function (request, response) {

            const cityInput = request.term; //$('#searchCity').val()
            const key = "3e47c1570e1e6c8480182d878001cdf0";
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=10&appid=${key}`;

            $.get(geocodeUrl, function (data) {
                const cities = data.map(city => (
                    {
                        value: city.name, //for li val()
                        country: city.country,
                        name: city.name,
                        lat: city.lat,
                        lon: city.lon
                    }));
                response(cities);

            }).fail(err => console.log(err));
        },
        select: function (event, ui) {
            latitude = ui.item.lat;
            longitude = ui.item.lon;

            //change map view and marker with user search city
            updateMap();

            //display weather info for user search city
            fetchWeather()
                .then(data => {
                    displayWeatherData(data);
                });

        },

    });
});





