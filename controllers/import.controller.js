const db = require("../models");
const mongoose = require("mongoose");
const csv = require('csvtojson');
const Project = db.project;
const moment =  require("moment");

exports.upload =  (req, res) => {
  if (req.file == undefined) {
    return res.status(400).send({ message: "Please upload a file!" });
  }
  

  csv({
    // trim: true,
    // ignoreEmpty: true,
    delimiter: ";"
  })
  .fromFile(req.file.path, {defaultEncoding: 'UTF8'})
  .then((file)=>{
    var projects = [];
  // var schedules = [];

  var pushToProject = function(parentWbs, schedule, task) {
      if(!task) {
        console.log(parentWbs)
        const project = projects.find(p => p.wbs === parentWbs);
        const wp = project.schedules.find(w => w.wbs === parentWbs);
        schedule.parent = project._id
        project.schedules.push(schedule);
      } else {
        const project = projects.find(p => p.wbs === parentWbs.substr(0,7));
        const wp = project.schedules.find(w => w.wbs === parentWbs);
        if(wp == undefined) {
          schedule.parent = project._id
          project.schedules.push(schedule);
        } else {
          schedule.parent = wp._id;
          project.schedules.push(schedule);
        }
      }
  }

  for( const item of file ) {
    var data = {
      wbs: item["REFERENCE"],
      wp: item["WP"],
      type: "",
      level: item["NIVEAU"],
      name: item["Designation"],
      client: item["Client"],
      contact: item["Contact"],
      country: item["Country"],
      stage: item["STAGE"],
      creation: item["CREATION"],
      kam: item["KAM"],
      pm: item["PM"],
      maj: item["MAJ"],
      temp: item["TEMP"],
      domaine: item["DOMAINE"],
      offre: item["OFFRE"],
      lien: item["LIEN"],
      lien: item["LIEN_OFFRE"],
      cmde: item["CMDE"],
      cmde_link: item["LIEN_CMDE"],
      x: item["x"],
      bl: item["BL"],
      bl_chrono: item["CHRONO_BL"],
      facture: item["FACTURE"],
      facture_link: item["LIEN_FACTURE"],
      facture_id: item["idLigne FACTURE"],
      facture_date: item["DATE FACTURE"],
      regt_initial: item["REGT ATTENDU"],
      regt_expect: item["REGT ESPERE"],
      regt_final: item["REGT EFFECTIF"],
      etp: item["ETP"],
      charge: item["CHARGE"],
      rate: item["TAUX"],
      ca: item["CA"],
      debours: item["DEBOURS"],
      start_date: item["DEBUT"],
      end_date: item["FIN"],
      end_date_revised: item["FIN (REVISEE)"],
      tpelig: item["TPELIG"],
      status: item["Status"],
      comments: item["Comments"],
      duration: item["DUREE"],
    }

    data.start_date = moment(data.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:00.000Z]');
    data.end_date = moment(data.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:00.000Z]');
    data.end_date_revised = moment(data.end_date_revised, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:00.000Z]');
    for(var i in data) {
      if(data[i] == undefined) {
        data[i] = "";
      }
    }

    let regex = new RegExp(/([A-Z]+||[0-9])\w+/g)
    var wbsExtract = data.wbs.match(regex)
    var parts = wbsExtract;
    if(parts) {
      data.nestedLevel = parts.length -1;
      if(data.wbs || data.wbs !== "") {
        if(data.nestedLevel == 0) {
          data._id = new mongoose.mongo.ObjectId();
          // parentWbs = data.wbs
          data.type = 'project'
          data.wp = false;
          data.schedules = []
          projects.push(data)
        } else if(data.nestedLevel !== 0 && data.level === "WP"){
          data._id = new mongoose.mongo.ObjectId();
          data.type = 'project';
          data.wp = true;
          parts.pop()
          var parent = parts[0];
          pushToProject(parent, data, false)
        } else if(data.nestedLevel !== 0 && data.level === "TASK"){
          data.type = 'task';
          var parent = parts[0] +'.'+ parts[1];
          data.wp = false;
          pushToProject(parent, data, true)
        } else if(data.nestedLevel !== 0 && data.level === "DEL"){
          data.type = 'milestone';
          data.wp = false;
          var parent = parts[0] +'.'+ parts[1];
          pushToProject(parent, data, true)
        }
      }
    }
  }

  for(const project of projects) {
    if(project.charge !== "TBD" || project.charge !== "") {
      project.charge = parseInt(project.charge)
    } else {
      project.charge = 0;
    }
    if(project.charge === null) {
      project.charge = 0;
    }
    for(const schedule of project.schedules) {
      if (schedule) {
        if(schedule.charge !== "TBD" || schedule.charge !== "") {
          schedule.charge = parseInt(schedule.charge)
        } else {
          schedule.charge = 0;
        }
        if(schedule.charge === null) {
          schedule.charge = 0;
        }
      }
    }
  }


  // Save Project in the database
  Project
    .insertMany(projects)
    .then(data => {
      // console.log(data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project state."
      })
    })
  })
};