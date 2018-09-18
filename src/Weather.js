import React from 'react';
import ForecastDay from './ForecastDay';
import WeatherControls from './WeatherControls';


class Weather extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			currentWeather: {},
			currentTemp: null,
			tempUnits: 'C',
			location: 'London, ON',
			loc2: 'London, ON'
		}
		this.handleUnitsChanged = this.handleUnitsChanged.bind(this);
		this.handleLocationChanged = this.handleLocationChanged.bind(this);
	}

	componentDidMount() {
		this.updateTemp();
	}

	updateTemp() {
		const self = this;
		$.get('https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + self.state.location + '")&format=json&env=store://datatables.org/alltableswithkeys', function (data) {
			let weatherData = data.query.results.channel.item.condition;

			self.setState({
				currentWeather: weatherData
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
		$.get('https://query.yahooapis.com/v1/public/yql?q=select * from geo.places(1) where text="' + location + '"&format=json&env=store://datatables.org/alltableswithkeys', function (data) {
			console.log(data);

			self.setState({
				loc2: location
			});
		});
	}

	render() {
		let convertedTemp = this.state.currentWeather.temp;
		if (this.state.tempUnits == 'C' && convertedTemp != undefined) {
			convertedTemp = fToC(this.state.currentWeather.temp);
		}

		return (
			<div>
				<ForecastDay temp={convertedTemp} tempUnits={this.state.tempUnits} />
				<WeatherControls
					location={this.state.loc2}
					currentUnits={this.state.tempUnits}
					onUnitsChanged={this.handleUnitsChanged}
					onLocationChanged={this.handleLocationChanged} />
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