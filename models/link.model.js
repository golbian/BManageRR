module.exports = mongoose => {
    var Schema = mongoose.Schema(
        {
            source: String,  
            target: String,
            type: Number
        },
        { timestamps: true }
      );


    // Ensure virtual fields are serialised.
    Schema.set('toJSON', {
        virtuals: true
    });
    
    const Link = mongoose.model("link", Schema);
    return Link;
  };