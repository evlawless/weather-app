import React from 'react';

class ForecastDay extends React.Component {
	
	render() {
		return (
			<div>
				<h1>{this.props.temp}&deg;</h1>
			</div>
		);
	}
}

export default ForecastDay;
