import React, { Component } from "react";
import PropTypes from "prop-types";
import { AuthConsumer } from "../../../contexts/AuthContext";
import classes from "../../Home/CreateCalendarForm/CreateCalendarForm.module.css";

class CreateCalendarForm extends Component {
	state = {
		title: "",
		background: "#fff",
	};

	handleSubmit = (e, userId) => {
		e.preventDefault();
		const calendar = {
			title: this.state.title,
			background: this.state.background,
			createdAt: new Date(),
			user: userId,
		};
		if (calendar.title && calendar.background && calendar.user) {
			this.props.createNewCalendar(calendar);
		}
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<form
						className={classes.createCalendarFormWrapper}
						onSubmit={(e) => this.handleSubmit(e, user.id)}>
						<input
							type="text"
							name="name"
							placeholder="Enter Calendar Name"
							//Take the value from the input field for calendar name and set the state
							onChange={(e) => this.setState({ title: e.target.value })}
						/>
						{/* <select
							name="background"
							//Take the value from the dropdown for the calendar colour and set state
							onChange={(e) => this.setState({ background: e.target.value })}>
							<option value="#80ccff">Blue</option>
							<option value="#0cffaa">Green</option>
							<option value="#f94a1e">Red</option>
							<option value="#ffb3ff">Pink</option>
							<option value="#bf00ff">Purple</option>
							<option value="#fffff">White</option>
						</select> */}
						<button type="submit">Create new calendar</button>
					</form>
				)}
			</AuthConsumer>
			//Take user input for calendar name and colour in the home page
		);
	}
}

CreateCalendarForm.propTypes = {
	createNewCalendar: PropTypes.func.isRequired,
};

export default CreateCalendarForm;
