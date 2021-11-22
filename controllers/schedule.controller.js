const db = require("../models");
const mongoose = require("mongoose");
const Project = db.project;
const User = db.user;

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.body.root;

  Project.findOneAndUpdate({_id: id}, {$push: { schedules: req.body}}, { useFindAndModify: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot create Schedule. Maybe Project was not found!`
        });
      } else {
        try {
          res.status(200).send(data);
        } catch {
          res.status(500).send({
            message: "Error creating Schedule"
          });
        }
      }
    })
};

exports.findOne = (req, res) => {
  const id = req.params.projectId;
  const scheduleId = req.params.scheduleId;
  if(!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  Project.findOne({_id: id, "schedules._id": scheduleId},{ 'schedules.$._id': scheduleId })
  .then(data => {
    if (!data)
      res.status(404).send({ message: "Not found Schedule with id " + id });
    else {
      res.send(data);
    }
  })
  .catch(err => {
    res
      .status(500)
      .send({ message: "Error retrieving Schedule with id=" + id });
  });
}

  exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.body.root;
    const scheduleId = req.body._id;

    Project.findOneAndUpdate(
       {_id: id, "schedules._id": scheduleId},
       {
        "schedules.$.start_date": req.body.start_date,
        "schedules.$.duration": req.body.duration,
        "schedules.$.parent": req.body.parent,
        "schedules.$.client": req.body.client,
        "schedules.$.domaine": req.body.domaine,
        "schedules.$.status": req.body.status,
        "schedules.$.type": req.body.type, 
        "schedules.$.progress": req.body.progress,
        "schedules.$.end_date": req.body.end_date,
        "schedules.$.end_date_revised": req.body.end_date_revised,
        "schedules.$.name": req.body.name,
        "schedules.$.contract": req.body.contract,
        "schedules.$.country": req.body.country,
        "schedules.$.kam": req.body.kam,
        "schedules.$.charge": req.body.charge,
        "schedules.$.pm": req.body.pm,
        "schedules.$.function": req.body.function,
        "schedules.$.stage": req.body.stage,
        "schedules.$.links": req.body.links,
        "schedules.$.etp": req.body.etp,
        "schedules.$.comments": req.body.comments,
        "schedules.$.temp": req.body.temp,
        "schedules.$.ca": req.body.ca,
        "schedules.$.level": req.body.level,
        "schedules.$.mode": req.body.mode,
        "schedules.$.creation": req.body.creation,
        "schedules.$.skill": req.body.skill,
        "schedules.$.resource": req.body.resource,
        "schedules.$.offre": req.body.offre,
        "schedules.$.lien": req.body.lien,
        "schedules.$.lien_offre": req.body.lien_offre,
        "schedules.$.cmde": req.body.cmde,
        "schedules.$.cmde_link": req.body.cmde_link,
        "schedules.$.bl": req.body.bl,
        "schedules.$.bl_chrono": req.body.bl_chrono,
        "schedules.$.facture": req.body.facture,
        "schedules.$.facture_link": req.body.facture_link,
        "schedules.$.facture_id": req.body.facture_id,
        "schedules.$.facture_date": req.body.facture_date,
        "schedules.$.regt_initial": req.body.regt_initial,
        "schedules.$.regt_expect": req.body.regt_expect,
        "schedules.$.regt_final": req.body.regt_final,
        "schedules.$.rate": req.body.rate,
        "schedules.$.production": req.body.production,
        "schedules.$.jalon": req.body.jalon,
        "schedules.$.debours": req.body.debours,
        "schedules.$.tpelig": req.body.tpelig,
      },{ useFindAndModify: false }
    )
      .then(data => {
        if(req.body.isAdmin) {
          // for(const resource of req.body.resources) {
          //   User.findOneAndUpdate({_id: resource._id},{$set: { value: resource.value }, $addToSet: { projects: id }},{ useFindAndModify: false }).then(data => {
          //     if(!data) {
          //         console.log(`Cannot update User value with id=${resource._id} in schedule(${scheduleId}) for Project with id=${id}`)
          //     } else console.log("User value was updated successfully.");
          //   })
          //   .catch(err => {
          //     console.log(
          //       "Error updating User value with id=" + resource._id
          //     );
          //   });
          // }
        }
        if (!data) {
          res.status(404).send({
            message: `Cannot update Schedule with id=${scheduleId} in Project with id=${id}. Maybe Schedule was not found!`
          });
        } else res.send({ 
          "action":"updated",
          message: "Schedule was updated successfully." 
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: "Error updating Schedule with id=" + scheduleId
        });
      });
  };

  // Delete a Schedule with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.projectId;
  const scheduleId = req.params.scheduleId;

  Project.findOneAndUpdate({_id: id }, { $pull: {schedules:{_id : scheduleId}}},{ useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Schedule with id=${scheduleId}. Maybe Schedule was not found!`
        });
      } else {
        res.send({
          "action":"deleted",
          message: "Schedule with id= " + scheduleId + "was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Schedule with id=" + scheduleId
      });
    });
};