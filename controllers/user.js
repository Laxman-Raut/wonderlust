const User = require("../models/user");

module.exports.signup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signuppost = async (req, res, next) => {  // ✅ next added
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);  // ✅ next now works
      req.flash("success", "User was registered successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginpost = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");  // ✅ fixed missing /
  });
};

