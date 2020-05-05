import React from "react";
import { AuthConsumer } from "../../contexts/AuthContext";
import classes from "../Navigation/Navbar.module.css";

export default function Navbar() {
	return (
		<div>
			<header className={classes.navContainer}>
				<AuthConsumer>
					{({ user, logOut }) => (
						<React.Fragment>
							<a href={user.id ? `/${user.id}/calendars` : `/`}>stacker</a>
							{user.id ? (
								<React.Fragment>
									<small>user: {user.email}</small>
									<button
										className={classes.buttonOutline}
										onClick={(e) => logOut(e)}>
										Log Out
									</button>
								</React.Fragment>
							) : null // <small>Please sign in</small>
							}
						</React.Fragment>
					)}
				</AuthConsumer>
			</header>
		</div>
	);
}
