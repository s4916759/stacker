import React, { Component } from "react";
import PropTypes from "prop-types";
import Card from "../Card/Card";
import { cardsRef, rowsRef } from "../../firebase";
import { AuthConsumer } from "../../contexts/AuthContext";
import { AiOutlineDelete } from "react-icons/ai";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classes from "../Row/Row.module.css";

class Row extends Component {
	state = {
		currentCards: [],
	};

	componentDidMount() {
		this.fetchCards(this.props.row.id);
	}

	fetchCards = async (rowId) => {
		try {
			await cardsRef.where("card.rowId", "==", rowId).onSnapshot((snapshot) => {
				snapshot.docChanges().forEach((change) => {
					const doc = change.doc;
					const card = {
						id: doc.id,
						text: doc.data().card.text,
						body: doc.data().card.body,
						labels: doc.data().card.labels,
					};
					if (change.type === "added") {
						this.setState({
							currentCards: [...this.state.currentCards, card],
						});
					}
					if (change.type === "removed") {
						this.setState({
							currentCards: [
								...this.state.currentCards.filter((card) => {
									return card.id !== change.doc.id;
								}),
							],
						});
					}
					if (change.type === "modified") {
						const index = this.state.currentCards.findIndex((item) => {
							return item.id === change.doc.id;
						});

						const cards = [...this.state.currentCards];
						cards[index] = card;
						this.setState({ currentCards: cards });
					}
				});
			});
		} catch (error) {
			console.log("Error fetching cards", error);
		}
	};

	nameInput = React.createRef();

	createNewCard = async (e, userId) => {
		try {
			e.preventDefault();
			// This is where the card gets made, update it to have the image element as well
			const card = {
				text: this.nameInput.current.value,
				body: "",
				rowId: this.props.row.id,
				labels: [],
				createdAt: new Date(),
				user: userId,
			};
			//check if the text and id exist first
			if (card.text && card.rowId) {
				await cardsRef.add({ card });
			}
			this.nameInput.current.value = "";
			console.log("new card added " + card.text);
		} catch (error) {
			console.error("Error creating new card", error);
		}
	};

	deleteRow = () => {
		const rowId = this.props.row.id;
		this.props.deleteRow(rowId);
	};

	updateRow = async (e) => {
		try {
			const rowId = this.props.row.id;
			const newTitle = e.currentTarget.value;
			const row = await rowsRef.doc(rowId);
			row.update({ "row.title": newTitle });
		} catch (error) {
			console.error("Error updating row: ", error);
		}
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<div className={classes.rowContainer}>
						<ExpansionPanel className={classes.expansionWrapper}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
								className="expansion-summary-override">
								<div className={classes.rowHeader}>
									<input
										className={classes.rowHeaderInput}
										type="text"
										name="rowTitle"
										onChange={this.updateRow}
										defaultValue={this.props.row.title}></input>
									<AiOutlineDelete
										onClick={this.deleteRow}
										style={{ cursor: "pointer" }}
									/>
								</div>
							</ExpansionPanelSummary>
							{/* Map through the cards and display them as card components*/}
							<div className={classes.rowWrapper}>
								{Object.keys(this.state.currentCards).map((key) => (
									<Card key={key} cardData={this.state.currentCards[key]} />
								))}
								{/* Add new card input*/}
								<form onSubmit={(e) => this.createNewCard(e, user.id)}>
									<input
										className={classes.newCardInput}
										type="text"
										ref={this.nameInput}
										name="name"
										placeholder=" + new card"></input>
								</form>
							</div>
						</ExpansionPanel>
					</div>
				)}
			</AuthConsumer>
		);
	}
}

Row.propTypes = {
	row: PropTypes.object.isRequired,
	deleteRow: PropTypes.func.isRequired,
};

export default Row;
