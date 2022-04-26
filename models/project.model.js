module.exports = (mongoose) => {
  var taskSchema = mongoose.Schema({
    _id: String,
    wbs: String,
    type: String,
    wp: Boolean,
    name: String,
    open: Boolean,
    $level: Number,
    // client: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "client"
    // },
    // client: String,
    // contact: String,
    // country: String,
    stage: String,
    mode: String,
    status: String,
    kam: String,
    pm: String,
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
    start_date: mongoose.Schema.Types.Mixed,
    end_date: mongoose.Schema.Types.Mixed,
    end_date_revised: mongoose.Schema.Types.Mixed,
    // skill: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "skill"
    // },
    skill: String,
    // function: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "function"
    // },
    function: String,
    parent: String,
    root: String,
    progress: Number,
    duration: mongoose.Schema.Types.Mixed,
    published: Boolean,
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "link",
      },
    ],
  });

  var projectSchema = mongoose.Schema(
    {
      _id: String,
      wbs: String,
      type: String,
      level: String,
      wp: Boolean,
      name: String,
      nestedLevel: Number,
      $level: Number,
      // client: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "client"
      // },
      client: String,
      contact: String,
      country: String,
      mode: String,
      status: String,
      // skill: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "skill"
      // },
      skill: String,
      // function: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "function"
      // },
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
      charge: Number,
      rate: Number,
      etp: Number,
      ca: Number,
      debours: String,
      comments: String,
      status: String,
      start_date: mongoose.Schema.Types.Mixed,
      end_date: mongoose.Schema.Types.Mixed,
      end_date_revised: mongoose.Schema.Types.Mixed,
      parent: String,
      root: String,
      progress: Number,
      duration: Number,
      published: Boolean,
      tasks: [taskSchema],
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
  taskSchema.virtual("id").get(function () {
    return this._id;
  });

  // Duplicate the ID field.
  projectSchema.virtual("id").get(function () {
    return this._id;
  });

  // Ensure virtual fields are serialised.
  projectSchema.set("toJSON", {
    virtuals: true,
  });

  // activitySchema.virtual('resource_id').get(function(){
  //   return this.resource._id;
  // });

  const Project = mongoose.model("project", projectSchema);
  return Project;
};
