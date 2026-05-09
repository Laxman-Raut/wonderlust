const express = require("express");
// const router = express();
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapasync = require("../utils/wrapasync.js");
// const { listingSchema ,reviewSchema } = require("../schema.js");
const{isLoggedIn} = require("../middleware.js");
const{isOwner , validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} =require("../cloudeConfig.js");
const upload = multer({ storage});

router.route("/")
.get(
    wrapasync(listingController.index))
    .post(
       isLoggedIn,
   upload.single('listing[image]'),
    validateListing,
  wrapasync(listingController.createlistings)
);


//new route
router.get("/new",isLoggedIn,listingController.renderNewform);

router.route("/:id")
.get(
     wrapasync(listingController.showListing))

     .put(
        isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
 validateListing, 
 wrapasync (listingController.udpatelisting))
 .delete(
   isLoggedIn ,
   isLoggedIn,
   wrapasync(listingController.deletelisting));


//edit route
router.get("/:id/edit"
    ,isLoggedIn,wrapasync(listingController.editlisting));

// search query
router.get("/api/search", async (req, res) => {

  let q = req.query.q;

  if (!q) return res.json([]);

  const listings = await Listing.find({
    title: { $regex: q, $options: "i" }
  }).limit(5);

  res.json(listings);
});

module.exports = router;