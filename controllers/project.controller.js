const db = require("../models");
const mongoose = require("mongoose");
const { project } = require("../models");
const Project = db.project;

// Create and Save a new Project
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const project = new Project({
    _id: req.body._id,
    name: req.body.text,
    wbs: req.body.wbs,
    wp: req.body.wp,
    type: req.body.type,
    client: req.body.client,
    contact: req.body.contact,
    duration: req.body.duration,
    status: req.body.status,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    parent: req.body.parent,
    progress: req.body.progress,
    charge: req.body.charge,
    kam: req.body.kam,
    pm: req.body.pm,
    stage: req.body.stage,
    domaine: req.body.domaine,
    temp: req.body.temp,
    etp: req.body.etp,
    ca: req.body.ca,
    comments: req.body.comments,
    country: req.body.country,
    level: req.body.level,
    mode: req.body.mode,
    creation: req.body.creation,
    function: req.body.function,
    skill: req.body.skill,
    resource: req.body.resource,
    offre: req.body.offre,
    lien: req.body.lien,
    lien_offre: req.body.lien_offre,
    cmde: req.body.cmde,
    cmde_link: req.body.cmde_link,
    bl: req.body.bl,
    bl_chrono: req.body.bl_chrono,
    facture: req.body.facture,
    facture_link: req.body.facture_link,
    facture_id: req.body.facture_id,
    facture_date: req.body.facture_date,
    regt_initial: req.body.regt_initial,
    regt_expect: req.body.regt_expect,
    regt_final: req.body.regt_final,
    rate: req.body.rate,
    production: req.body.production,
    jalon: req.body.jalon,
    debours: req.body.debours,
    tpelig: req.body.tpelig,
    // $level: req.body.$level,
    // open: req.body.open
  });
  console.log(project);

  // Save Project in the database
  project
    .save(project)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Project state.",
      });
    });
};

// Retrieve all Projects from the database.
exports.findAll = (req, res) => {
  var aggregation = [
    {
      $addFields: {
        total: {
          $sum: "$tasks.charge",
        },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
        "tasks.country": "$$ROOT.country",
        "tasks.domaine": "$$ROOT.domaine",
        "tasks.kam": "$$ROOT.kam",
        "tasks.pm": "$$ROOT.pm",
      },
    },
    { $sort: { name: 1 } },
  ];
  // }

  Project.find().then(() => {
    return Project.aggregate(aggregation).exec(function (err, doc) {
      Project.populate(
        doc,
        {
          path: "links",
          // populate: { path: 'links', model:"link" }
        },
        function (err, data) {
          if (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving projects.",
            });
          } else {
            res.send(data);
          }
        }
      );
    });
  });

  //     // exec(function(err, data) {
  //           /*Project.populate(doc , {
  //             path: 'tasks.resources',
  //             populate: { path: 'resources' }
  //           },
  //           function(err, data) {*/
  //             // if(!err) {
  //             //   res.send(data);
  //             // } else {
  //             //   res.status(500).send({
  //             //     message:
  //             //       err.message || "Some error occurred while retrieving projects."
  //             //   });
  //             // }
  //           // });
  //     // })
  // // });
};

// Retrieve all Projects from the database.
// exports.findAllChilds = (req, res) => {
//   let ids = req.body.ids;
//   Project.find({ _id: { $in: ids } })
//     .then((data) => {
//       if (!data)
//         res.status(404).send({ message: "Project childs were not found "});
//       else {
//         let childs = [];
//         for(project of data) {
//           childs.push(project.tasks.flat());
//         }
//         console.log(childs)
//         res.send(data);
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({ message: "Error retrieving Projects" });
//     });
// };

// Find a single Project with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Project.findById(id)
    // .populate({
    //   path: 'tasks.resources',
    //   populate: { path: 'resources' }
    // })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Project with id " + id });
      else {
        res.send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Project with id=" + id });
    });
};

// Update a Project by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Project.updateOne({ _id: id }, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Project with id=${id}. Maybe Project was not found!`,
        });
      } else res.send({ message: "Project was updated successfully." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Project with id=" + id,
      });
    });
};

exports.attachPM = (req, res) => {
  const id = req.params.id;
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  Project.findByIdAndUpdate(
    id,
    { $set: { pm: req.body.pm, published: req.body.published } },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Project Manager in Project with id=${id}. Maybe Project was not found!`,
        });
      } else res.send({ message: "Project Manager was updated successfully." });
      var charges = [];

      for (const charge of data.tasks) {
        charges.push(charge);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Project with id=" + id,
      });
    });
};

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);

  Project.deleteOne({ _id: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Project with id=${id}. Maybe Project was not found!`,
        });
      } else {
        res.send({
          message: "Project with id=" + id + " was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Project with id=" + id,
      });
    });
};

// Delete all Projects from the database.
exports.deleteAll = (req, res) => {
  Project.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Projects were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all projects.",
      });
    });
};

// Find all published Projects
exports.findAllPublished = (req, res) => {
  Project.find({ published: true })
    // .populate({
    //   path: 'tasks.resources',
    //   populate: { path: 'resources' },
    //   select: "username"
    // })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects.",
      });
    });
};

exports.findAllAdminForTimesheet = (req, res) => {
  var aggregation = [
    {
      $match: {
        $or: [
          {
            stage: "8. COMMANDE",
          },
          {
            stage: "9. EN COURS",
          },
          {
            "tasks.$.stage": "8. COMMANDE",
          },
          {
            "tasks.$.stage": "9. EN COURS",
          },
        ],
      },
    },
    {
      $addFields: {
        total: { $sum: "$tasks.charge" },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
      },
    },
  ];
  Project.find().then(() => {
    return Project.aggregate(aggregation).exec(function (err, data) {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving projects.",
        });
      } else {
        res.send(data);
      }
    });
  });
};

exports.findAllPmForTimesheet = (req, res) => {
  const pm = req.params.pm;
  var aggregation = [
    {
      $match: {
        $and: [
          { $or: [{ pm: pm }, { "tasks.pm": pm }] },
          {
            $or: [
              { stage: "8. COMMANDE" },
              { stage: "9. EN COURS" },
              { "tasks.$.stage": "8. COMMANDE" },
              { "tasks.$.stage": "9. EN COURS" },
            ],
          },
        ],
      },
    },
    {
      $addFields: {
        total: { $sum: "$tasks.charge" },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
      },
    },
  ];
  Project.find().then(() => {
    return Project.aggregate(aggregation).exec(function (err, data) {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving projects.",
        });
      } else {
        res.send(data);
      }
    });
  });
};

exports.findAllKamForTimesheet = (req, res) => {
  const kam = req.params.kam;
  var aggregation = [
    {
      $match: {
        $and: [
          { $or: [{ kam: kam }, { "tasks.kam": kam }] },
          { $or: [{ stage: "8. COMMANDE" }, { stage: "9. EN COURS" }] },
        ],
      },
    },
    { $addFields: { total: { $sum: "$tasks.charge" } } },
  ];
  Project.find().then(() => {
    return Project.aggregate(aggregation).exec(function (err, data) {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving projects.",
        });
      } else {
        res.send(data);
      }
    });
  });
};

exports.findAllUsersForTimesheet = (req, res) => {
  const resource = req.params.resource;
  var aggregation = [
    {
      $match: {
        $and: [
          { "tasks.resources._id": resource },
          {
            $or: [
              { stage: "8. COMMANDE" },
              { stage: "9. EN COURS" },
              { "tasks.$.stage": "8. COMMANDE" },
              { "tasks.$.stage": "9. EN COURS" },
            ],
          },
        ],
      },
    },
    {
      $addFields: {
        total: { $sum: "$tasks.charge" },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
      },
    },
  ];
  Project.find().then(() => {
    return Project.aggregate(aggregation).exec(function (err, data) {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving projects.",
        });
      } else {
        res.send(data);
      }
    });
  });
};

exports.findAllPmProject = (req, res) => {
  const pm = req.params.pm;
  var aggregation = [
    { $match: { $or: [{ pm: pm }, { "tasks.pm": pm }] } },
    {
      $addFields: {
        total: { $sum: "$tasks.charge" },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
      },
    },
    { $sort: { name: 1 } },
  ];

  Project.find()
    .populate({
      path: "links",
      // populate: { path: 'links', model:"link" }
    })
    .then(() => {
      return Project.aggregate(aggregation).exec(function (err, data) {
        /*Project.populate(doc, {
        path: 'tasks.resources',
        populate: { path: 'resources' },
        select: "username"
        }, function(err, data) {*/
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving projects.",
          });
        } else {
          res.send(data);
        }
      });
    });
  // })
};

exports.findAllKamProject = (req, res) => {
  const kam = req.params.kam;
  var aggregation = [
    { $match: { kam: kam } },
    {
      $addFields: {
        total: { $sum: "$tasks.charge" },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
      },
    },
    { $sort: { name: 1 } },
  ];

  Project.find()
    .populate({
      path: "links",
      // populate: { path: 'links', model:"link" }
    })
    .then(() => {
      return Project.aggregate(aggregation).exec(function (err, data) {
        /*Project.populate(doc, {
        path: 'tasks.resources',
        populate: { path: 'resources' },
        select: "username"
        }, function(err, data) {*/
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving projects.",
          });
        } else {
          res.send(data);
        }
      });
    });
  // })
};

exports.findAllResourceProject = (req, res) => {
  const resource = req.params.resource;
  var aggregation = [
    { $match: { "tasks.resources._id": resource } },
    {
      $addFields: {
        total: { $sum: "$tasks.charge" },
        "tasks.root": "$$ROOT._id",
        "tasks.client": "$$ROOT.client",
      },
    },
    { $sort: { name: 1 } },
  ];

  Project.find()
    .populate({
      path: "links",
      // populate: { path: 'links', model:"link" }
    })
    .then(() => {
      return Project.aggregate(aggregation).exec(function (err, data) {
        /*Project.populate(doc, {
        path: 'tasks.resources',
        populate: { path: 'resources' },
        select: "username"
        }, function(err, data) {*/
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving projects.",
          });
        } else {
          res.send(data);
        }
      });
    });
  // })
};
