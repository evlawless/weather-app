import React from "react";
import ForecastDay from "./ForecastDay";
import WeatherControls from "./WeatherControls";

class Weather extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentWeather: {},
			tempUnits: "C",
			location: "London, ON",
			currentWeatherIconSrc: "",
			forecast: [],
			searchResults: ['']
		};
		this.handleUnitsChanged = this.handleUnitsChanged.bind(this);
		this.handleLocationChanged = this.handleLocationChanged.bind(this);
		this.handleSearchResultSelected = this.handleSearchResultSelected.bind(this);
	}

	componentDidMount() {
		this.updateTemp();
	}

	updateTemp() {
		const self = this;
		$.get(
			'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' +
			self.state.location +
			'")&format=json&env=store://datatables.org/alltableswithkeys',
			function (data) {
				// console.log(data);
				let weatherData = data.query.results.channel.item.condition;

				let iconSrc =
					"http://l.yimg.com/a/i/us/we/52/" + weatherData.code + ".gif";

				self.setState({
					currentWeather: weatherData,
					currentWeatherIconSrc: iconSrc,
					forecast: data.query.results.channel.item.forecast
				});
			}
		);
	}

	handleUnitsChanged(units) {
		this.setState({
			tempUnits: units
		});
	}

	handleLocationChanged(location) {
		let self = this;

		$.ajax(
			'https://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text="' +
			location +
			'"&format=json&env=store://datatables.org/alltableswithkeys',
			{
				accepts: "application/json",

				success: function (data) {
					// console.log(data);
					if (data.query.count === 1) {
						self.setState({
							location: location
						});
						self.updateTemp();
					} else if(data.query.count > 1) {
						let results = data.query.results.place.map((value, idx) => {
							return value.name + ', ' + value.admin1.content;
						});

						results.sort((a, b)=>{
							// console.log(location)
							// console.log( b + ":" + similarity(b, location));
							// console.log( a + ":" + similarity(a, location));
							return similarity(b.toLowerCase(), location.toLowerCase()) - similarity(a.toLowerCase(), location.toLowerCase());
						});

						self.setState({
							searchResults: results
						});
					}
				},
				error(jqXHR, textStatus, error) {
					self.setState({
						searchResults: []
					});
				}
			}
		);
	}

	handleSearchResultSelected(value) {
		this.setState({
			location: value,
			searchResults: []
		});
		this.updateTemp();
	}

	render() {
		let self = this;

		let convertedTemp = this.state.currentWeather.temp;
		if (this.state.tempUnits == "C" && convertedTemp != undefined) {
			convertedTemp = fToC(this.state.currentWeather.temp).toFixed();
		}

		const forecastDays = this.state.forecast.map((value, idx) => {
			if (idx < 6 && idx != 0) {
				let forecastConvertedTemp =
					(parseFloat(value.high) + parseFloat(value.low)) / 2;
				let iconSrc = "http://l.yimg.com/a/i/us/we/52/" + value.code + ".gif";

				if (self.state.tempUnits == "C" && forecastConvertedTemp != undefined) {
					forecastConvertedTemp = fToC(forecastConvertedTemp).toFixed();
				}
				return (
					<div className="col" key={value.date}>
						<ForecastDay
							temp={forecastConvertedTemp}
							tempUnits={self.state.tempUnits}
							weatherType={value.text}
							iconSrc={iconSrc}
							date={value.date}
							weekDay={value.day}
						/>
					</div>
				);
			}
		});

		return (
			<div className="container">

				<div className="row">
					<h3>Weather for {this.state.location}</h3>
				</div>
				<div className="forecast-today">
					<ForecastDay
						date="today"
						temp={convertedTemp}
						tempUnits={this.state.tempUnits}
						weatherType={this.state.currentWeather.text}
						iconSrc={this.state.currentWeatherIconSrc}
					/>
				</div>
				<br />
				<br />
				<div className="row">
					<h3>Five day forecast</h3>
				</div>
				<div className="row forecast-five-day">{forecastDays}</div>
				<br />
				<br />

				<div>
					<WeatherControls
						location={this.state.loc2}
						currentUnits={this.state.tempUnits}
						onUnitsChanged={this.handleUnitsChanged}
						onLocationChanged={this.handleLocationChanged}
						searchResults={this.state.searchResults}
						onSearchResultSelected={this.handleSearchResultSelected}
					/>
				</div>
				<br />
				<a href="https://www.yahoo.com/?ilc=401" target="_blank">
					<img
						src="https://poweredby.yahoo.com/purple.png"
						width="134"
						height="29"
					/>
				</a>
			</div>
		);
	}
}

function kToC(deg) {
	return parseFloat(deg) - 273.15;
}

function cToF(deg) {
	return parseFloat(deg) * 1.8 + 32;
}

function kToF(deg) {
	return cToF(kToC(deg));
}

function cToK(deg) {
	return parseFloat(deg) + 273.15;
}

function fToC(deg) {
	return (parseFloat(deg) - 32) * (5 / 9);
}

function fToK(deg) {
	return cToK(fToC(parseFloat(deg)));
}

// FROM https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
// THANKS

export function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

export default Weather;
