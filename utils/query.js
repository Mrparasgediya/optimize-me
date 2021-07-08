const filterAndValidateQuery = (query, validQueries) => {
  // filter query keys
  let queryKeys = Object.keys(query).filter((key) =>
    validQueries.includes(key)
  );
  if (query.hasOwnProperty("w")) query["w"] = parseInt(query["w"]);
  if (query.hasOwnProperty("h")) query["h"] = parseInt(query["h"]);
  if (query.hasOwnProperty("q")) query["q"] = parseInt(query["q"]);
  if (query.hasOwnProperty("b")) query["b"] = parseInt(query["b"]);
  if (query.hasOwnProperty("brightness"))
    query.brightness = parseFloat(query.brightness);
  if (query.hasOwnProperty("saturation"))
    query.saturation = parseFloat(query.saturation);
  if (query.hasOwnProperty("hue")) query.hue = parseFloat(query.hue);
  if (query.hasOwnProperty("grayscale"))
    query.grayscale = query.grayscale === "true" ? true : false;
  if (query.hasOwnProperty("greyscale"))
    query.greyscale = query.greyscale === "true" ? true : false;

  if (query.hasOwnProperty("position") && query.position.includes("-"))
    query.position = query.position.replace("-", " ");

  // delete invalid keys
  Object.keys(query).forEach(
    (key) => !queryKeys.includes(key) && delete query[key]
  );

  return query;
};

module.exports = { filterAndValidateQuery };
