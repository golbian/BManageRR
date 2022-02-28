module.exports = (mongoose) => {
    var resourceSchema = mongoose.Schema(
      {
        name: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
      },
      { timestamps: true }
    );
  
    const Resource = mongoose.model("resource", resourceSchema);
    return Resource;
  };
  