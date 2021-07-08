const sharp = require("sharp");

const getImageMimeTypeFromFormat = (req) => {
  const format = req.query.format;
  let formatToSend = undefined;

  const supportedFormats = ["jpeg", "jpg", "webp", "png"];

  if (supportedFormats.includes(format)) {
    formatToSend = `image/${format}`;
  } else {
    if (format === "auto" && req.get("Accept").includes("image/webp")) {
      formatToSend = "image/webp";
    }
  }
  return formatToSend;
};

const getValidOptions = (options) => {
  const validOptions = options;
  if (
    validOptions.hasOwnProperty("q") &&
    !(validOptions.q >= 0 && validOptions.q <= 100)
  ) {
    validOptions.q = 100;
  }

  if (validOptions.hasOwnProperty("b")) {
    if (validOptions.b < 0.3 || validOptions.b > 1000) delete validOptions.b;
  }
  if (validOptions.hasOwnProperty("position")) {
    const validPosition = [
      "top",
      "bottom",
      "right",
      "right top",
      "right bottom",
      "left",
      "left top",
      "left bottom",
    ];
    if (!validPosition.includes(validOptions.position))
      delete validOptions.position;
  }
  if (
    validOptions.hasOwnProperty("brightness") &&
    validOptions.brightness < 0
  ) {
    delete validOptions.brightness;
  }

  if (
    validOptions.hasOwnProperty("saturation") &&
    validOptions.saturation < 0
  ) {
    delete validOptions.saturation;
  }
  return validOptions;
};

const convertColorStringToObject = (colorStr) => {
  const str = colorStr.slice(1).slice(0, -1).split(",");

  return str.reduce((colors, colorStr) => {
    const [colorKey, colorValue] = colorStr.split("=");
    colors[colorKey.toString().trim()] = parseInt(colorValue.trim());
    return colors;
  }, {});
};

const getImageFromQuery = async (imageBuffer, format, options) => {
  const {
    h,
    w,
    q,
    fit,
    position,
    b,
    brightness,
    saturation,
    hue,
    tint,
    grayscale,
    greyscale,
  } = getValidOptions(options);
  const outputOptions = { quality: q };
  const resizeOptions = { fit, position };
  let image = sharp(imageBuffer);

  if (h || w || Object.keys(resizeOptions).length > 0) {
    image = image.resize(w, h, resizeOptions);
  }

  if (b) {
    image = image.blur(b);
  }
  if (tint) {
    const { r, g, b } = convertColorStringToObject(tint);
    if (!r || !g || !b) throw new Error("Enter valid tint color=(r,g,b)");
    image = image.tint({ r, g, b });
  }

  if (greyscale) {
    image = image.greyscale();
  }

  if (grayscale) {
    image = image.grayscale();
  }

  if (brightness || saturation || hue) {
    const modulateOptions = {};
    if (brightness) modulateOptions["brightness"] = brightness;
    if (saturation) modulateOptions["saturation"] = saturation;
    if (hue) modulateOptions["hue"] = hue;

    image = image.modulate(modulateOptions);
  }
  if (format === "webp") {
    image = image.webp(outputOptions);
  }
  if (format === "jpg" || format === "jpeg") {
    image = image.jpeg(outputOptions);
  }
  if (format === "png") {
    image = image.png(outputOptions);
  }
  return await image.toBuffer();
};

module.exports = {
  getImageMimeTypeFromFormat,
  getImageFromQuery,
};
