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
		this.handleSearchResultSelected = this.handleSearchResultSelected.bind(this);
	}

	handleUnitsChanged(event) {
		this.props.onUnitsChanged(event.target.value);
	}

	handleLocationChanged(event) {
		this.setState({
			location: event.target.value
		});

		if(event.target.value.length > 1) {
			this.props.onLocationChanged(event.target.value);
		}
	}

	handleLocationSearch(event) {
		this.props.onLocationChanged(this.state.location);
		event.preventDefault();
	}

	handleSearchResultSelected(event) {
		this.props.onSearchResultSelected(event.target.value);
		this.setState({
			location: ''
		});
	}

	render() {

		let searchResultsNoDuplicate = this.props.searchResults.filter((value, idx, self)=>{
			return self.indexOf(value) === idx;
		})

		let searchResults = searchResultsNoDuplicate.map((value, idx) => {
			return (
				<button className="list-group-item list-group-item-action"
					onClick={this.handleSearchResultSelected}
					key={value}
					value={value}
				>
					{value}
				</button>
			);
		});

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
						<div className="search-results list-group">
							{searchResults}
						</div>
					</form>
				</div>
				<div className="col-xs-12 col-md-3">
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
