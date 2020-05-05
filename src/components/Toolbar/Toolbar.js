import React, { Component } from "react";
import {
	AiOutlineCalendar,
	AiOutlineSetting,
	AiOutlineShareAlt,
	AiOutlineDelete,
	AiOutlineDown,
} from "react-icons/ai";
import { AuthConsumer } from "../../contexts/AuthContext";
import classes from "./Toolbar.module.css";

class Toolbar extends Component {
	state = {
		modalOpen: false,
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<div className={classes.toolbarContainer}>
						<div className={classes.toolbarIconWrapper}>
							<a
								className={classes.toolbarIconContainer}
								href={user.id ? `/${user.id}/calendars` : `/`}>
								<AiOutlineCalendar style={{ marginRight: "10px" }} /> All
								Calendars
							</a>
							<div className={classes.toolbarIconContainer}>
								<AiOutlineShareAlt style={{ marginRight: "10px" }} />
								Share
							</div>
						</div>
						<div className={classes.toolbarIconWrapper}>
							<div className={classes.toolbarIconContainer}>
								<AiOutlineSetting style={{ marginRight: "10px" }} /> Settings
							</div>
							<div className={classes.toolbarIconContainer}>
								<AiOutlineDown style={{ marginRight: "10px" }} /> Collapse All
							</div>
							<div
								className={classes.buttonDanger}
								onClick={this.props.deleteCalendar}>
								<AiOutlineDelete style={{ marginRight: "10px" }} /> Delete
								Calendar
							</div>
						</div>
					</div>
				)}
			</AuthConsumer>
		);
	}
}

export default Toolbar;
