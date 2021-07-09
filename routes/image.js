const express = require("express");
const router = express.Router();
const multer = require("multer");
const Image = require("../models/image");
const {
  getImageMimeTypeFromFormat,
  getImageFromQuery,
} = require("../utils/image");
const { filterAndValidateQuery } = require("../utils/query");
const path = require("path");
const { app_domain } = require("../config");
const { enableCors } = require("../middlewares/cors");

const validQueries = [
  "h",
  "w",
  "format",
  "q",
  "fit",
  "position",
  "b",
  "brightness",
  "saturation",
  "hue",
  "tint",
  "grayscale",
  "greyscale",
];

// multer config
const uploader = multer({
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    if (
      fileExtension !== ".png" &&
      fileExtension !== ".jpg" &&
      fileExtension !== ".webp" &&
      fileExtension !== ".jpeg"
    ) {
      cb(
        "this image file extension is not supported by our system.(supported extension png, jpg, jpeg, webp)",
        null
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 10, //10 mb
  },
});

// create image
router.post(
  "/images/upload",
  enableCors,
  uploader.single("image"),
  async (req, res) => {
    try {
      if (!req.file) throw new Error("Enter image file");
      let { mimetype, buffer, size } = req.file;

      const query = filterAndValidateQuery(req.query, validQueries);
      const queryKeys = Object.keys(query);

      if (queryKeys.length > 0) {
        // get new mimetype of given formate from query
        if (queryKeys.includes("format")) {
          mimetype = getImageMimeTypeFromFormat(req) || mimetype;
        }
        // apply query filters to image
        buffer = await getImageFromQuery(buffer, mimetype.split("/")[1], query);
      }

      const newImage = new Image({ mimetype, src: buffer, size });
      await newImage.save();
      res.send({
        imageId: newImage._id,
        url: `${app_domain}/images/${newImage._id}`,
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

// get image
router.get("/images/:imageId", async (req, res) => {
  const { imageId } = req.params;

  const query = filterAndValidateQuery(req.query, validQueries);
  const queryKeys = Object.keys(query);

  try {
    if (!imageId) throw new Error("Enter image id");
    // find image
    const foundImage = await Image.findOne({ _id: imageId });
    if (!foundImage) throw { code: 404, message: "Image not found" };

    const imageToSend = { src: foundImage.src, mimetype: foundImage.mimetype };

    if (queryKeys.length > 0) {
      // get new mimetype of given formate from query
      if (queryKeys.includes("format")) {
        imageToSend.mimetype =
          getImageMimeTypeFromFormat(req) || imageToSend.mimetype;
      }
      // apply query filters to image
      imageToSend.src = await getImageFromQuery(
        imageToSend.src,
        imageToSend.mimetype.split("/")[1],
        query
      );
    }

    // set headers to display image
    res.set("Content-type", imageToSend.mimetype);
    res.send(imageToSend.src);
  } catch (error) {
    const { message, code } = error;
    res.status(code || 400).send({ error: message });
  }
});

// update image
router.put(
  "/images/:imageId",
  enableCors,
  uploader.single("image"),
  async (req, res) => {
    const { imageId: _id } = req.params;
    try {
      if (!req.file) throw new Error("Enter image file.");
      const foundImage = await Image.findOne({ _id });

      if (!foundImage) throw { code: 404, message: "Image not found!" };
      // set data of file
      const { mimetype, buffer, size } = req.file;
      foundImage.mimetype = mimetype;
      foundImage.src = buffer;
      foundImage.size = size;
      await foundImage.save();
      res.send();
    } catch (error) {
      const { message, code } = error;
      res.status(code || 400).send({ error: message });
    }
  }
);

// delete image
router.delete("/images/:imageId", enableCors, async (req, res) => {
  const { imageId: _id } = req.params;
  try {
    const foundImage = await Image.findOne({ _id });
    if (!foundImage) throw { code: 400, message: "Image not found" };
    await foundImage.remove();
    res.send();
  } catch (error) {
    const { message, code } = error;
    res.status(code || 400).send({ error: message });
  }
});

module.exports = router;
