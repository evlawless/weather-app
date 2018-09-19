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
			<div className="forecast-day">
				<div className="forecast-date-outer">
					<div className="forecast-day-of-week">{this.props.weekDay}</div>
					<div className="forecast-date">{this.props.date}</div>
				</div>
				<div className="forecast-temp">
					{tempMsg}
				</div>
				<div className="forecast-weather-type">
					<div>{this.props.weatherType}</div>
				</div>
			</div>
		);
	}
}

export default ForecastDay;
