import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import Url from "./models/Url.js";
import { validateUrl } from "./utils/utils.js";
const app = express();

dotenv.config({ path: "./config/.env" });

connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
	let shortUrl = await Url.find();
	res.render("index.ejs", { shortUrl, base: process.env.BASE });
});

app.post("/short", async (req, res) => {
	let url = await Url.find({ fullUrl: req.body.fullUrl });
	console.log(url);
	if (url.length !== 0) {
		return res.redirect("/");
	}
	if (validateUrl(req.body.fullUrl)) {
		await Url.create({ fullUrl: req.body.fullUrl });
		res.redirect("/");
	}
});

app.get("/:shortUrl", async (req, res) => {
	let url = await Url.findOne({ shortUrl: req.params.shortUrl });
	if (url !== null) {
		url.clicks++;
		url.save();
		res.redirect(`${url.fullUrl}`);
	} else {
		res.json("not found");
	}
});

app.delete("/delete", async (req, res) => {
	try {
		let url = await Url.findOne({ shortUrl: req.body.shortUrl });
		if (url !== null) {
			await Url.findOneAndDelete({ shortUrl: req.body.shortUrl });
			res.redirect("/");
		} else {
			res.json("not found");
		}
	} catch (err) {
		console.error(err);
	}
});

// Server Setup
const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
	console.log(`Server is running at PORT ${process.env.PORT || PORT}`);
});
