const router = require("express").Router();
const { checkAuthenticatedUser } = require("../middleware/");
const {
  createAnimal,
  createPlace,
  deleteAnimalById,
  getAnimalById,
  getAnimals,
  getPlaces,
  updateAnimalById,
} = require("../controllers/animal.controller");

//
router.get("/animals", getAnimals);
router.post("/animals", checkAuthenticatedUser, createAnimal);

//
router.post("/location", checkAuthenticatedUser, createPlace);

//
router.get("/animals/:id", getAnimalById);
router.put("/animals/:id", checkAuthenticatedUser, updateAnimalById);
router.delete("/animals/:id", checkAuthenticatedUser, deleteAnimalById);

// get location
router.get("/location", getPlaces);

module.exports = router;
