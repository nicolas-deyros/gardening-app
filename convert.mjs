import pngToIco from 'png-to-ico';
import fs from 'fs';

pngToIco('public/favicon.png')
  .then(buf => {
    fs.writeFileSync('public/favicon.ico', buf);
    console.log('Created public/favicon.ico');
  })
  .catch(console.error);
