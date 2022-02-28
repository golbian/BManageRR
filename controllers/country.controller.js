const db = require("../models");
const mongoose = require("mongoose");
const Country = db.country;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const country = new Country({
    name: req.body.name,
    code: req.body.code,
  });
  console.log(req.body)

  country.save(country)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Country state.",
      });
    });
};
// Retrieve all Countries from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  Country.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving clients.",
      });
    });
};
// Find a single Country with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Country.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Country with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Country with id=" + id });
    });
};
// Update a Country by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Country.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Country with id=${id}. Maybe Country was not found!`,
        });
      } else res.send({ message: "Country was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Country with id=" + id,
      });
    });
};
// Delete a Country with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Country.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Country with id=${id}. Maybe Country was not found!`,
        });
      } else {
        res.send({
          message: "Country was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Country with id=" + id,
      });
    });
};
