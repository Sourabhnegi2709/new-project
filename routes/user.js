const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js"); // Import the User model
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const isLoggedIn = require("../middleware.js");

const userControllers = require("../controllers/users.js")

router
.route("/signup")
.get( (req, res)=>{
    res.render("users/signup.ejs");
})
.post(
    wrapAsync(userControllers.signup)
);

router
.route("/login")
.get(userControllers.login)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash: true,
    }),
userControllers.loginCheck);


router.get("/login",userControllers.login)

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash: true,
    }),
   userControllers.loginCheck);

router.get("/logout", userControllers.logout)



module.exports = router;
