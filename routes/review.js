const express = require("express");
const router = express.Router({ mergeParams: true }); // ← mergeParams is important!
const Listing = require("../models/listings.js");     // ← ADD THIS
const Review = require("../models/review.js");
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expressError.js");

const{validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const ReviewsController = require("../controllers/review.js");





//review route
router.post("/",isLoggedIn,
  validateReview,
   wrapasync(ReviewsController.createReview));

///delete route review
 router.delete("/:reviewId" ,
  isReviewAuthor,
   isLoggedIn,
  wrapasync(ReviewsController.deleteReview));

module.exports = router;