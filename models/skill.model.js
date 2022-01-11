module.exports = (mongoose) => {
  var skillSchema = mongoose.Schema(
    {
      name: String,
      description: String,
    },
    { timestamps: true }
  );

  const Skill = mongoose.model("skill", skillSchema);
  return Skill;
};
