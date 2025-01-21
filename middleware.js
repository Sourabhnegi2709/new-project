
// new version

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema");

const Review = require("./models/review");
const Listing = require("./models/listing");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the requested URL for redirect after login
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  next();
};

// Middleware to save the redirect URL for post-login navigation
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Save URL for templates
  }
  next();
};

// Middleware to check if the user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to edit this listing.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errMsg);
    return res.redirect("/listings/new");
  }
  next();
};

// Middleware to validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};



// Middleware to check if the user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      req.flash('error', 'Review not found.');
      return res.redirect(`/listings/${id}`);
    }

    // Check if the current user is the author
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete this review.");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error("Error in isReviewAuthor middleware:", err);
    req.flash("error", "Something went wrong.");
    res.redirect(`/listings/${id}`);
  }
};
