module.exports = (mongoose) => {
  var clientSchema = mongoose.Schema(
    {
      name: String,
      country: String,
      contact: String,
    },
    { timestamps: true }
  );

  const Client = mongoose.model("client", clientSchema);
  return Client;
};
