const express = require("express");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const router = express.Router();
// import { ensureAuth } from "../middleware/auth.js";

router.get("/", homeController.getHome);
// router.get("/:shortUrl", homeController.redirectUrl);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
