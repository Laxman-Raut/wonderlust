const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// ✅ Review require removed from here

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: { url: String, filename: String },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: ["Trending", "Mountains", "Beach", "Arctic", "Rooms", "Amazing Pools", "Cabins", "Farms", "Iconic Cities", "Lake View", "Old", "Snow"],
    default: "Trending"
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    const Review = require("./review.js");
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;