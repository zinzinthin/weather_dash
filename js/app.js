const lat = "16.9406159";
const lon = "97.3462055";

const key = "3e47c1570e1e6c8480182d878001cdf0";
const uri = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

fetch(uri)
    .then(response => response.json())
    .then(data => displayWeatherData(data.list))
    .catch(err => console.log(err));

function displayWeatherData(items) {

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

    createHumidityChart(humidityData);
    createTempChart(temperatureData);
    createPressureChart(pressureData);
}

function createHumidityChart(items) {

    Highcharts.chart('humidity', {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
        },

        title: {
            floating: false,
            align: 'left',
            text: 'Average Weekly Humidity',
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
                text: 'Humidity',
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

            min: 20,
            max: 100

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

        series: [{
            name: 'humidity',
            data: items,
            lineWidth: 5,
        },]

    });

}

function createTempChart(items) {

    Highcharts.chart('temperature', {
        chart: {
            type: 'area',
            backgroundColor : 'transparent',
        },
       
        title: {
            floating : false,
            align : 'left',
            text: 'Average Weekly Temperature',
            style : {
                color : '#fff',
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
                text: 'Temperature °C',
                style : {
                    color : '#fff',
                }
            },
            labels: {
                style: {
                    color: "#FFF",
                }
            },
            gridLineColor : 'transparent',
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
        series: [{
            name: 'temperature',
            data: items,
            color: '#e0225b',
            lineWidth : 5
        },
    ]
    });
}

function createPressureChart(items) {

    Highcharts.chart('pressure', {
        chart: {
            type: 'area',
            backgroundColor : 'transparent',
        },
       
        title: {
            floating : false,
            align : 'left',
            text: 'Average Weekly Pressure',
            style : {
                color : '#fff',
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
                text: 'Pressure',
                style : {
                    color : '#fff',
                }
            },
            labels: {
                style: {
                    color: "#FFF",
                }
            },
            gridLineColor : 'transparent',
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
        series: [{
            name: 'pressure',
            data: items,
            color: 'darkred',
            lineWidth : 5
        },
    ]
    });
}