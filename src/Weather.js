import React from 'react';

class Weather extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			location: "London, Ontario",
			lat: 42.9849,
			lng: 81.2453,
			loading: false,
			weatherData: {}
		};
		this.updateWeatherData = this.updateWeatherData.bind(this);
		this.updateWeatherData();
	}

	updateWeatherData() {
	}

	render() {
		const dayStyle = { border: "1px solid #000", margin: 5 };
		console.log(this.state.weatherData);

		return (
			<div className="container">
				<div className="row align-items-end">
					<h3>showing weather info for: </h3>
					&nbsp;
					<h1>{this.state.location}</h1>
				</div>
				<div className="row">
					<div>

					</div>
				</div>
				<div className="row my-5">
					<div className="col-xs-6">
						<div className="form-group">
							<div className="input-group">
								<div className="input-group-prepend">
									<span className="input-group-text" id="">Location</span>
								</div>
								<input id="location_input" className="form-control" type="text" value={this.state.location} />
								&nbsp;
								<button className="btn ">Update</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Weather;