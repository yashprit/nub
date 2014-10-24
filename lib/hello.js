var prompt = require('prompt');
var fs = require('fs');
var Github = require("github-api");
var http = require('http');

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
              fileName.push(gist.files[key])
            }
          });
          console.log(fileName);


          request(fileName[0].raw_url, function(error, response, body) {
  console.log(body);
});

        });
    } else {
      throw new Error("Username and password not provided")
    }
  });
