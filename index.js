const jimp = require("jimp");
const Vibrant = require("node-vibrant");

const { toPalette, toBase64 } = require("./util");

const base64 = file => {
  return new Promise((resolve, reject) => {
    return jimp
      .read(file)
      .then(image => image.resize(10, jimp.AUTO))
      .then(image =>
        image.getBuffer(jimp.MIME_JPEG, (err, data) => {
          if (err) {
            return reject(err);
          }

          if (data) {
            // valid image Base64 string, ready to go as src or CSS background
            return resolve(toBase64(jimp.MIME_JPEG, data));
          }
          return reject(
            new Error('Unhandled promise rejection in base64 promise')
          );
        })
      )
      .catch(err => {
        return reject(err);
      });
  });
};

const palette = file => {
  return new Promise((resolve, reject) => {
    // vibrant library was about 10-15% slower than
    // get-image-colors npm module but provided better
    // and more needed information
    let vibrant = new Vibrant(file, {
      // no special options for now
    });
    vibrant
      .getPalette()
      .then(palette => {
        if (palette) {
          return resolve(toPalette(palette));
        }
        return reject(
          new Error("Unhandled promise rejection in colorPalette", palette)
        );
      })
      .catch(err => {
        return reject(err);
      });
  });
};
process.on("unhandledRejection", up => {
  throw up;
});

module.exports = {
  base64,
  palette
};
