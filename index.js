var express = require('express'); 
var router = express.Router(); 
var fs = require('fs'); //require filesystem module 
var url = require('url');
var App = express();
var device = require('express-device');

App.use(device.capture());
function isMobile(req, res, next) {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      req.headers["user-agent"]
    )
  ) {
    // Instead of redirecting to another view you can also render a separate
    // view for mobile view e.g. res.render('mobileview');

    res.render('team', { title: 'We make it for you ', device: 'Mobile' });
  } else {
    res.render('team', { title: 'We make it for you ', device: 'Desktop/Tablet' });
  }
}

/* GET home page. */ 
router.get('/', function(req, res, next) {
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  
  filename = __dirname + '/index.html' // do something
  fs.readFile(filename, function(err, data) { //read file index.html in public folder 
  if (err) { 
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      res.sendFile(index.html) 
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      // res.render('index', { title: 'New to Express' });
      console.error('error' + __dirname);
    }
    res.render('index', { title: 'We make it for you' });
    //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
    //res.write(data); //write data from index.html 
    console.log('Page sent: ' + filename + '  /routers/Index.pug'); 
    //return res.end();
  });
});

router.get('/home/authors', isMobile, function(req, res, next) { 
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  var userDevice = req.device.type.toUpperCase();
  
  filename = __dirname + '/fbr.html' // do something 
  fs.readFile(filename, function(err, data) {  //read file fbr.html in public folder
    if (err) { 
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      res.sendFile(index.html) 
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      // res.render('index', { title: 'New to Express' });
      console.error('error' + __dirname);
    }
    
    //res.render('team', { title: 'We make it for you ', device: userDevice });
    //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
    //res.write(data); //write data from fbr.html 
    console.log('Page sent: ' + filename); 
    //return res.end();
  });
});

router.get('/home/projects', function(req, res, next) { 
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  
  filename = __dirname + '/fmrk.html' // do something 
  fs.readFile(filename, function(err, data) { //read file index.html in public folder
    if (err) { 
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      res.sendFile(index.html) 
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      // res.render('index', { title: 'New to Express' });
      console.error('error' + __dirname);
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
    res.write(data); //write data from index.html 
    console.log('Page sent: ' + filename); 
    return res.end();
  });
});
module.exports = router; 
process.on('SIGINT', function () { //on ctrl+c 
  process.exit(); //exit completely
});
