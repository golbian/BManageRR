module.exports = (mongoose) => {
  var functionSchema = mongoose.Schema(
    {
      name: String,
      description: String,
    },
    { timestamps: true }
  );

  const Function = mongoose.model("function", functionSchema);
  return Function;
};
