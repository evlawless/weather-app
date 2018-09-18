import React from 'react';

class ForecastDay extends React.Component {
	
	render() {

		let tempMsg = this.props.temp !== undefined ? this.props.temp + String.fromCharCode(176) + this.props.tempUnits : "~";

		return (
			<div>
				<h1>{tempMsg}</h1>
			</div>
		);
	}
}

export default ForecastDay;
