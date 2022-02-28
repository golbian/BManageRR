module.exports = (mongoose) => {
  var countrySchema = mongoose.Schema(
    {
      name: String,
      code: String,
    },
    { timestamps: true }
  );

  const Country = mongoose.model("country", countrySchema);
  return Country;
};
