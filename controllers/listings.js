const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}
module.exports.rendering = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const filteredListings = await Listing.find({ category: category });

  res.render("listings/index.ejs", { allListings: filteredListings });
};


module.exports.showRoute =  async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author', // Populate the author field inside reviews
        model: 'User',
      },
    })
    .populate("owner");
    if(!listing){
      req.flash("error", "listing you are request for does not exist !");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };






module.exports.createRoute = async (req, res, next) => {
    try {
      // Extract file information if provided
      const { path: url, filename: fileName } = req.file || {};
  
      // Create a new listing from request data
      const newListing = new Listing(req.body.listing);
  
      // Assign uploaded image details if available
      if (req.file) {
        newListing.image = { url, fileName }; // Assuming `image` is an object with `url` and `fileName` in your schema
      }
  
      // Assign the current logged-in user as the owner of the listing
      newListing.owner = req.user._id;
  
      // Save the listing to the database
      await newListing.save();
  
      // Flash success message and redirect
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
    } catch (err) {
      // Handle errors gracefully
      next(err); // Pass error to error-handling middleware
    }
  };


module.exports.editRoute = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Cannot find the listing!");
            return res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};




module.exports.updateRoute = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    listing.image = {url, fileName};
    await listing.save();
    let url = req.file.path;
    let fileName = req.file.fileName;
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}




module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing was Deleted!");
    res.redirect("/listings");
    }