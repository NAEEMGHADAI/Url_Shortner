const express = require("express");
const shortController = require("../controllers/short.js");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, shortController.getUrl);

router.get("/:shortUrl", shortController.redirectUrl);

router.post("/create", ensureAuth, shortController.createShort);

router.delete("/delete", ensureAuth, shortController.deleteShortUrl);

module.exports = router;
