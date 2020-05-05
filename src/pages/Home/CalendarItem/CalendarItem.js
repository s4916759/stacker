import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classes from "./CalendarItem.module.css";

class CalendarItem extends Component {
	goToCalendar = () => {
		const calendarId = this.props.calendar.id;
		this.props.history.push({
			pathname: `/calendar/${calendarId}`,
		});
	};
	render() {
		return (
			<ul
				className={classes.calendarItem}
				onClick={this.goToCalendar}
				style={{ backgroundColor: this.props.calendar.background }}>
				<li className={classes.calendarListItem}>
					{this.props.calendar.title}
				</li>
			</ul>
		);
	}
}

CalendarItem.propTypes = {
	calendar: PropTypes.object.isRequired,
};

export default withRouter(CalendarItem);
