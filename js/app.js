const lat = "16.9406159";
const lon = "97.3462055";

const key = "3e47c1570e1e6c8480182d878001cdf0";
const uri = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

fetch(uri)
    .then(response => response.json())
    .then(data => displayWeatherData(data.list))
    .catch(err => console.error(err));

function displayWeatherData(data) {

    const weatherData = extractWeatherData(data);

    const createCharts = {
        humidity : {
            id : 'humidity',
            title : 'Average Weekly Humidity',
            yTitle : 'Humidity',
            data : [weatherData[0]],
        },
        temperature : {
            id : 'temperature',
            title : 'Average Weekly Temperature',
            yTitle : 'Temperature °C',
            data : [weatherData[1]],
        },
        pressure : {
            id : 'pressure',
            title : 'Average Weekly Pressure',
            yTitle : 'Pressure',
            data : [weatherData[2]]
        },
        overall : {
            id : 'weeklyOverview',
            title : 'Weekly Overview',
            yTitle : 'Over All Chart',
            data : weatherData,
        }

    };

    createSplineChart(createCharts.humidity);
    createSplineChart(createCharts.overall);

    createAreaChart(createCharts.temperature);
    createAreaChart(createCharts.pressure);

}

function extractWeatherData(items) {

    const humidityData = items.map(item => ([
        item.dt * 1000,
        item.main.humidity
    ]));

    const temperatureData = items.map(item => ([
        item.dt * 1000,
        item.main.temp
    ]));

    const pressureData = items.map(item => ([
        item.dt * 1000,
        item.main.pressure
    ]));


    const weatherData = [
        {
            name: "humidity",
            data: humidityData,
            lineWidth: 5
        },
        {
            name: "temperature",
            data: temperatureData,
            lineWidth: 5,
            color: '#e0225b',
        },
        {
            name: "pressure",
            data: pressureData,
            lineWidth: 5,
            color: 'darkred',
        },
    ];

    return weatherData;

}

function createSplineChart({id, title, yTitle, data}) {

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

function createAreaChart({id, title, yTitle, data}) {

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


