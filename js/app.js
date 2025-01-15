const lat = "16.9406159";
const lon = "97.3462055";

const key = "3e47c1570e1e6c8480182d878001cdf0";
const uri = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

fetch(uri)
    .then(response => response.json())
    .then(data => displayWeatherData(data))
    .catch(err => console.log(err));

function displayWeatherData(data) {
    const humidityData = data.list.map(item => ([
        item.dt * 1000,
        item.main.humidity
    ]));

    createHighcharts(humidityData);
}

function createHighcharts(items) {

    const chart = Highcharts.chart('humidity', {
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