import mongoose from "mongoose";
import shortId from "shortid";

const UrlSchema = new mongoose.Schema({
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

export default mongoose.model("Url", UrlSchema);
