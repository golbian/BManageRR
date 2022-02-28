const commercial = require("../controllers/commercial.controller.js");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Resource
  router.post("/", [authJwt.verifyToken, authJwt.isKam], commercial.resource.create);

  // Retrieve all Resources
  router.get("/", [authJwt.verifyToken, authJwt.isKam], commercial.resource.findAll);

  // Retrieve a single Resource with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isKam], commercial.resource.findOne);

  // Update a Resource with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isKam], commercial.resource.update);

  // Delete a Resource with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isKam], commercial.resource.delete);

  app.use("/api/resources", router);
};
