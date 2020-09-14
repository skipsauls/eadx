'use strict';

    var UPDATE = false;

    var DATA_COUNT = 16;
    var MIN_XY = -150;
    var MAX_XY = 100;

    var utils = Samples.utils;

    utils.srand(110);

    function colorize(opaque, context) {
        var value = context.dataset.data[context.dataIndex];
        var x = value.x / 100;
        var y = value.y / 100;
        var r = x < 0 && y < 0 ? 250 : x < 0 ? 150 : y < 0 ? 50 : 0;
        var g = x < 0 && y < 0 ? 0 : x < 0 ? 50 : y < 0 ? 150 : 250;
        var b = x < 0 && y < 0 ? 0 : x > 0 && y > 0 ? 250 : 150;
        var a = opaque ? 1 : 0.5 * value.v / 1000;

        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    function generateData() {
        var data = [];
        var i;

        for (i = 0; i < DATA_COUNT; ++i) {
            data.push({
                x: utils.rand(MIN_XY, MAX_XY),
                y: utils.rand(MIN_XY, MAX_XY),
                v: utils.rand(0, 1000)
            });
        }

        return data;
    }

    var data = {
        datasets: [{
            data: generateData()
        }, {
            data: generateData()
        }]
    };

    var options = {
        aspectRatio: 1,
        legend: false,
        tooltips: false,

        elements: {
            point: {
                backgroundColor: colorize.bind(null, false),

                borderColor: colorize.bind(null, true),

                borderWidth: function(context) {
                    return Math.min(Math.max(1, context.datasetIndex + 1), 8);
                },

                hoverBackgroundColor: 'transparent',

                hoverBorderColor: function(context) {
                    return utils.color(context.datasetIndex);
                },

                hoverBorderWidth: function(context) {
                    var value = context.dataset.data[context.dataIndex];
                    return Math.round(8 * value.v / 1000);
                },

                radius: function(context) {
                    var value = context.dataset.data[context.dataIndex];
                    var size = context.chart.width;
                    var base = Math.abs(value.v) / 1000;
                    return (size / 24) * base;
                }
            }
        }
    };



    // eslint-disable-next-line no-unused-vars
    function randomize() {
        chart.data.datasets.forEach(function(dataset) {
            dataset.data = generateData();
        });
        chart.update();
    }

    // eslint-disable-next-line no-unused-vars
    /*
    function addDataset() {
        chart.data.datasets.push({
            data: generateData()
        });
        chart.update();
    }
    */

    // eslint-disable-next-line no-unused-vars
    function removeDataset() {
        chart.data.datasets.shift();
        chart.update();
    }

let chart = null;

// Deep merge utility function
var extend = function () {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
	    deep = arguments[0];
	    i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[prop] = extend(extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return extended;

};

function initDemo() {

    chart = new Chart('chart-0', {
        type: 'bubble',
        data: data,
        options: options
    });    
}

// Chart API to Expose to Lightning
function setChartType(type) {
    console.warn('demo.js setChartType');
    chart.config.type = type;
    chart.update();
}

function addDataset(data) {
    console.warn('demo.js addDataset: ', data);
    chart.data.datasets.push({
        data: data
    });
    chart.update();
}

function setChartOptions(options) {
    console.warn('demo.js setChartOptions: ', options);
    chart.options = extend(true, chart.options, options);
    //chart.options = options;
    chart.update();
}

function getChartOptions() {
    console.warn('demo.js getChartOptions');
    console.warn('returning chart.options: ', chart.options);
    return chart.options;
}

function getChartData() {
    console.warn('demo.js getChartData');
    return chart.data;
}

var padding = "12435124512462asfvafvwfvefvewfgvwergv35634567345fsfwefwerfg267245745678567896789567456372531443575496790578647wergwefgwerg362531534256346585678976057867845364562354623547346578568790769067586749356475243646";