const fs = require('fs');
const content = fs.readFileSync('assets/vendor/world.js', 'utf8');
const regex = /([A-Z]{2}):\{path:"[^"]+",name:"([^"]*Korea[^"]*)"/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log('Code for', match[2], ':', match[1]);
}
