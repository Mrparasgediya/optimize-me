const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema(
  {
    src: {
      type: Buffer,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

imageSchema.methods.toJSON = function () {
  const image = this;
  const imageObject = image.toObject();
  imageObject.src = `/images/${image._id}.${image.mimetype.split("/")[1]}`;
  return imageObject;
};

module.exports = mongoose.model("Image", imageSchema);
