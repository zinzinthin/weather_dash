//API keys
const ipregistrykey = "ira_6Ep5a9o0Kp9C7jUix5AaJX6hea31C40IBpGM";
const openweathrkey = "3e47c1570e1e6c8480182d878001cdf0";

//fetch lat & logi for user current location 
//and then display weather info
fetchLocation().then(data => {
    const lati = data.location.latitude;
    const longi = data.location.longitude;

    setTimeout(() => {
        fetchWeather(lati, longi)
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

async function fetchWeather(lati = "16.8257979", longi = "96.1456519") {

    let lat = lati;
    let lon = longi;

    const currentweatheruri = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openweathrkey}`
    const weeklyuri = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openweathrkey}`;

    const current = await fetch(currentweatheruri);
    const weekly = await fetch(weeklyuri);

    const [currentresponse,weeklyresponse] = await Promise.all([current,weekly]);
    const currentData = await currentresponse.json();
    const weeklyData = await weeklyresponse.json();

    return {currentData,weeklyData};
}

//------------------------------------functions

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
        country : current.sys.country,
        city : current.name,
        temp : current.main.temp,
        humidity : current.main.humidity,
        windspeed : current.wind.speed,
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

function showCurrentWeather(item){

    document.querySelector("#countryCode").textContent = item.country;
    document.querySelector("#cityName").textContent = item.city;
    document.querySelector("#currentTemp").textContent = item.temp;
    document.querySelector("#currentHumidity").textContent = item.humidity;
    document.querySelector("#currentWindSpeed").textContent = item.windspeed;

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
            let lat = ui.item.lat;
            let lon = ui.item.lon;
            
                fetchWeather(lat, lon)
                    .then(data => {
                        displayWeatherData(data);
                    });
        
        },
       
        // minLength: 3 // Minimum characters to trigger the autocomplete
    });
});





