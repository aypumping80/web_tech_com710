const passport = require("passport");
const db = require("../database");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/animals",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.registerUser = async (req, res) => {
  try {
    var errors = [];
    if (!req.body.password) {
      errors.push("Password not specified, Password must be 8 ");
    }
    if (!req.body.email) {
      errors.push("Email is Required");
    }
    if (errors.length) {
      req.flash("error_msg", errors.join(","));
      return res.status(400).render("authPages/register.ejs", {
        title: "Register Page",
      });
    }
    const password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        var user = {
          email: req.body.email,
          password: hash,
        };
        var sql = "INSERT INTO users ( email,password) VALUES (?,?)";
        var params = [user.email, user.password];
        db.run(sql, params, function (err, result) {
          if (err) {
            req.flash("error_msg", err.message);
            return res.status(400).render("authPages/register.ejs", {
              title: "Register Page",
            });
          }
          res.redirect("/login");
        });
      });
    });
  } catch (e) {
    req.flash("error_msg", err.message);
    return res.status(400).render("authPages/register.ejs", {
      title: "Register Page",
    });
  }
};