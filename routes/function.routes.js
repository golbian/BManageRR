const functions = require("../controllers/function.controller.js");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Function
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isKam || authJwt.isPm],
    functions.create
  );

  // Retrieve all Functions
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isKam || authJwt.isPm],
    functions.findAll
  );

  // Retrieve a single Function with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.isKam || authJwt.isPm],
    functions.findOne
  );

  // Update a Function with id
  router.put(
    "/:id",
    [authJwt.verifyToken, authJwt.isKam || authJwt.isPm],
    functions.update
  );

  // Delete a Function with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isKam || authJwt.isPm],
    functions.delete
  );

  app.use("/api/functions", router);
};
