const express = require("express");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage}  = require('../cloudConfig.js');
const upload = multer({storage});


router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"), // Middleware to handle file upload
    validateListing,
    wrapAsync(listingControllers.createRoute) // Async route handler
  );

  router.get("/category/:category", wrapAsync(listingControllers.filterByCategory));



// New Route
router.get("/new", isLoggedIn, listingControllers.rendering);
router
  .route("/:id")
  .get( wrapAsync(listingControllers.showRoute))
  .put( isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateRoute))
  .delete( isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.deleteRoute));
  


// Edit Route
router.get("/:id/edit",
  isLoggedIn, isOwner,
  wrapAsync(listingControllers.editRoute));

module.exports = router;
