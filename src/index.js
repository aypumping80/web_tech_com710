const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const axios = require("axios");
const { checkAuthenticatedUser } = require("./middleware");

const PORT = process.env.PORT || 3002,
  baseURL = "http://localhost:" + PORT;

app.use(express.static(path.join(__dirname, "public")));
// template's engine
app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.set("views", __dirname + "/views");

// Middle ware to handle post, put request
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session middleware
app.use(
  session({
    secret: "secretKey",
    resave: true,
    saveUninitialized: true,
  })
);

// passport config
require("./middleware/passport")(passport);

// Passport Auth middleware
app.use(passport.initialize());
app.use(passport.session());

// Express message middleware
app.use(flash()); //connect flash

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// setting global variable for every view as middleware function to check whether user is logged in or not
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

//
const animalRoute = require("./routes/animal.route");
app.use("/api", animalRoute);

//
const authRoute = require("./routes/auth.route");
app.use("/api/auth", authRoute);

app.get(`/`, (req, res) => {
  res.render("index", {
    title: "Home Page",
  });
});

app.get("/animals", (req, res) => {
  axios
    .get(`${baseURL}/api/animals`)
    .then((response) => {
      res.render("animals", {
        title: "Animals",
        animals: response.data.data,
      });
    })
    .catch((err) => {
      req.flash("error_msg", err.message);
      return res.render("animals", {
        title: "Animals",
      });
    });
});

app.get("/create", checkAuthenticatedUser, (req, res) => {
  axios
    .get(`${baseURL}/api/location`)
    .then((response) => {
      return res.render("create-animal", {
        title: "Create",
        location: response.data.data,
      });
    })
    .catch((err) => {
      req.flash("error_msg", err.message);
      return res.render("create-animal", {
        title: "Create",
      });
    });
});

app.get("/edit/:id", checkAuthenticatedUser, (req, res) => {
  let animal = axios.get(`${baseURL}/api/animals/${req.params.id}/`),
    location = axios.get(`${baseURL}/api/location`);
  Promise.all([animal, location])
    .then((response) => {
      return res.render("update-animal", {
        title: "Update",
        location: response[1].data.data,
        animal: response[0].data.data,
      });
    })
    .catch((e) => {
      req.flash("error_msg", e.message);
      return res.render("update-animal", {
        title: "Update",
      });
    });
});

// view animal
app.get("/pets/:id/", (req, res) => {
  let animal = axios.get(`${baseURL}/api/animals/${req.params.id}/`),
    location = axios.get(`${baseURL}/api/location`);
  Promise.all([animal, location])
    .then((response) => {
      res.render("view", {
        title: "View",
        location: response[1].data.data,
        animal: response[0].data.data,
      });
    })
    .catch((e) => {
      req.flash("error_msg", e.message);
      res.render("view", {
        title: "View",
      });
    });
});

app.get("/location", checkAuthenticatedUser, (req, res) => {
  res.render(`create-place`, {
    title: "Location",
  });
});

// Authenticated path
app.get("/login", (req, res) => {
  res.render("authPages/login", {
    title: "Login",
  });
});

app.get("/register", (req, res) => {
  res.render("authPages/register", {
    title: "Register",
  });
});

// logout
app.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Successfully logged out");
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.send("404");
});

app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${baseURL}`);
});
