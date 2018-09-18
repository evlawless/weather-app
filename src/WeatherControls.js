import React from 'react';

class WeatherControls extends React.Component {

	constructor(props) {
		super(props);

		this.handleUnitsChanged = this.handleUnitsChanged.bind(this);
		this.handleLocationChanged = this.handleLocationChanged.bind(this);
	}

	handleUnitsChanged(event) {
		this.props.onUnitsChanged(event.target.value);
	}

	handleLocationChanged(event) {
		this.props.onLocationChanged(event.target.value);
	}

	render() {

		return (
			<div>
				<div>
					<select value={this.props.currentUnits} onChange={this.handleUnitsChanged}>
						<option value="C">Celsius</option>
						<option value="F">Fahrenheit</option>
					</select>
				</div>
				<div>
					<input type="text" value={this.props.location} onChange={this.handleLocationChanged} />
				</div>
			</div>
		);
	}
}

export default WeatherControls;
