const mongoose = require("mongoose");
const shortId = require("shortid");

const UrlSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	fullUrl: {
		type: String,
		required: true,
	},
	shortUrl: {
		type: String,
		required: true,
		default: shortId.generate,
	},
	clicks: {
		type: Number,
		required: true,
		default: 0,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Url", UrlSchema);
