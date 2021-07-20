const projects = require("../controllers/project.controller.js");
const { authJwt } = require("../middlewares");
module.exports = app => {

    var router = require("express").Router();
  
    // Create a new Project
    router.post("/",[authJwt.verifyToken, authJwt.isPm], projects.create);
  
    // Retrieve all Projects
    router.get("/", [authJwt.verifyToken, authJwt.isPm], projects.findAll);
  
    // Retrieve all published Projects
    router.get("/published",[authJwt.verifyToken], projects.findAllPublished);

    //Retrieve all Pm's projects
    router.get("/pm/:pm",[authJwt.verifyToken, authJwt.isPm], projects.findAllPmProject);

    //Retrieve all Kam's projects
    router.get("/kam/:kam",[authJwt.verifyToken, authJwt.isKam], projects.findAllKamProject);

    //Retrieve all Resource's projects
    router.get("/resource/:resource",[authJwt.verifyToken], projects.findAllResourceProject);

    //Retrieve all Pm's projects for timesheet
    router.get("/timesheet/pm/:pm",[authJwt.verifyToken, authJwt.isPm], projects.findAllPmForTimesheet);

    //Retrieve all Kam's projects for timesheet
    router.get("/timesheet/kam/:kam",[authJwt.verifyToken, authJwt.isKam], projects.findAllKamForTimesheet);

    //Retrieve all Kam's projects for timesheet
    router.get("/timesheet/resource/:resource",[authJwt.verifyToken], projects.findAllUsersForTimesheet);
  
    // Retrieve a single Project with id
    router.get("/:id",[authJwt.verifyToken], projects.findOne);
  
    // Update a Project with id
    router.put("/:id",[authJwt.verifyToken, authJwt.isPm], projects.update);

    //Attach a Project Manager to a Project with id
    router.put("/user/:user",[authJwt.verifyToken, authJwt.isPm], projects.attachPM)
  
    // Delete a Project with id
    router.delete("/:id",[authJwt.verifyToken, authJwt.isPm], projects.delete);
  
    app.use('/api/projects', router);
  };