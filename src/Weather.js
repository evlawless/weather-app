import React from 'react';


class Weather extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			currentWeather: {},
			currentTemp: null
		}
		
	}
	
	componentDidMount(){
		const defaultLocation = "London, ON";
		const self = this;
		$.get('https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + defaultLocation +'")&format=json&env=store://datatables.org/alltableswithkeys', function(data) {
			let obj = data.query.results.channel.item.condition;
			
			self.setState({
				currentWeather: obj,
				currentTemp: obj.temp
			});

			console.log(obj);
		});
	}

	render() {
		return (
			<div>
				<h1>{this.state.currentTemp !== null && fToC(this.state.currentTemp).toFixed(1)}</h1>
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