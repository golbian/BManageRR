const { authJwt } = require("../middlewares");
const users = require("../controllers/user.controller");

module.exports = app => {
  var router = require("express").Router();

  // Find all users
  router.get("/", [authJwt.verifyToken, authJwt.isPm], users.findAll);

  // Find a single user with id
  router.get("/:id", [authJwt.verifyToken], users.findOne);

  // Update an User by admin with id
  router.put("/admin/:id",[authJwt.verifyToken, authJwt.isAdmin], users.updateByAdmin);

  // Update an User pwd with id
  router.put("/update-pwd/:id",[authJwt.verifyToken], users.updatePwd);

  // Update an User with id
  router.put("/update/:id",[authJwt.verifyToken], users.update);

  // Update an User with id
  router.put("/:id/:roleId",[authJwt.verifyToken, authJwt.isAdmin], users.pushRole);

  // Delete a project with projectId in User with id
  router.delete("/project/:id", [authJwt.verifyToken, authJwt.isAdmin], users.deleteProject);
  
  // Delete an User with id
  router.delete("/:id",[authJwt.verifyToken, authJwt.isAdmin], users.delete);

  app.use('/api/users', router);
};
