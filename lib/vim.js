var tty = require('tty');
var child_process = require('child_process');
var fs = require('fs');
var tmp = require('tmp');

function spawnVim(file, cb) {
  var vim = child_process.spawn( 'vim', [file])

  function indata(c) {
    vim.stdin.write(c);
  }
  function outdata(c) {
    process.stdout.write(c);
  }

  process.stdin.resume();
  process.stdin.on('data', indata);
  vim.stdout.on('data', outdata);
  tty.setRawMode(true);

  vim.on('exit', function(code) {
    console.log(code);
    tty.setRawMode(false);
    process.stdin.pause();
    process.stdin.removeListener('data', indata);
    vim.stdout.removeListener('data', outdata);
    cb(code);
  });
}

module.exports.open = function open(data, ext){
  tmp.file({ mode: 0644, prefix: 'prefix-', postfix: ext }, function _tempFileCreated(err, path, fd) {
    if (err) throw err;
    console.log("File: ", path);
    console.log("Filedescriptor: ", fd);
    fs.writeFile(path, data, function(err){
      if(err) throw new Error(err, "error occured files writing file");
      spawnVim(path, function(code) {
        if (code == 0) {
          fs.readFile(path, function(err, data) {
            if (!err) {
              console.log(data.toString());
            }
          });
        }
      });
    })
  });

}
