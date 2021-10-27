const skills = require("../controllers/skill.controller.js");
const { authJwt } = require("../middlewares");
module.exports = app => {

    var router = require("express").Router();
  
    // Create a new Skill
    router.post("/",[authJwt.verifyToken, authJwt.isKam], skills.create);
  
    // Retrieve all Skills
    router.get("/", [authJwt.verifyToken, authJwt.isKam], skills.findAll);

    // Retrieve a single Skill with id
    router.get("/:id",[authJwt.verifyToken, authJwt.isKam], skills.findOne);
  
    // Update a Skill with id
    router.put("/:id",[authJwt.verifyToken, authJwt.isKam], skills.update);
  
    // Delete a Skill with id
    router.delete("/:id",[authJwt.verifyToken, authJwt.isKam], skills.delete);
  
    app.use('/api/skills', router);
  };