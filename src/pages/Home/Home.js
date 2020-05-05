import React, { Component } from "react";
import CalendarItem from "./CalendarItem/CalendarItem";
import PropTypes from "prop-types";
import CreateCalendarForm from "../Home/CreateCalendarForm/CreateCalendarForm";
import classes from "../Home/Home.module.css";

class Home extends Component {
	componentDidMount() {
		this.props.getCalendars(this.props.match.params.userId);
	}

	render() {
		return (
			<div>
				{/* <Navbar/> */}
				<span>{this.props.match.params.userId}</span>
				<CreateCalendarForm createNewCalendar={this.props.createNewCalendar} />
				<div className={classes.calendarPreviewWrapper}>
					{this.props.calendars.map((calendar, key) => (
						<CalendarItem key={key} calendar={calendar} />
					))}
				</div>
			</div>
		);
	}
}

Home.propTypes = {
	getCalendars: PropTypes.func.isRequired,
	calendars: PropTypes.array.isRequired,
	createNewCalendar: PropTypes.func.isRequired,
};

export default Home;
