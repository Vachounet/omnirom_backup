var request = require('async-request');
const fs = require('fs').promises;
var workDir = process.argv[2];

(async () => {
    var body = await request("https://dl.omnirom.org/images/wallpapers/thumbs/json_wallpapers_xml.php");

    var jsonObj = JSON.parse(body.body);

    for (wall in jsonObj) {
        body = await request("https://dl.omnirom.org/images/wallpapers/thumbs/" + jsonObj[wall].filename);
        await fs.writeFile(workDir + '/backup/wallpapers/thumbs/' + jsonObj[wall].filename, body.body);
        body = await request("https://dl.omnirom.org/images/wallpapers/" + jsonObj[wall].filename);
        await fs.writeFile(workDir + '/backup/wallpapers/' + jsonObj[wall].filename, body.body)
    }
})();


