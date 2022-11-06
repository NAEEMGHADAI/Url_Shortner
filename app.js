const express = require("express");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const logger = require("morgan");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const mainRoutes = require("./routes/main.js");
const shortRoutes = require("./routes/short.js");

const app = express();

require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger("dev"));

// Sessions
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", mainRoutes);
app.use("/short", shortRoutes);

// app.get("/", async (req, res) => {
// 	let shortUrl = await Url.find();
// 	res.render("index.ejs", { shortUrl, base: process.env.BASE });
// });

// app.post("/short", async (req, res) => {
// 	let url = await Url.find({ fullUrl: req.body.fullUrl });
// 	if (url.length !== 0) {
// 		return res.redirect("/");
// 	}
// 	if (validateUrl(req.body.fullUrl)) {
// 		await Url.create({ fullUrl: req.body.fullUrl });
// 		res.redirect("/");
// 	}
// });

// app.get("/:shortUrl", async (req, res) => {
// 	let url = await Url.findOne({ shortUrl: req.params.shortUrl });
// 	if (url !== null) {
// 		url.clicks++;
// 		url.save();
// 		res.redirect(`${url.fullUrl}`);
// 	} else {
// 		res.json("not found");
// 	}
// });

// app.delete("/delete", async (req, res) => {
// 	try {
// 		let url = await Url.findOne({ shortUrl: req.body.shortUrl });
// 		if (url !== null) {
// 			await Url.findOneAndDelete({ shortUrl: req.body.shortUrl });
// 			res.redirect("/");
// 		} else {
// 			res.json("not found");
// 		}
// 	} catch (err) {
// 		console.error(err);
// 	}
// });

// Server Setup
const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
	console.log(`Server is running at PORT ${process.env.PORT || PORT}`);
});
