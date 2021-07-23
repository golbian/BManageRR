const db = require("../models");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const User = db.user;

  // Retrieve all Projects from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  User.find(condition)
  .populate({
    path: 'roles',
    populate: { path: 'roles' },
  })
  .select("-password")
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects."
      });
    });
};

exports.findSameUser = (req,res) => {
  const name = req.params.usermane;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  User.find(condition)
  .then(data => {
    if (data){
      res.status(404).send({ message: "Found User with the same name" });
    }
    else {
      console.log("not find a same user")
      res.send(data);
    }
  })
}
// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .populate({
      path: 'roles',
      populate: { path: 'users.roles' }
    })
    .select("-password")
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      res.status(500).send({ message: " ici error" });
      return;
    }
    if (!user) {
      User.findOne({
        _id: id
      }, (err, user) => {
        if (err) {
          res.status(500).send({ message: " ici error" });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        
        var query = {username: req.body.username , email: req.body.email}
        User.update({_id: user._id}, query, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update User with id=${user._id}. Maybe User was not found!`
            });
          } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message: "Error updating User with id=" + id
          });
        });
      });
    }
    else {
      User.findOne({
        _id: id
      }, (err, user) => {
        if (err) {
          res.status(500).send({ message: " ici error" });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        if(user.email !== req.body.email){
          var query = {username: req.body.username , email: req.body.email}
          User.update({_id: user._id}, query, { useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update User with id=${user._id}. Maybe User was not found!`
              });
            } else res.send({ message: "User was updated successfully." });
          })
          .catch(err => {
            console.log(err);
            res.status(500).send({
              message: "Error updating User with the username : " + req.body.username
            });
          });
        }
        else {
          res.status(500).send({
            message: "Error updating User with the username : " + req.body.username
          });
        }
      });
    }
  })
};

// Update a User by admin with the id in the request
exports.updateByAdmin = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  console.log(req.body)

  const id = req.params.id;

  User.update({_id: id}, req.body, { useFindAndModify: false })
    .then(data => {
      console.log('data', data)
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
  
};

// Update a User pwd by the id in the request
exports.updatePwd = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;

  User.findOne({
    _id: id
  }, (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      
      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!"
        });
      } else {
        var query = {password: bcrypt.hashSync(req.body.newPassword, 8)}
        User.update({_id: user._id}, query, { useFindAndModify: false })
        .then(data => {
          console.log('data', data)
          if (!data) {
            res.status(404).send({
              message: `Cannot update User with id=${user._id}. Maybe User was not found!`
            });
          } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message: "Error updating User with id=" + id
          });
        });
      }
    });

  
};

//Add a Role to an User
exports.pushRole = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  const roleId = req.roleId;

  User.findByIdAndUpdate(id, req.body, {$push: {roles: roleId}},{ useFindAndModify: false })
    .then(data => {
      console.log(data)
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

exports.deleteProject = (req,res) => {
  const id = req.params.id;

  User.find().update({_id: id}, {$pull: {projects:{_id : id}}},{ useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Project with project id =${projectId} in User with id=${id}. Maybe User or project was not found!`
        });
      } else {
        res.send({
          message: "Project with project id = "+ projectId +"in User with id="+ id +" was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Project with project id= "+ projectId + " in User with id=" + id
      });
    });
}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findOneAndDelete({_id : id}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User with id="+ id +" was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

