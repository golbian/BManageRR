module.exports = (mongoose) => {
  var taskSchema = mongoose.Schema(
    {
      _id: String,
      wbs: String,
      type: String,
      level: String,
      wp: Boolean,
      name: String,
      nestedLevel: Number,
      client: String,
      contact: String,
      country: String,
      mode: String,
      status: String,
      skill: String,
      function: String,
      stage: String,
      kam: String,
      pm: String,
      resource: String,
      temp: String,
      domaine: String,
      cmde: String,
      cmde_link: String,
      bl: String,
      bl_chrono: String,
      facture: String,
      facture_link: String,
      facture_id: String,
      facture_date: mongoose.Schema.Types.Mixed,
      regt_initial: mongoose.Schema.Types.Mixed,
      regt_expect: mongoose.Schema.Types.Mixed,
      regt_final: mongoose.Schema.Types.Mixed,
      charge: mongoose.Schema.Types.Mixed,
      rate: mongoose.Schema.Types.Mixed,
      etp: mongoose.Schema.Types.Mixed,
      ca: mongoose.Schema.Types.Mixed,
      debours: String,
      comments: String,
      status: String,
      start_date: mongoose.Schema.Types.Mixed,
      end_date: mongoose.Schema.Types.Mixed,
      end_date_revised: mongoose.Schema.Types.Mixed,
      parent: String,
      progress: Number,
      duration: mongoose.Schema.Types.Mixed,
      links: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "link",
        },
      ],
    },
    { timestamps: true }
  );

  // Duplicate the ID field.
  projectSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  // Duplicate the ID field.
  taskSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  // Ensure virtual fields are serialised.
  projectSchema.set("toJSON", {
    virtuals: true,
  });

  // activitySchema.virtual('resource_id').get(function(){
  //   return this.resource._id;
  // });

  const Task = mongoose.model("task", taskSchema);
  return Task;
};
