var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url')
http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  var q = url.parse(req.url, true);
  var filename = __dirname + q.pathname;
  var trim_name = q.pathname.replace(/^\s*|\s*$/g, ''); // left and right trim

  if (!(trim_name) || (trim_name.length <= 1)) {
   filename = __dirname + '/index.html' // do something
  } 
  fs.readFile(filename, function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      console.error('error' +  __dirname);
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    console.log('Page sent: ' + filename);
    return res.end();
  });
}
process.on('SIGINT', function () { //on ctrl+c
  process.exit(); //exit completely
});  
