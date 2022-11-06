const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

module.exports = {
	getLogin: (req, res) => {
		// Checking if user is already logged in, req.user is comming from passport
		if (req.user) {
			//redirecting to main page
			return res.redirect("/short");
		}
		// If user not logged in then login page will appear
		res.render("login", {
			title: "Login",
		});
	},

	postLogin: (req, res, next) => {
		// Array of errors encountered when logging in
		const validationErrors = [];

		// Checking if email enter is in correct format using validator package
		if (!validator.isEmail(req.body.email)) {
			// Pushing the error message to validationError Array
			validationErrors.push({ msg: "Please enter a valid email address." });
		}
		//Checking if password field is empty
		if (validator.isEmpty(req.body.password)) {
			// Pushing the error message to validationError Array
			validationErrors.push({ msg: "Password cannot be blank." });
		}

		if (validationErrors.length) {
			// If one error is found we are showing error in ejs using flash package
			req.flash("errors", validationErrors);

			// Redirecting to login page
			return res.redirect("/login");
		}

		// Normalizing an email
		req.body.email = validator.normalizeEmail(req.body.email, {
			gmail_remove_dots: false,
		});

		// Authenticating user using passport
		passport.authenticate("local", (err, user, info) => {
			// If any error pass error message to next middleware
			if (err) {
				return next(err);
			}
			if (!user) {
				// If user not present flash error on login page that user does not exists
				req.flash("errors", info);
				return res.redirect("/login");
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				// Flashing success msg
				req.flash("success", { msg: "Success! You are logged in." });
				res.redirect(req.session.returnTo || "/short");
			});
		})(req, res, next);
	},

	logout: (req, res) => {
		// req.logout(() => {
		// 	// Logging to Console that is user has logged out
		// 	console.log("User has logged out.");
		// });
		// // Destroying the session
		// req.session.destroy((err) => {
		// 	if (err) {
		// 		console.log(
		// 			"Error : Failed to destroy the session during logout.",
		// 			err
		// 		);
		// 	}
		// 	// changing user field to null
		// 	req.user = null;
		// 	// Rediecting to Home Page
		// 	res.redirect("/");
		// });
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.clearCookie("connect.sid");
			res.redirect("/");
		});
	},

	getSignup: (req, res) => {
		if (req.user) {
			return res.redirect("/short");
		}
		res.render("signup", {
			title: "Create Account",
		});
	},

	postSignup: (req, res, next) => {
		// Array of errors encountered when logging in
		const validationErrors = [];

		// Checking if email enter is in correct format using validator package
		if (!validator.isEmail(req.body.email)) {
			// Pushing the error message to validationError Array
			validationErrors.push({ msg: "Please enter a valid email address." });
		}
		//Checking if password field have length > 8
		if (!validator.isLength(req.body.password, { min: 8 })) {
			// Pushing the error message to validationError Array
			validationErrors.push({
				msg: "Password must be at least 8 characters long",
			});
		}
		//Checking if password field and confirmPassword field is equal or not
		if (req.body.password !== req.body.confirmPassword) {
			// Pushing the error message to validationError Array
			validationErrors.push({ msg: "Passwords do not match" });
		}

		if (validationErrors.length) {
			// If one error is found we are showing error in ejs using flash package
			req.flash("errors", validationErrors);

			// Redirecting to sign up page
			return res.redirect("/signup");
		}

		// Normalizing an email
		req.body.email = validator.normalizeEmail(req.body.email, {
			gmail_remove_dots: false,
		});

		const user = new User({
			userName: req.body.userName,
			email: req.body.email,
			password: req.body.password,
		});

		User.findOne(
			//Checking if email already exists
			{ $or: [{ email: req.body.email }, { userName: req.body.userName }] },

			(err, existingUser) => {
				//if error happens redirect it to next middleware
				if (err) {
					return next(err);
				}
				//Checking if user already exists
				if (existingUser) {
					//if user exists flash error msg on login page
					req.flash("errors", {
						msg: "Account with that email address or username already exists.",
					});
					//redirecting to login page
					return res.redirect("/login");
				}

				//If user does not exists than make a new entry in the database
				user.save((err) => {
					if (err) {
						return next(err);
					}
					//After making a new entry login user and redirect user to main page
					req.logIn(user, (err) => {
						if (err) {
							return next(err);
						}
						res.redirect("/short");
					});
				});
			}
		);
	},
};
