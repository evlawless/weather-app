import React from 'react';
import ForecastDay from './ForecastDay';
import WeatherControls from './WeatherControls';


class Weather extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			currentWeather: {},
			tempUnits: 'C',
			location: 'London, ON',
			loc2: 'London, ON',
			currentWeatherIconSrc: '',
			forecast: []
		}
		this.handleUnitsChanged = this.handleUnitsChanged.bind(this);
		this.handleLocationChanged = this.handleLocationChanged.bind(this);
	}

	componentDidMount() {
		this.updateTemp();
	}

	updateTemp() {
		const self = this;
		$.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + self.state.location + '")&format=json&env=store://datatables.org/alltableswithkeys', function (data) {
			// console.log(data);
			let weatherData = data.query.results.channel.item.condition;

			let iconSrc = "http://l.yimg.com/a/i/us/we/52/" + weatherData.code + ".gif"

			self.setState({
				currentWeather: weatherData,
				currentWeatherIconSrc: iconSrc,
				forecast: data.query.results.channel.item.forecast
			});
		});
	}

	handleUnitsChanged(units) {
		this.setState({
			tempUnits: units
		});
	}

	handleLocationChanged(location) {
		let self = this;

		// TODO: make this do something
		self.setState({
			loc2: location
		});

	}

	render() {
		let self = this;

		let convertedTemp = this.state.currentWeather.temp;
		if (this.state.tempUnits == 'C' && convertedTemp != undefined) {
			convertedTemp = fToC(this.state.currentWeather.temp).toFixed();
		}

		const forecastDays = this.state.forecast.map((value, idx) => {
			if (idx < 6 && idx != 0) {
				let forecastConvertedTemp = (parseFloat(value.high) + parseFloat(value.low)) / 2;
				let iconSrc = "http://l.yimg.com/a/i/us/we/52/" + value.code + ".gif";

				if (self.state.tempUnits == 'C' && forecastConvertedTemp != undefined) {
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
						/>
					</div>
				);
			}
		});

		return (
			<div className="container">
			<h2>Current weather</h2>
				<div className="forecast-today">
					<ForecastDay
						date="today"
						temp={convertedTemp}
						tempUnits={this.state.tempUnits}
						weatherType={this.state.currentWeather.text}
						iconSrc={this.state.currentWeatherIconSrc} />
				</div>
				<div className="row">
					<h2>Five day forecast</h2>
				</div>
				<div className="row forecast-five-day">
					{forecastDays}
				</div>
				<WeatherControls
					location={this.state.loc2}
					currentUnits={this.state.tempUnits}
					onUnitsChanged={this.handleUnitsChanged}
					onLocationChanged={this.handleLocationChanged} />
				<br />
				<a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/purple.png" width="134" height="29" /> </a>

			</div>
		);
	}
}

function kToC(deg) {
	return parseFloat(deg) - 273.15;
}

function cToF(deg) {
	return (parseFloat(deg) * 1.8 + 32);
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

export default Weather;