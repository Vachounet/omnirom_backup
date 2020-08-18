const fs = require('fs').promises;
const path = require('path');
var express = require("express");
var app = express();
var serveIndex = require('serve-index')
var parseString = require('xml2js').parseString;

const workDir = process.argv[3]
const port = process.argv[2]

const listFiles = async (dir, filter, filelist = []) => {
  const files = await fs.readdir(dir);

  for (file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);

    if (stat.isDirectory()) {
      filelist = await listFiles(filepath, filter, filelist);
    } else {
      if (filter && filter === "headers") {
        if (!filepath.includes(".png") && !filepath.includes(".jpg")) {
          continue;
        }
        filelist.push({ "filename": filepath.split(workDir +"/headers/thumbs/")[1], "timestamp": stat.birthtime.getTime() });

      } else if (filter && filter === "builds") {
        filelist.push({ "filename": "." + filepath.split(workDir +"/builds")[1], "timestamp": stat.birthtime.getTime() });
      } else if (filter && filter === "wallpapers") {
        if (!filepath.includes(".png") && !filepath.includes(".jpg")) {
          continue;
        }
        filelist.push({ "filename": filepath.split(workDir +"/wallpapers/thumbs/")[1], "timestamp": stat.birthtime.getTime() });
      }
    }
  }

  return filelist;
}

const parseWallpapersXML = async (xmlPath, files, res) => {
  var content = await fs.readFile(xmlPath);
  var output = new Array();

  parseString(content.toString(), function (err, result) {
    let walls = result.wallpapers.wallpaper;
    for (wall in walls) {
      output[wall] = walls[wall].$;
    }
    enrichWallpapersFileList(files, output, res)
  });
}

const enrichWallpapersFileList = async (fileList, headersXML, res) => {
  for(file in fileList){
    var filename = fileList[file].filename

   var headerInfos = headersXML.filter(head => head.filename === filename);
    
    if (filename && headerInfos.length === 1) {
      fileList[file] = headerInfos[0]
    }
  }
  res.send(JSON.stringify(fileList))
}

app.get("/getBuilds", (req, res, next) => {
  (async () => {
    var result = await listFiles(workDir +"/builds", "builds")
    res.send(JSON.stringify(result));
  })();
});

app.get("/getHeaders", (req, res, next) => {
  (async () => {
    var files = await listFiles(workDir +"/headers/thumbs", "headers")
    res.send(JSON.stringify(files));
  })();
});

app.get("/getWallpapers", (req, res, next) => {
  (async () => {
    var files = await listFiles(workDir +"/wallpapers/thumbs", "wallpapers")
    parseWallpapersXML(workDir +"/wallpapers/thumbs/wallpapers.xml", files, res)
  })();
});

app.get("/getStore", (req, res, next) => {

  (async () => {
    var content = await fs.readFile('../backup/store/apps.json')
    res.send(content.toString());
  })();
});

app.get("/api", (req, res, next) => {
  var output = "/getStore - get apps.json content <br /><br />"
  output += "/getWallpapers - lists available wallpapers <br /><br />"
  output += "/getHeaders - lists available headers <br /><br />"
  output += "/getBuilds - lists available official builds <br /><br />"
    res.send(output);
});

app.use('/', express.static('../backup'), serveIndex('../backup/builds', { 'icons': true }))

app.listen(port, () => {
  console.log("Server running on port " + port);
});
