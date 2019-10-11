const svgToPng = require('../packages/svg-to-png');
const fs = require('fs');
const [, , origin, destination] = process.argv;
const svg = fs.readFileSync(origin);

svgToPng(svg).then(png => fs.writeFileSync(destination, png));
