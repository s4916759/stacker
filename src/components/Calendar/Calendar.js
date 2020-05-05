import React, { Component } from "react";
import Row from "../Row/Row";
import PropTypes from "prop-types";
import { calendarsRef, rowsRef } from "../../firebase";
import { AuthConsumer } from "../../contexts/AuthContext";
import Toolbar from "../Toolbar/Toolbar";
import Aux from "../Hoc/Aux";
import classes from "./Calendar.module.css";

class Calendar extends Component {
	state = {
		currentCalendar: {},
		currentRows: [],
		message: "",
	};

	addCalendarInput = React.createRef();

	componentDidMount() {
		this.getCalendar(this.props.match.params.calendarId);
		this.getRows(this.props.match.params.calendarId);
	}

	getRows = async (calendarId) => {
		try {
			await rowsRef
				.where("row.calendar", "==", calendarId)
				.onSnapshot((snapshot) => {
					snapshot.docChanges().forEach((change) => {
						if (change.type === "added") {
							const doc = change.doc;
							const row = {
								id: doc.id,
								title: doc.data().row.title,
							};
							this.setState({
								currentRows: [...this.state.currentRows, row],
							});
						}
						if (change.type === "removed") {
							this.setState({
								currentRows: [
									...this.state.currentRows.filter((row) => {
										return row.id !== change.doc.id;
									}),
								],
							});
						}
					});
				});
		} catch (error) {
			console.log("Error fetching rows:", error);
		}
	};

	getCalendar = async (calendarId) => {
		try {
			const calendar = await calendarsRef.doc(calendarId).get();
			this.setState({ currentCalendar: calendar.data().calendar });
		} catch (error) {
			this.setState({
				message: "Calendar not found...",
			});
		}
	};

	createNewRow = async (e, userId) => {
		try {
			e.preventDefault();
			const row = {
				title: this.addCalendarInput.current.value,
				calendar: this.props.match.params.calendarId,
				createdAt: new Date(),
				user: userId,
			};

			if (row.title && row.calendar) {
				await rowsRef.add({ row });
			}
			this.addCalendarInput.current.value = "";
		} catch (error) {
			console.error("Error creating a new row", error);
		}
	};

	deleteCalendar = async () => {
		const calendarId = this.props.match.params.calendarId;
		this.props.deleteCalendar(calendarId);
		this.setState({
			message: "Calendar not found...",
		});
	};

	updateCalendar = (e) => {
		//Get the calendar idea from the URL parameters
		const calendarId = this.props.match.params.calendarId;
		const newTitle = e.currentTarget.value;

		if (calendarId && newTitle) {
			this.props.updateCalendar(calendarId, newTitle);
		}
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<React.Fragment>
						{user.id === this.state.currentCalendar.user ? (
							<div
								className={classes.calendarWrapper}
								style={{
									backgroundColor: this.state.currentCalendar.background,
								}}>
								{this.state.message === "" ? (
									<Aux>
										<Toolbar deleteCalendar={this.deleteCalendar} />
										<div className={classes.calendarHeader}>
											<input
												className={classes.calendarHeaderInput}
												type="text"
												name="calendarTitle"
												onChange={this.updateCalendar}
												defaultValue={this.state.currentCalendar.title}></input>
										</div>
									</Aux>
								) : (
									<h2 className={classes.calendarWrapperTitle}>
										{this.state.message}
									</h2>
								)}
								<div className={classes.rowsWrapper}>
									{Object.keys(this.state.currentRows).map((key) => (
										<Row
											key={this.state.currentRows[key].id}
											row={this.state.currentRows[key]}
											deleteRow={this.props.deleteRow}
										/>
									))}
								</div>
								{/* New row button */}
								<form onSubmit={(e) => this.createNewRow(e, user.id)}>
									<input
										className={classes.newRowWrapperInput}
										type={this.state.message === "" ? "text" : ""}
										name="name"
										ref={this.addCalendarInput}
										placeholder="+ New Row"></input>
								</form>
							</div>
						) : (
							<span></span>
						)}
					</React.Fragment>
				)}
			</AuthConsumer>
		);
	}
}

Calendar.propTypes = {
	deleteCalendar: PropTypes.func.isRequired,
	deleteRow: PropTypes.func.isRequired,
	updateCalendar: PropTypes.func.isRequired,
};

export default Calendar;
