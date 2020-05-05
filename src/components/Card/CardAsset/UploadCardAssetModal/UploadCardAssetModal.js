import React from "react";
//import { cardsRef } from "../../../firebase";
import PropTypes from "prop-types";
import classes from "../UploadCardAssetModal/UploadCardAssetModal.module.css";

class UploadCardAssetModal extends React.Component {
	// uploadAssets = async (e) => {
	// 	try {
	// 		e.preventDefault();
	// 		const cardId = this.props.cardData.id;
	// 		// const newCardAssets = this.input.current.value;
	// 		const card = await cardsRef.doc(cardId);
	// 		card.update({
	// 			"card.assets": newText,
	// 		});
	// 		this.props.toggleModal();
	// 	} catch (error) {
	// 		console.error("Error updating card: ", error);
	// 	}
	// };

	render() {
		return (
			<div
				className={classes.modalWrapper}
				style={{ display: this.props.modalOpen ? "block" : "none" }}>
				<div className={classes.modalBody}>
					<form onSubmit={this.uploadAssets}>
						<div>
							<span
								className={classes.modalClose}
								onClick={this.props.toggleModal}>
								&times;
							</span>
						</div>
						<button type="submit" onClick={this.props.toggleModal}>
							Upload
						</button>
					</form>
				</div>
			</div>
		);
	}
}

UploadCardAssetModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	toggleModal: PropTypes.func.isRequired,
	// cardData: PropTypes.object.isRequired,
};

export default UploadCardAssetModal;
