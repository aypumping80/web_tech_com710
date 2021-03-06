const checkAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // if not authenticated
  req.flash("error_msg", "Please login to view this resource");
  res.redirect("/login");
};

// ensure no user logged in if they want to access the route
const checkNotAuthenticated = (req, res, next) => {
  // if authenticated
  if (req.isAuthenticated()) {
    return res.redirect("/animals");
  }
  // if not authenticated just res that call
  next();
};

module.exports = {
  checkAuthenticatedUser: checkAuthenticatedUser,
  checkNotAuthenticated: checkNotAuthenticated,
};
