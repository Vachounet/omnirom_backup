var request = require('async-request');
const fs = require('fs').promises;
var workDir = process.argv[2];

(async () => {
    var body = await request("https://dl.omnirom.org/images/headers/thumbs/json_headers_xml.php");

    var jsonObj = JSON.parse(body.body);

    for (header in jsonObj) {
        body = await request("https://dl.omnirom.org/images/headers/thumbs/" + jsonObj[header].filename);
        await fs.writeFile(workDir + '/headers/thumbs/' + jsonObj[header].filename, body.body);
        body = await request("https://dl.omnirom.org/images/headers/" + jsonObj[header].filename);
        await fs.writeFile(workDir + '/backup/headers/' + jsonObj[header].filename, body.body);
    }
})();
