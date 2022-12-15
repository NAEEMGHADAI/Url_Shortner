module.exports = {
	getHome: (req, res) => {
		res.render("home.ejs");
	},
	redirectUrl: async (req, res) => {
		let url = await Url.findOne({ shortUrl: req.params.shortUrl });
		if (url !== null) {
			url.clicks++;
			url.save();
			res.redirect(`${url.fullUrl}`);
		} else {
			res.json("not found");
		}
	},
};
