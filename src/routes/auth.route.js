const router = require("express").Router();
const { checkAuthenticatedUser, checkNotAuthenticated } = require("../middleware");

const { loginUser, registerUser } = require("../controllers/auth.controller");

// user authentication route
router.post("/login", checkNotAuthenticated, loginUser);
router.post("/register", checkNotAuthenticated, registerUser);

module.exports = router;
