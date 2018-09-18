import React from "react";

class ForecastDay extends React.Component {
	render() {
		let tempMsg =
			this.props.temp !== undefined
				? this.props.temp + String.fromCharCode(176) + this.props.tempUnits
				: "~";
		let statusMargins = {
			margin: 0,
			marginLeft: 10
		};

		return (
			<div className="forecast-day container">
				<p className="forecast-date">{this.props.date}</p>
				<div className="forecast-temp">
					<h1>{tempMsg}</h1>
				</div>
				<div className="forecast-weather-type">
					{/* <img src={this.props.iconSrc} height="32" /> */}
					<p>{this.props.weatherType}</p>
				</div>
			</div>
		);
	}
}

export default ForecastDay;
