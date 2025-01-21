
const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.owner = req.user._id; // Assuming you're tracking the user who submitted the review.
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`)
};






module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; // Ensure 'id' matches the listing ID parameter in the route
  
    try {
      // Remove the review reference from the listing
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      // Delete the review
      await Review.findByIdAndDelete(reviewId);
  
      req.flash("success", "Review was deleted!");
      res.redirect(`/listings/${id}`);
    } catch (err) {
      console.error("Error in deleteReview:", err);
      req.flash("error", "Something went wrong while deleting the review.");
      res.redirect(`/listings/${id}`);
    }
  };

