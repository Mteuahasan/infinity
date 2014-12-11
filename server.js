var http = require('http');
var url  = require('url');
var path = require('path');
var fs   = require('fs');
var color = require('colors');

var port = process.argv[2] || 3000;

var mimeTypes = {
  'htm': 'text/html',
  'html': 'text/html',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'js': 'text/javascript',
  'css': 'text/css'
};

var server = http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404 Not Found\n');
      res.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, 'binary', function(err, file) {
      if(err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write(err + '\n');
        res.end();
        return;
      }

      var mimeType = mimeTypes[path.extname(filename).split('.')[1]];
      res.writeHead(200, {'Content-Type': mimeType});
      res.write(file, 'binary');
      res.end();
    });
  });
});

server.listen(port);

console.log(('Static file server running at\n  => http://localhost:' + port).green);
