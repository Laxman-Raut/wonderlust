const path = require("path");
const envPath = path.resolve(__dirname, '.env');
console.log("Loading .env from:", envPath);
require('dotenv').config({ path: envPath, override: true });

console.log("All env vars:", JSON.stringify(process.env, null, 2));
console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

const express = require("express");
const app = express();
//dns 
const dns = require("dns");
//chang dns
dns.setServers(["1.1.1.1","8.8.8.8"]);

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 4040;

 
const dbUrl = process.env.ATLASDB_URL;


async function main() {
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  console.log("MongoDB Connected");
}

main()
  .then(() => console.log("DB connection established"))
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
    
    
  });
// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // added this
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,                                              
  crypto: {
    secret: process.env.SESSION_SECRET , 
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {                                   
  console.log("ERROR IN MONGODB SESSION", err);               
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET , 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

// ✅ FIX 3: Passport setup — serializeUser/deserializeUser must be functions, NOT called
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ ADD THESE TWO DEBUG LINES
console.log("Strategies:", Object.keys(passport._strategies));
console.log("User.authenticate type:", typeof User.authenticate);

// Locals middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; 
 
  next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// for dark mode 


// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err.status = 400;
    err.message = "Invalid ID! Page not found.";
  }
  if (err.name === "ValidationError") {
    err.status = 400;
    err.message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});