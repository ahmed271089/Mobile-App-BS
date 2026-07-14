const Jimp = require("jimp");

Jimp.read("assets/images/logo.png")
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // If pixel is near white
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // Make it fully transparent
      }
    });
    return image.writeAsync("assets/images/logo.png");
  })
  .then(() => {
    console.log("Background removed successfully!");
  })
  .catch(err => {
    console.error(err);
  });
