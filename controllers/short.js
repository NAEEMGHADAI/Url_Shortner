const Url = require("../models/Url.js");
const validateUrl = require("../utils/utils.js");

module.exports = {
  getUrl: async (req, res) => {
    let shortUrl = await Url.find({ userId: req.user.id });
    res.render("index.ejs", { shortUrl, base: process.env.BASE });
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
  createShort: async (req, res) => {
    console.log(req.user.id)
    let url = await Url.find({
      fullUrl: req.body.fullUrl,
      userId: req.user.id,
    });
    if (url.length !== 0) {
      return res.redirect("/short");
    }
    if (validateUrl(req.body.fullUrl)) {
      await Url.create({ fullUrl: req.body.fullUrl, userId: req.user.id });
      res.redirect("/short");
    }
  },
  deleteShortUrl: async (req, res) => {
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
  },
};
