import React, { Component } from "react";
import {hot} from "react-hot-loader";
import "./App.css";
import Weather from "./Weather";

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