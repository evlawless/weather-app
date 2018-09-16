import React from 'react';

function kToC(deg) {
	return deg - 273.15;
}

function cToF(deg) {
	return (deg * 1.8 + 32);
}

function kToF(deg) {
	return cToF(kToC(deg));
}

function cToK(deg) {
	return deg + 273.15;
}

function fToC(deg) {
	return (deg - 32) * (5 / 9);
}

function fToK(deg) {
	return cToK(fToC(deg));
}

class Weather extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			location: "London, Ontario",
			loading: false,
			tempInfo: {},
			weatherInfo: {}
		};
		this.updateWeatherData = this.updateWeatherData.bind(this);

		this.locationChanged = this.locationChanged.bind(this);
	}

	componentDidMount() {
		this.updateWeatherData();
	}

	updateWeatherData() {
		const weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=London,CA&APPID=4708f504fd0931e98f15cc60ffc5cabe";
		const forecasturl = "https://api.openweathermap.org/data/2.5/forecast?q=London,CA&APPID=4708f504fd0931e98f15cc60ffc5cabe";
		const self = this;

		$.getJSON([weatherurl], function (wdata) {
			console.log(wdata);
		
			self.setState({
				tempInfo: wdata.main,
				weatherInfo: wdata.weather
			});
		});
		
	}

	locationChanged(event) {

	}

	render() {

		return (
			<div className="container weather-app">
				<div className="row align-items-end">

					<h3>current weather for {this.state.location}</h3>
				</div>
				<div className="row">
					<div className="col">Current Temp: {this.state.tempInfo.temp && kToC(this.state.tempInfo.temp).toFixed()}</div>
					<div className="col">Today's High: {this.state.tempInfo.temp_max && kToC(this.state.tempInfo.temp_max).toFixed()}</div>
					<div className="col">Today's low: {this.state.tempInfo.temp_min && kToC(this.state.tempInfo.temp_min).toFixed()}</div>
				</div>

				
			</div>
		);
	}
}

class ForecastDay extends React.Component {
	
	render() {
		return (
			<div>
				<h1>this.props.temperature</h1>
				<p>
					{this.props.high != null && this.props.high}<br/>
					{this.props.low != null && this.props.low}
				</p>
			</div>
		);
	}
}

export default Weather;