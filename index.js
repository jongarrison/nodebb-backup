#! /usr/bin/env node
var nodeCLI = require('shelljs-nodecli');
var fs = require('fs-extra');
var tar = require('tar-fs');
var path = require('path');
var moment = require('moment');

console.log('Preparing to backup NodeBB in this directory');
var pwd = nodeCLI.exec('pwd', '', {silent:true}).output.trim();
console.log("Present Working Directory: " + pwd);


//---------------------------------------------
//Find and load config.json settings for NodeBB, give warning and exit if not Mongo
//---------------------------------------------


var configPath = path.join(pwd, "/config.json");
console.log("Loading: " + configPath);

var configContents;
try {
  configContents = fs.readFileSync(configPath, 'utf8');
} catch (err) {
    console.log("Unable to load necessary nodebb config.json file: " + configPath);
    throw err;
}

var config = JSON.parse(configContents);
if (config.database !== "mongo") {
  throw new Error("Currently this script only works with backing up mongo.  Want to improve it?  https://github.com/jongarrison/nodebb-backup")
}

console.log("Found db config info for: " + config.mongo.database);


//---------------------------------------------
//Find and load current NodeBB version name from package.json (like: 0.7.3)
//---------------------------------------------


var packagePath = path.join(pwd, "/package.json");
console.log("Loading: " + packagePath);

var packageContents;
try {
  packageContents = fs.readFileSync(packagePath, 'utf8');
} catch (err) {
  console.log("Unable to load necessary nodebb package.json file: " + packagePath);
  throw err;
}

var package = JSON.parse(packageContents);

console.log("Found NodeBB version: " + package.version);


//---------------------------------------------
//Create temp-backup directory to load back up files into
//---------------------------------------------


var tempBackupDir = path.join(pwd, "/temp-backup");
console.log("creating temp backup directory at: " + tempBackupDir);
try {
  if (fs.existsSync(tempBackupDir)) {
    //try to clean it up
    fs.removeSync(tempBackupDir);
    if (fs.existsSync(tempBackupDir)) { throw new Error("Unable to remove dir"); }
  }
} catch (err) {
  console.log("Unable to continue.  Dirty backup dir already exists at: " + tempBackupDir + "\n" + err);
  process.exit(1);
}

fs.mkdirSync(tempBackupDir);


//---------------------------------------------
//MongoDump into temp-backup directory
//---------------------------------------------


console.log("About to backup db: " + config.mongo.database);

nodeCLI.exec(
    'mongodump',
    '-v',
    '-d', config.mongo.database,
    '-u', config.mongo.username,
    '-p', config.mongo.password,
    '-o', tempBackupDir,
    '-h', config.mongo.host + ":" + config.mongo.port
);


//---------------------------------------------
//Get the uploaded files, including avatars
//---------------------------------------------


var uploadPath = path.join(pwd, "/public/uploads");
var backUploadPath = path.join(tempBackupDir, "/uploads");

console.log("Copying uploaded images in: " + uploadPath);
fs.copySync(uploadPath, backUploadPath);


//---------------------------------------------
//Now tar them up, give them a reasonable name and move the whole thing up one directory to get out of this git repo
//---------------------------------------------


var timeString = moment().format("YYYY-MM-DD_HHmm");

var backupFileName = "nodebb-backup-" + timeString + "-v" + package.version + ".tar";
var outputFilePath = path.join(pwd, "..", backupFileName);

console.log("Creating compressed backup file: " + outputFilePath);

tar.pack(tempBackupDir)
    .on('error',
      function(err) {
        console.log("Error creating compressed backup file: " + err);
      }
    ).pipe(fs.createWriteStream(outputFilePath))
    .on('finish',
      function(data) {
        //cleaning up
        fs.remove(tempBackupDir);
        console.log("Done and cleaned up");
      }
    );

