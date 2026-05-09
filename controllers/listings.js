const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) filter.category = category;
  const allListings = await Listing.find(filter);
  res.render("index.ejs", { allListings, currentCategory: category || null });
};

module.exports.renderNewform = (req, res) => {
  res.render("new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};

module.exports.createlistings = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
};

module.exports.udpatelisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};