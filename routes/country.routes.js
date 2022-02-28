const country = require("../controllers/country.controller.js");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Country
  router.post("/", [authJwt.verifyToken], country.create);

  // Retrieve all Countries
  router.get("/", [authJwt.verifyToken], country.findAll);

  // Retrieve a single Country with id
  router.get("/:id", [authJwt.verifyToken], country.findOne);

  // Update a Country with id
  router.put("/:id", [authJwt.verifyToken], country.update);

  // Delete a Country with id
  router.delete("/:id", [authJwt.verifyToken], country.delete);

  app.use("/api/countries", router);
};
