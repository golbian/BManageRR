const tasks = require("../controllers/task.controller.js");
const { authJwt } = require("../middlewares");
module.exports = app => {
  
    var router = require("express").Router();

    //Create a new Schedule
    router.post("/:root",[authJwt.verifyToken, authJwt.isPm], tasks.create);

    //Find a Schedule
    router.get("/:projectId/:taskId", [authJwt.verifyToken], tasks.findOne);

    //Update task in a Project
    router.put("/:root",[authJwt.verifyToken, authJwt.isPm], tasks.update);

    //Delete a Schedule with id
    router.delete("/:projectId/:taskId", [authJwt.verifyToken, authJwt.isPm], tasks.delete)
  
    app.use('/api/task', router);
  };