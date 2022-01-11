const clients = require("../controllers/client.controller.js");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Client
  router.post("/", [authJwt.verifyToken, authJwt.isKam], clients.create);

  // Retrieve all Clients
  router.get("/", [authJwt.verifyToken, authJwt.isKam], clients.findAll);

  // Retrieve a single Client with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isKam], clients.findOne);

  // Update a Client with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isKam], clients.update);

  // Delete a Client with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isKam], clients.delete);

  app.use("/api/clients", router);
};
