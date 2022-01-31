module.exports = (mongoose) => {
  var eventSchema = mongoose.Schema(
    {
      _id: String,
      name: String,
      activity: String,
      projectWbs: String,
      wpName: String,
      wpWbs: String,
      delWbs: String,
      wbs: String,
      parentWp: Boolean,
      client: String,
      user: String,
      deliverable: String,
      project_id: mongoose.Schema.Types.ObjectId,
      schedule_id: mongoose.Schema.Types.ObjectId,
      project: String,
      task: String,
      pm: String,
      kam: String,
      month: String,
      year: Number,
      pointage: String,
      start_date: String,
      end_date: String,
      charge: Number,
      tps: Number,
      // duration: Number,
      domaine: String,
      insitu: Boolean,
    },
    { timestamps: true }
  );
  const Event = mongoose.model("event", eventSchema);
  return Event;
};
