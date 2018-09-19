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
					} else if (data.query.count > 1) {
						let results = data.query.results.place.map((value, idx) => {
							return value.name + ', ' + value.admin1.content;
						});

						results.sort((a, b) => {
							return similar_text(b.toLowerCase(), location.toLowerCase()) - similar_text(a.toLowerCase(), location.toLowerCase());
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

function similar_text(first, second) {
	// Calculates the similarity between two strings  
	// discuss at: http://phpjs.org/functions/similar_text

	if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
		return 0;
	}

	first += '';
	second += '';

	var pos1 = 0,
		pos2 = 0,
		max = 0,
		firstLength = first.length,
		secondLength = second.length,
		p, q, l, sum;

	max = 0;

	for (p = 0; p < firstLength; p++) {
		for (q = 0; q < secondLength; q++) {
			for (l = 0;
				(p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
			if (l > max) {
				max = l;
				pos1 = p;
				pos2 = q;
			}
		}
	}

	sum = max;

	if (sum) {
		if (pos1 && pos2) {
			sum += similar_text(first.substr(0, pos2), second.substr(0, pos2));
		}

		if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
			sum += similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
		}
	}

	return sum;
}


export default Weather;
