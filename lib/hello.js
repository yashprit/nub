var prompt = require('prompt');
var fs = require('fs');
var Github = require("github-api");
var http = require('http');
var file = require('./vim');

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

var request = require('request');
  prompt.start();
  prompt.get(['username', 'password'], function (err, result) {
    var username =  result.username;
    var password = result.password;
    if(username || password) {
        var github = new Github({
          username: username,
          password: password,
          auth: "basic"
        });
        var user = github.getUser();
        user.gists(function(err, gists) {
          var fileName = [];
          gists.forEach(function(gist){
            for(var key in gist.files) {
              var obj = {
                fileName: key,
                fileURL: gist.files[key].raw_url
              }
              fileName.push(obj);
            }
          });
          console.log(fileName);

          request(fileName[0].fileURL, function(error, response, body) {

  file.open(body, getExtension(fileName[0].fileName))
});

        });
    } else {
      throw new Error("Username and password not provided")
    }
  });
