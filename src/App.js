import React, { Component } from "react";
import "./App.css";
import Weather from "./Weather";
import {hot} from "react-hot-loader";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Weather />
			</div>
		);
	}
}

export default hot(module)(App);