import React from "react";

class WeatherControls extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			location: ""
		};

		this.handleUnitsChanged = this.handleUnitsChanged.bind(this);
		this.handleLocationChanged = this.handleLocationChanged.bind(this);
		this.handleLocationSearch = this.handleLocationSearch.bind(this);
	}

	handleUnitsChanged(event) {
		this.props.onUnitsChanged(event.target.value);
	}

	handleLocationChanged(event) {
		this.setState({
			location: event.target.value
		});
	}

	handleLocationSearch(event) {
		this.props.onLocationChanged(this.state.location);
		event.preventDefault();
	}

	render() {
		return (
			<div className="row">
				<div className="col-xs-12 col-md-3">
					<form onSubmit={this.handleLocationSearch}>
						<div className="input-group mb-3">
							<input
								placeholder="location"
								id="location-input"
								className="form-control"
								type="text"
								value={this.state.location}
								onChange={this.handleLocationChanged}
							/>
							<div className="input-group-append">
								<input
									type="submit"
									value="search"
									className="btn input-group-btn"
								/>
							</div>
						</div>
					</form>

					<select
						className="form-control"
						value={this.props.currentUnits}
						onChange={this.handleUnitsChanged}
					>
						<option value="C">Celsius</option>
						<option value="F">Fahrenheit</option>
					</select>
				</div>
			</div>
		);
	}
}

export default WeatherControls;
