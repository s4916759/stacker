import React, { Component } from "react";
import PropTypes from "prop-types";
import { cardsRef } from "../../firebase";
import UploadCardAssetmodal from "./CardAsset/UploadCardAssetModal/UploadCardAssetModal";
import TextareaAutosize from "react-autosize-textarea";
import { AiOutlineForm, AiOutlineDelete } from "react-icons/ai";
import Aux from "../Hoc/Aux";
import classes from "./Card.module.css";

class Card extends Component {
	state = {
		isModalOpen: false,
	};

	toggleModal = () => {
		this.setState({ modalOpen: !this.state.modalOpen });
	};

	deleteCard = async (e) => {
		try {
			e.preventDefault();
			const cardId = this.props.cardData.id;
			const card = await cardsRef.doc(cardId);
			card.delete();
		} catch (error) {
			console.error("problem deleting card", error);
		}
	};

	updateCardTitle = async (e) => {
		try {
			const cardId = this.props.cardData.id;
			const newTitle = e.currentTarget.value;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.text": newTitle,
			});
		} catch (error) {
			console.log("Error updating card title: ", error);
		}
	};

	updateCardBody = async (e) => {
		try {
			const cardId = this.props.cardData.id;
			const newBody = e.currentTarget.value;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.body": newBody,
			});
		} catch (error) {
			console.log("Error updating card body:", error);
		}
	};

	toggleAssetUploadModal = () => {
		this.setState({ isModalOpen: !this.state.isModalOpen });
	};

	render() {
		return (
			<Aux>
				<div className={classes.cardContainer}>
					<div className={classes.cardHeader}>
						<TextareaAutosize
							className={classes.cardHeaderInput}
							defaultValue={this.props.cardData.text}
							onChange={this.updateCardTitle}
							name="title"></TextareaAutosize>
						<div>
							<AiOutlineDelete
								onClick={this.deleteCard}
								style={{ marginRight: "5px", cursor: "pointer" }}
							/>
							<AiOutlineForm
								onClick={this.toggleModal}
								style={{ cursor: "pointer" }}
							/>
						</div>
					</div>

					<div
						className={classes.cardAsset}
						onClick={this.toggleAssetUploadModal}>
						Click to upload
					</div>

					<div className={classes.cardTextWrapper}>
						<textarea
							className={classes.cardBodyText}
							placeholder="Enter post copy..."
							defaultValue={this.props.cardData.body}
							onChange={this.updateCardBody}
							type="text"
							name="body"></textarea>
					</div>
				</div>

				<UploadCardAssetmodal
					modalOpen={this.state.isModalOpen}
					toggleModal={this.toggleAssetUploadModal}
					cardData={this.props.data}
				/>
			</Aux>
		);
	}
}

Card.propTypes = {
	cardData: PropTypes.object.isRequired,
};

export default Card;
