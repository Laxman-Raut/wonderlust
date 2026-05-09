const express = require("express");
const router = express.Router({ mergeParams: true }); 
const User =require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const UserController = require("../controllers/user.js");


router.route("/signup")
.get(UserController.signup)
.post(wrapasync(UserController.signuppost));


router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Successfully logged in");

    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    res.redirect(redirectUrl);
  }
);

router.get("/logout",UserController.logout);



module.exports =router;