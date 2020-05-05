import React, { Component } from "react";
import { AuthConsumer } from "../../contexts/AuthContext";
import classes from "../Login/Login.module.css";

class UserForm extends Component {
	emailInput = React.createRef();
	passwordInput = React.createRef();

	redirect = (userId) => {
		this.props.history.push(`/${userId}/calendars`);
	};

	render() {
		return (
			<AuthConsumer>
				{({ signUp, logIn, user, authMessage }) => (
					<React.Fragment>
						{!user.id ? (
							<div className={classes.loginWrapper}>
								<h2>Sign in</h2>
								{authMessage ? <span>{authMessage}</span> : ""}
								<form className={classes.loginForm}>
									<div>
										<input
											ref={this.emailInput}
											type="email"
											name="email"
											placeholder="Email"></input>
									</div>
									<div>
										<input
											ref={this.passwordInput}
											type="password"
											name="password"
											placeholder="Password"></input>
									</div>
									<div>
										<button
											onClick={(e) =>
												logIn(
													this.emailInput.current.value,
													this.passwordInput.current.value,
													e
												)
											}>
											Log in
										</button>
									</div>
								</form>
							</div>
						) : (
							<button onClick={() => this.redirect(user.id)}>
								Go to my calendars
							</button>
						)}
					</React.Fragment>
				)}
			</AuthConsumer>
		);
	}
}

export default UserForm;
