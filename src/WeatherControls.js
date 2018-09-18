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
			<div className="row">
				<div className="col-xs-12 col-md-3">
					<input id="location-input" className="form-control mb-3" type="text" value={this.props.location} onChange={this.handleLocationChanged} />
					<select className="form-control" value={this.props.currentUnits} onChange={this.handleUnitsChanged}>
						<option value="C">Celsius</option>
						<option value="F">Fahrenheit</option>
					</select>
				</div>
			</div>
		);
	}
}

export default WeatherControls;
