const db = require("../models");
const mongoose = require("mongoose");
const csv = require("csvtojson");
const Project = db.project;
const Client = db.client;
const functionModel = db.function;
const Skill = db.skill;
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

exports.upload = (req, res) => {
  if (req.file == undefined) {
    return res.status(400).send({ message: "Please upload a file!" });
  }

  csv({
    // trim: true,
    // ignoreEmpty: true,
    delimiter: ";",
  })
    .fromFile(req.file.path, { defaultEncoding: "UTF8" })
    .then((file) => {
      var projects = [];
      // var tasks = [];

      var pushToProject = function (parentWbs, schedule, task) {
        if (!task) {
          console.log(parentWbs);
          const project = projects.find((p) => p.wbs === parentWbs);
          const wp = project.tasks.find((w) => w.wbs === parentWbs);
          schedule.parent = project._id;
          project.tasks.push(schedule);
        } else {
          const project = projects.find(
            (p) => p.wbs === parentWbs.substr(0, 7)
          );
          const wp = project.tasks.find((w) => w.wbs === parentWbs);
          if (wp == undefined) {
            schedule.parent = project._id;
            project.tasks.push(schedule);
          } else {
            schedule.parent = wp._id;
            project.tasks.push(schedule);
          }
        }
      };

      // const clients = []
      // const functions = []
      // const skills = []

      for (const item of file) {
        // if(item["Client"] != '') {
        //   if(clients.find(c => c == item["Client"]) === undefined) {
        //     clients.push(item["Client"]);
        //   }
        // }

        // if(item["FONCTION"] != '') {
        //   if(functions.find(f => f == item["FONCTION"]) === undefined) {
        //     functions.push(item["FONCTION"]);
        //   }
        // }

        // if(item["COMPETENCE"] != '') {
        //   if(skills.find(s => s == item["COMPETENCE"]) === undefined) {
        //     skills.push(item["COMPETENCE"]);
        //   }
        // }

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
          domaine: item["DOMAINE"],
          mode: item["MODE"],
          creation: item["CREATION"],
          kam: item["KAM"],
          pm: item["PM"],
          function: item["FONCTION"],
          skill: item["COMPETENCE"],
          resource: item["RESSOURCE"],
          temp: item["TEMP"],
          offre: item["OFFRE"],
          lien: item["LIEN"],
          lien: item["LIEN_OFFRE"],
          cmde: item["CMDE"],
          cmde_link: item["LIEN_CMDE"],
          bl: item["BL"],
          bl_chrono: item["CHRONO_BL"],
          facture: item["FACTURE"],
          facture_link: item["LIEN_FACTURE"],
          facture_id: item["idLigne FACTURE"],
          facture_date: item["DATE FACTURE"],
          regt_initial: item["REGT ATTENDU"],
          regt_expect: item["REGT ESPERE"],
          regt_final: item["REGT EFFECTIF"],
          etp: item["ETP calcul automatique"],
          charge: item["CHARGE"],
          rate: item["TAUX"],
          production: item["PRODUCTION"],
          jalon: item["JALON PAIEMENT"],
          ca: item["CA"],
          debours: item["DEBOURS"],
          start_date: item["DEBUT"],
          end_date: item["FIN"],
          end_date_revised: item["FIN (REVISEE)"],
          tpelig: item["TPELIG"],
          status: item["Status"],
          comments: item["Comments"],
          duration: item["DUREE"],
        };

        data.start_date = moment(data.start_date, "DD-MM-YYYY").format(
          "YYYY-MM-DD[T00:00:00.000Z]"
        );
        data.end_date = moment(data.end_date, "DD-MM-YYYY").format(
          "YYYY-MM-DD[T00:00:00.000Z]"
        );
        data.end_date_revised = moment(
          data.end_date_revised,
          "DD-MM-YYYY"
        ).format("YYYY-MM-DD[T00:00:00.000Z]");
        for (var i in data) {
          if (data[i] == undefined || null) {
            data[i] = "";
          }
        }

        let regex = new RegExp(/([A-Z]+||[0-9])\w+/g);
        var wbsExtract = data.wbs.match(regex);
        var parts = wbsExtract;
        if (parts) {
          data.nestedLevel = parts.length - 1;
          if (data.wbs || (data.wbs !== "" && data.level === "PROJET")) {
            if (data.nestedLevel == 0) {
              data._id = uuidv4();
              // parentWbs = data.wbs
              data.type = "project";
              data.wp = false;
              data.tasks = [];
              projects.push(data);
            } else if (data.nestedLevel !== 0 && data.level === "WP") {
              data._id = uuidv4();
              data.type = "project";
              data.wp = true;
              parts.pop();
              var parent = parts[0];
              // console.log(parent)
              pushToProject(parent, data, false);
            } else if (data.nestedLevel !== 0 && data.level === "TASK") {
              data._id = uuidv4();
              data.type = "task";
              var parent = parts[0] + "." + parts[1];
              data.wp = false;
              pushToProject(parent, data, true);
            } else if (data.nestedLevel !== 0 && data.level === "DEL") {
              data._id = uuidv4();
              data.type = "milestone";
              data.wp = false;
              var parent = parts[0] + "." + parts[1];
              pushToProject(parent, data, true);
            }
          }
        }
      }

      for (const project of projects) {
        if (project.charge !== "TBD" || project.charge !== "") {
          project.charge = parseInt(project.charge);
        } else {
          project.charge = 0;
        }
        if (project.charge === null || NaN || "" || "NaN") {
          project.charge = 0;
        }

        if (project.etp !== "TBD" || project.etp !== "") {
          project.etp = parseInt(project.etp);
        } else {
          project.etp = 0;
        }
        if (project.etp === null || NaN || "" || "NaN") {
          project.etp = 0;
        }

        if (project.duration !== "TBD" || project.duration !== "") {
          project.duration = parseInt(project.duration);
        } else {
          project.duration = 0;
        }
        if (project.duration === null || NaN || "" || "NaN") {
          project.duration = 0;
        }

        if (project.rate !== "TBD" || project.duration !== "") {
          project.rate = parseInt(project.rate);
        } else {
          project.rate = 0;
        }
        if (project.rate === null || NaN || "" || "NaN") {
          project.rate = 0;
        }
        
        // for (const schedule of project.tasks) {
        //   if (schedule) {
        //     if (schedule.charge !== "TBD" || schedule.charge !== "") {
        //       schedule.charge = parseInt(schedule.charge);
        //     } else {
        //       schedule.charge = 0;
        //     }
        //     if (schedule.charge === null || NaN) {
        //       schedule.charge = 0;
        //     }
        //   }
        // }

        // Client.findOne({name:project.client}).then(response => {
        //   project.client = response.name;
        // })
        // .catch(err => {
        //   console.log(err)
        // })

        // functionModel.findOne({name:project.function}).then(response => {
        //   if(response) project.function = response._id;

        // })
        // .catch(err => {
        //   console.log(err)
        // })

        // Skill.findOne({name:project.skill}).then(response => {
        //   if(response) project.skill = response._id ;
        // })
        // .catch(err => {
        //   console.log(err)
        // })
      }

      // for(let clientName of clients) {
      //   const client = new Client({
      //     name: clientName,
      //   });

      //   client
      //   .save(client)
      //   .then(response => {
      //     // console.log(response)
      //     // clientId = mongoose.Types.ObjectId(response._id)
      //   })
      //   .catch(err => {
      //     res.status(500).send({
      //       message:
      //         err.message || "Some error occurred while creating the client state."
      //     });
      //   })
      // }

      // for(let functionName of functions) {
      //   const fonction = new functionModel({
      //     name: functionName,
      //   });

      //   fonction
      //   .save(fonction)
      //   .then(response => {
      //     // console.log(response)
      //     // functionId = mongoose.Types.ObjectId(response._id)
      //   })
      //   .catch(err => {
      //     res.status(500).send({
      //       message:
      //         err.message || "Some error occurred while creating the client state."
      //     });
      //   })
      // }

      // for(let skillName of skills) {
      //   const skill = new Skill({
      //     name: skillName,
      //   });

      //   skill
      //   .save(skill)
      //   .then(response => {
      //     // console.log(response)
      //     // skillId = mongoose.Types.ObjectId(response._id)
      //   })
      //   .catch(err => {
      //     res.status(500).send({
      //       message:
      //         err.message || "Some error occurred while creating the client state."
      //     });
      //   })
      // }

      // Save Project in the database
      Project.insertMany(projects)
        .then((data) => {
          // console.log(data)
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Project state.",
          });
        });
    });
};
