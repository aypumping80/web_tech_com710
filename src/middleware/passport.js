const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../database");

const initialize = (passport) => {
  const authenticate = async (email, password, done) => {
    try {
      var sql = "select * from users where email = ?";
      var params = [email];
      db.get(sql, params, (err, row) => {
        if (err) {
          return done(null, false, { message: err.message });
        }
        if (!row) {
          return done(null, false, { message: "That email is not registered" });
        }
        bcrypt.compare(password, row.password, function (err, result) {
          if (result) {
            return done(null, row);
          } else {
            return done(null, false, {
              message: "Password or Email Address incorrect",
            });
          }
        });
      });
    } catch (err) {
      res.redirect("/login");
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticate));

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    var sql = "select * from users where id = ?";
    var params = [id];
    db.get(sql, params, (err, row) => {
      if (err) {
        return done(null, false, { message: err.message });
      }
      return done(null, row);
    });
  });
};

module.exports = initialize;
