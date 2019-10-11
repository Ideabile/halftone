const sharp = require('sharp');

module.exports = (svg, size = { width: 2000, height: 2000}, background = { r: 255, g: 255, b: 255, alpha: 0 }) => sharp(Buffer.from(svg), { density: 300 })
    .resize(size.width, size.height)
    .png()
    .toBuffer();
