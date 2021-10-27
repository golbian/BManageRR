const db = require("../models");
const Function = db.function;

// Create and Save a new Function
exports.create = (req, res) => {
   // Validate request
   if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const functionModel = new Function({
    name: req.body.name,
    description: req.body.description
  });

  // Save Function in the database
  functionModel
    .save(functionModel)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Function state."
      });
    });
};

// Retrieve all Functions from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  
    Function.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving functions."
        });
      });
  };

// Find a single Function with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Function.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Function with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Function with id=" + id });
      });
  };

// Update a Function by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Function.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Function with id=${id}. Maybe Function was not found!`
          });
        } else res.send({ message: "Function was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Function with id=" + id
        });
      });
  };

// Delete a Function with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Function.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Function with id=${id}. Maybe Function was not found!`
          });
        } else {
          res.send({
            message: "Function was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Function with id=" + id
        });
      });
  };