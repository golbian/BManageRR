const db = require("../models");
const mongoose = require("mongoose");
const Link = db.link;
const Project = db.project;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const link = new Link({
    source: req.body.source,
    target: req.body.target,
    type: req.body.type,
  });

  const id = req.params.id;

  link.save(link).then((data) => {
    console.log(id);
    Project.update(
      { _id: id, "schedules._id": link.source },
      { $push: { "schedules.$.links": link._id } },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (data) res.send(link);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Link state.",
        });
      });
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.body._id;

  Link.findOneAndUpdate(
    { _id: id },
    {
      "links.$.source": req.body.link.source,
      "links.$.target": req.body.link.target,
      "links.$.type": req.body.link.type,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Link with id=${id}. Maybe Link was not found!`,
        });
      } else res.send({ message: "Link was updated successfully." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Link with id=" + id,
      });
    });
};

// Delete a Link with the specified id in the request
exports.delete = (req, res) => {
  const root = req.query.root;
  const source = req.query.source;
  const id = req.query.id;

  Project.findOneAndUpdate(
    { _id: root, "schedules._id": source },
    { $pull: { "schedules.$.links": id } },
    { useFindAndModify: false }
  ).then((data) => {
    Link.deleteOne({ _id: id })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Link with id=${id}. Maybe Link was not found!`,
          });
        } else {
          res.send({
            message: "Link with id= " + id + "was deleted successfully!",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Link with id=" + id,
        });
      });
  });
};
