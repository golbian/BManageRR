const roles = require("../controllers/roles.controller.js");
const { authJwt } = require("../middlewares");
module.exports = app => {

    var router = require("express").Router();
  
    // Create a new Role
    router.post("/",[authJwt.verifyToken, authJwt.isAdmin], roles.create);
  
    // Retrieve all Roles
    router.get("/", [authJwt.verifyToken], roles.findAll);
  
    // Retrieve a single Role with id
    router.get("/:id",[authJwt.verifyToken], roles.findOne);
  
    // Update a Role with id
    router.put("/:id",[authJwt.verifyToken, authJwt.isAdmin], roles.update);
  
    // Delete a Role with id
    router.delete("/:id",[authJwt.verifyToken, authJwt.isAdmin], roles.delete);
  
    app.use('/api/roles', router);
  };