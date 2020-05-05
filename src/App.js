import React, { Component } from "react";
// import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import Home from "./pages/Home/Home";
import { calendarsRef, rowsRef, cardsRef } from "./firebase";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import AuthProvider from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navigation/Navbar";

class App extends Component {
	state = {
		calendars: [],
	};

	getCalendars = async (userId) => {
		try {
			//get the calendars from firebase but only once - this doesn't listen to changes
			const calendars = await calendarsRef
				.where("calendar.user", "==", userId)
				.get();
			calendars.forEach((calendar) => {
				const data = calendar.data().calendar;
				const calendarObj = {
					id: calendar.id,
					...data,
				};
				this.setState({ calendars: [...this.state.calendars, calendarObj] });
			});
		} catch (error) {
			console.log("Error getting calendars", error);
		}
	};

	// async function to wait until the calendar has been added to firestore as I need the ID before
	createNewCalendar = async (calendar) => {
		try {
			const newCalendar = await calendarsRef.add({ calendar });
			const calendarObj = {
				id: newCalendar.id,
				...calendar,
			};
			this.setState({ calendars: [...this.state.calendars, calendarObj] });
		} catch (error) {
			console.error("Error creating new calendar: ", error);
		}
	};

	deleteRow = async (rowId) => {
		try {
			const cards = await cardsRef.where("card.rowId", "==", rowId).get();
			//check if any cards came back from firestore
			if (cards.docs.length !== 0) {
				cards.forEach((card) => {
					card.ref.delete();
				});
			}
			const row = await rowsRef.doc(rowId);
			row.delete();
		} catch (error) {
			console.error("Error deleting rows: ", error);
		}
	};

	//delete calendar
	deleteCalendar = async (calendarId) => {
		try {
			//filter out all of the rows where the calendar poperty which is the calendar we passed in
			const rows = await rowsRef.where("row.calendar", "==", calendarId).get();
			//this is a problem where I can't delete calendars where theres thing
			if (rows.docs.length !== 0) {
				rows.forEach((row) => {
					this.deleteRow(row.ref.id);
				});
			}

			const calendar = await calendarsRef.doc(calendarId);

			this.setState({
				calendar: [
					...this.state.calendars.filter((calendar) => {
						// don't render out the calendars with the calendars Id that has been deleted
						return calendar.id !== calendarId;
					}),
				],
			});

			calendar.delete();
		} catch (error) {
			console.log("error deleting calendar: ", error);
		}
	};

	updateCalendar = async (calendarId, newTitle) => {
		try {
			const calendar = await calendarsRef.doc(calendarId);
			calendar.update({ "calendar.title": newTitle });
		} catch (error) {
			console.error("Error updating calendar", error);
		}
	};

	render() {
		return (
			<div>
				<BrowserRouter>
					<AuthProvider>
						<Navbar />
						<Switch>
							<Route exact path="/" component={Login}></Route>
							<Route
								//Dynamic routing for each specific user. UserId passed as a URL parameter
								exact
								path="/:userId/calendars"
								//Go to react-dev-tools and inspect match() to find the passed userID value. This is used to render calendars based on user.
								render={(props) => (
									<Home
										{...props}
										getCalendars={this.getCalendars}
										calendars={this.state.calendars}
										createNewCalendar={this.createNewCalendar}
									/>
								)}
							/>

							{/*This renders the calendar in the browser based on its ID*/}
							<Route
								path="/calendar/:calendarId"
								render={(props) => (
									<Calendar
										{...props}
										deleteCalendar={this.deleteCalendar}
										deleteRow={this.deleteRow}
										updateCalendar={this.updateCalendar}
									/>
								)}
							/>

							{/* This is to prevent calendar not found being displayed even with /calendar as there is a slash there*/}
							<Route component={PageNotFound} />
						</Switch>
					</AuthProvider>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
