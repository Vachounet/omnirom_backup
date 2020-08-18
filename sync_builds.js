var request = require('async-request');
const fs = require('fs');
var workDir = process.argv[2];

(async () => {

    var body = await request("http://dl.omnirom.org/json.php");

    var json = JSON.parse(body.body);

    for (var i = 0; i < Object.keys(json).length; i++) {
        var key = Object.keys(json)[i];
        var obj = json[key];

        if (Array.isArray(obj) && obj.length > 0) {
            var buildsToUpload = obj.filter(build => build.filename.includes("omni-10-") && new Date(build.timestamp * 1000 + 12096e5) > Date.now());
            if (buildsToUpload.length > 0) {
                for (build in buildsToUpload){
                    var url = buildsToUpload[build].filename.replace("./", "http://dl.omnirom.org/");
                    var device = buildsToUpload[build].filename.split("/")[1];
                    var build = buildsToUpload[build].filename.split("/")[2];
                    var dlPath = workDir+'/builds/' + device;
                    if (fs.existsSync(dlPath + build)) {
                        console.log(build + " already downloaded");
                        continue;
                    }

                    console.log("Uploading " + build + " to " + dlPath);

                    await execShellCommand('aria2c -s 16 -x 16 -d '+ dlPath + ' ' + url);
                }
            }
        }
    }

})();

function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
   }