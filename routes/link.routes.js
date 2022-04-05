const links = require("../controllers/link.controller.js");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
  var router = require("express").Router();

  //Get all Links
  router.get("/", [authJwt.verifyToken], links.findAll);

  //Create a new link
  router.post("/:id", [authJwt.verifyToken], links.create);

  //Update link in a Project

  router.put("/:id", [authJwt.verifyToken], links.update);

  //Delete a link with id
  router.delete("/:id", [authJwt.verifyToken], links.delete);

  app.use("/api/links", router);
};
