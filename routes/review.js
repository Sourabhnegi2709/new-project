const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure parent route params are merged
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js", reviewSchema);
const Listing = require("../models/listing.js");
const { isReviewAuthor, isLoggedIn } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");



// Middleware to validate a review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// POST review route
router.post(
  "/",
  isLoggedIn,
  validateReview, // Use validateReview instead of validateListing
  wrapAsync(reviewControllers.createReview)
);

// DELETE review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.deleteReview)
);

module.exports = router;
