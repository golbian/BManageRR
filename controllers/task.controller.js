const db = require("../models");
const Project = db.project;

exports.create = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  try {
    const root = req.params.root;

    const updated = await Project.findOneAndUpdate(
      { _id: root },
      { $push: { tasks: req.body } },
      { useFindAndModify: true, new: true }
    )
    .exec();
    return res.status(200).send(updated);
  }
  catch (err){
    return res.status(500).send(err)
  }
};

exports.findOne = (req, res) => {
  const id = req.params.projectId;
  const taskId = req.params.taskId;
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  Project.findOne({ _id: id, "tasks._id": taskId }, { "tasks.$._id": taskId })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Task with id " + id });
      else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Task with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const root = req.params.root;
  const id = req.body._id;

  Project.findOneAndUpdate(
    { _id: root, "tasks._id": id },
    {
      "tasks.$.wbs": req.body.wbs,
      "tasks.$.start_date": req.body.start_date,
      "tasks.$.duration": req.body.duration,
      "tasks.$.parent": req.body.parent,
      // "tasks.$.client": req.body.client,
      // "tasks.$.domaine": req.body.domaine,
      "tasks.$.status": req.body.status,
      "tasks.$.type": req.body.type,
      "tasks.$.progress": req.body.progress,
      "tasks.$.end_date": req.body.end_date,
      "tasks.$.end_date_revised": req.body.end_date_revised,
      "tasks.$.name": req.body.name,
      "tasks.$.contract": req.body.contract,
      // "tasks.$.country": req.body.country,
      "tasks.$.kam": req.body.kam,
      "tasks.$.charge": req.body.charge,
      "tasks.$.pm": req.body.pm,
      "tasks.$.function": req.body.function,
      "tasks.$.stage": req.body.stage,
      "tasks.$.links": req.body.links,
      "tasks.$.etp": req.body.etp,
      "tasks.$.comments": req.body.comments,
      "tasks.$.temp": req.body.temp,
      "tasks.$.ca": req.body.ca,
      "tasks.$.level": req.body.level,
      "tasks.$.mode": req.body.mode,
      "tasks.$.creation": req.body.creation,
      "tasks.$.skill": req.body.skill,
      "tasks.$.resource": req.body.resource,
      "tasks.$.offre": req.body.offre,
      "tasks.$.lien": req.body.lien,
      "tasks.$.lien_offre": req.body.lien_offre,
      "tasks.$.cmde": req.body.cmde,
      "tasks.$.cmde_link": req.body.cmde_link,
      "tasks.$.bl": req.body.bl,
      "tasks.$.bl_chrono": req.body.bl_chrono,
      "tasks.$.facture": req.body.facture,
      "tasks.$.facture_link": req.body.facture_link,
      "tasks.$.facture_id": req.body.facture_id,
      "tasks.$.facture_date": req.body.facture_date,
      "tasks.$.regt_initial": req.body.regt_initial,
      "tasks.$.regt_expect": req.body.regt_expect,
      "tasks.$.regt_final": req.body.regt_final,
      "tasks.$.rate": req.body.rate,
      "tasks.$.production": req.body.production,
      "tasks.$.jalon": req.body.jalon,
      "tasks.$.debours": req.body.debours,
      "tasks.$.tpelig": req.body.tpelig,
      "tasks.$.$level": req.body.$level,
      "tasks.$.open": req.body.open,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Task with id=${id} in Project with id=${root}. Maybe Task was not found!`,
        });
      } else
        res.send({
          action: "updated",
          message: "Task was updated successfully.",
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Task with id=" + id,
      });
    });
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.projectId;
  const taskId = req.params.taskId;

  Project.findOneAndUpdate(
    { _id: id },
    { $pull: { tasks: { _id: taskId } } },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Task with id=${taskId}. Maybe Task was not found!`,
        });
      } else {
        res.send({
          action: "deleted",
          message: "Task with id= " + taskId + "was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Task with id=" + taskId,
      });
    });
};
