var database = require("../database/");

// get all animals
exports.getAnimals = async (req, res) => {
  try {
    var query = "select * from animals";
    var params = [];
    database.all(query, params, (err, rows) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      res.status(200).json({
        data: rows,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

//
exports.getAnimalById = async (req, res) => {
  try {
    var query =
      "select animal.id,place.place, animal.isEndangered,animal.description,animal.place_id,animal.image,animal.name from animals as animal inner join places as place on animal.place_id = place.id where animal.id = ?";
    var params = [req.params.id];
    database.get(query, params, (err, row) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          error: err.message,
        });
        return;
      }
      console.log(row);
      res.status(200).json({
        data: row,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

//
exports.createAnimal = async (req, res) => {
  try {
    var errors = [];
    if (!req.body.name) {
      errors.push("No Name specified");
    }
    if (!req.body.endangered) {
      errors.push("Endangered not specified");
    }
    if (errors.length) {
      req.flash("error_msg", errors.join(","));
      return res.redirect("/create");
    }
    if (!req.files) {
      req.flash("error_msg", "No files were uploaded.");
      return res.redirect("/create");
    } else {
      var file = req.files.upload;
      var img_name = file.name;
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/gif"
      ) {
        file.mv("src/public/images/uploaded_images/" + file.name, function (
          err
        ) {
          if (err) {
            req.flash("error_msg", err.message);
            return res.redirect("/create");
          }
          var data = {
            name: req.body.name,
            description: req.body.description,
            isEndangered: req.body.endangered,
            place_id: req.body.place,
          };
          var query =
            "INSERT INTO animals (name,description ,isEndangered,place_id, image) VALUES (?,?,?,?,?)";
          var params = [
            data.name,
            data.description,
            data.isEndangered,
            data.place_id,
            img_name,
          ];
          database.run(query, params, function (err, result) {
            if (err) {
              req.flash("error_msg", err.message);
              console.log(err);
              return res.redirect("/create");
            }
            req.flash("success_msg", "Created Successfully");
            return res.redirect("/animals");
          });
        });
      } else {
        message =
          "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        req.flash("error_msg", message);
        return res.redirect("/create");
      }
    }
  } catch (e) {
    req.flash("error_msg", e.message);
    return res.redirect("/create");
  }
};

//
exports.updateAnimalById = async (req, res) => {
  try {
    var data = {
      name: req.body.name,
      description: req.body.description,
      isEndangered: req.body.endangered,
      place_id: req.body.place,
    };
    database.run(
      `update animals SET name = coalesce(?,name), description = coalesce(?,description), 
      isEndangered = coalesce(?,isEndangered), place_id = coalesce(?,place_id) where id = ?`,
      [
        data.name,
        data.description,
        data.isEndangered,
        data.place_id,
        req.params.id,
      ],
      function (err, result) {
        if (err) {
          req.flash("error_msg", err.message);
          res.redirect("update-animal");
          return;
        }
        req.flash("success_msg", "Updated Successfully");
        return res.redirect("/animals");
      }
    );
  } catch (e) {
    req.flash("error_msg", e.message);
    res.redirect("update-animal");
  }
};

//
exports.deleteAnimalById = async (req, res) => {
  try {
    database.run("delete from animals where id = ?", [req.params.id], function (
      err,
      result
    ) {
      if (err) {
        req.flash("error_msg", err.message);
        res.status(400).render("update-animal", {
          title: "Update",
        });
        return;
      }
      req.flash("success_msg", " Animal has been deleted Successfully");
      return res.status(200).json({ message: "successful" });
    });
  } catch (e) {
    req.flash("error_msg", e.message);
    res.status(500).render("update-animal", {
      title: "Update",
    });
  }
};

exports.getPlaces = async (req, res) => {
  try {
    var query = "select * from places";
    var params = [];
    database.all(query, params, (err, rows) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      res.status(200).json({
        data: rows,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

exports.createPlace = async (req, res) => {
  try {
    var query = "INSERT INTO places (place) VALUES (?)";
    var params = [req.body.place];
    database.run(query, params, function (err, result) {
      if (err) {
        req.flash("error_msg", err.message);
        return res.status(400).render("create-place", {
          title: "Create Place",
        });
      }
      req.flash("success_msg", "Place Created Successfully");
      return res.redirect("/animals");
    });
  } catch (e) {
    res.status(500).render("create-place", {
      title: "Create Place",
    });
  }
};
