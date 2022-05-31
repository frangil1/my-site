var express = require('express'); 
var bodyParser = require('body-parser');
var router = express.Router(); 
var fs = require('fs'); //require filesystem module 
var url = require('url');
const request = require('request');
var device = require('express-device');
const { response } = require('../app');
var App = express();
var textBoxContact = {};

 
//- required by express-recaptcha in order to get data from body or query.
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));

var Title = 'Have an idea? I can make it happen!'

App.use(device.capture());
function isMobile(req, res, next) {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      req.headers["user-agent"]
    )
  ) {
    return('Mobile')
  } else {
    return('Desktop/Tablet')
  }
}

function GetUserIp(req){
/*  const parseIp = (req) =>
    (typeof req.headers['x-forwarded-for'] === 'string'
        && req.headers['x-forwarded-for'].split(',').shift())
    || req.connection?.remoteAddress
    || req.socket?.remoteAddress
    || req.connection?.socket?.remoteAddress

  return(parseIp(req))
*/
  return (req.ip)
}

// Function: get home page for GET/POST request for this static CV web page
//
function getHomePage(req, res, next){
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  
  var userDevice = isMobile(req); 
  res.render('indexMobile', { title: Title, device: userDevice, contact: 'get', req:req });
  console.log('Page sent: ' + filename + '  /routers/Index.pug');
}
router.get('/', getHomePage);
router.post('/', getHomePage);


/* GET home page. */ 
// router.get('/', function(req, res, next) {
//   var q = url.parse(req.url, true); 
//   var filename = __dirname + q.pathname; 
  
//   var userDevice = isMobile(req); 
//   filename = __dirname + '/index.html' // do something
//   fs.readFile(filename, function(err, data) { //read file index.html in public folder 
//   if (err) { 
//       res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
//       return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
//       console.error('error' + __dirname);
//     }
//     if (userDevice != 'Mobile') {
//       res.render('indexMobile', { title: Title, device: userDevice, contact: 'get', req:req });
//     }
//     else {
//       res.render('indexMobile', { title: Title, device: userDevice, contact: 'get', req:req  });
//     }
//     //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
//     //res.write(data); //write data from index.html 
//     console.log('Page sent: ' + filename + '  /routers/Index.pug'); 
//     //return res.end();
//   });
// });

router.get('/home/authors', function(req, res, next) { 
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  //var userDevice1 = req.device.type.toUpperCase();
  
  var userDevice = isMobile(req); 
  filename = __dirname + '/fbr.html' // do something 
  fs.readFile(filename, function(err, data) {  //read file fbr.html in public folder
    if (err) { 
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      console.error('error' + __dirname);
    }
    
    res.render('team', { title: Title, device: userDevice });
    //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
    //res.write(data); //write data from fbr.html 
    console.log('Page sent: ' + filename); 
    //return res.end();
  });
});

router.get('/home/projects', function(req, res, next) { 
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  
  var userDevice = isMobile(req); 
  var userIp = GetUserIp(req);
  filename = __dirname + '/fmrk.html' // do something 
  fs.readFile(filename, function(err, data) { //read file index.html in public folder
    if (err) { 
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      console.error('error' + __dirname);
    }
    res.render('projects', { title: Title, device: userDevice });
    //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
    //res.write(data); //write data from index.html 
    console.log('Page sent: ' + filename); 
    console.log('User IP address: ' + userIp);
    //return res.end();
  });
});

router.get('/home/contact', function(req, res, next) { 
  var q = url.parse(req.url, true); 
  var filename = __dirname + q.pathname; 
  
  var userDevice = isMobile(req); 
  filename = __dirname + '/fmrk.html' // do something 
  fs.readFile(filename, function(err, data) { //read file index.html in public folder
    if (err) { 
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      console.error('error' + __dirname);
    }
    res.render('contact', {title: 'We will contact you back', device: userDevice, contact: 'get', req:req });
    //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
    //res.write(data); //write data from index.html 
    console.log('Page sent: contact, meth:get'); 
    //return res.end();
  });
});

/******************** User post for contact ***************************/
router.post('/users/contact', function(req, res, next) { 
  
    
      var q = url.parse(req.url, true); 
      var filename = __dirname + q.pathname; 

      var util = require("util");
      console.log(util.inspect(req.body, {showHidden: false, depth: null}));
      console.log('g-recaptcha-response: ' + req.body['g-recaptcha-response']);
      if(req.body === undefined || req.body === '' || req.body === null)
      {
         return res.json({"responseError" : "captcha error"});
      }
      const secretKey = "6Le2kVcaAAAAAO_yqpUhrK4837sVIoHidjVh27pA";
      //console.log(util.inspect(req.body, {showHidden: false, depth: null}));
      const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
      console.log(verificationURL);
      //  request(verificationURL,function(error,response,body) {
      //    console.log('In recaptcha response:  ' + response);
      //    body = JSON.parse(body);
      //    console.log('In recaptcha body  ' + body.success);
        
      //    if(body.success !== undefined && !body.success) {
      //      return res.json({"responseError" : "Failed captcha verification"});
      //    }
      //   res.render('contact', { title: 'We will contact you back', device: userDevice, contact: 'post', req:req});
      //   //res.json({"responseSuccess" : "Sucess"});
      // });
      
      // Send email to owner with contact info
      //
      var nodemailer = require('nodemailer');
      //import async from 'async';
      // Sanytizing
      var { name, emailaddss, request} = req.body;
      name = name.replace(/[^A-Za-z, ]/g,'');
      if (emailaddss != emailaddss.replace(/[^A-Za-z0-9_.@-]/g,'')){
          emailaddss = '';
      }
      request = request.replace(/[^A-Za-z0-9, ]/g,'').replace(/['<>]/g,'\\$&');

      const sendEmailFromNotReplay = (message, mailTo) => {
        let transporter2 = nodemailer.createTransport({
          sendmail: true,
          //newline: 'unix',
          path: '/usr/sbin/sendmail'
        });
        console.log(`Replay to send to:  ${mailTo}`) ;
        transporter2.sendMail({
            from: 'DoNotReplay@mail.com',
            to: 'frangilr@hotmail.com',
            subject: 'Message received - Do not replay',
            text: 'Message: ' + message + `\n \nReply to:  ` + mailTo
        }, (err, info) => {
            if (err) return err; //console.log('Send error');
            console.log(`Mail sent to: ${name}  at  ${mailTo}`); 
            //console.log(info.envelope);
            //console.log(info.messageId);
        });
        transporter2.sendMail({
          from: 'DoNotReplay@mail.com',
          to: mailTo,
          subject: 'Message received - Do not replay',
          text: 'Your message: ' + message + `\n \nIt will be replied to:  ` + mailTo
      }, (err, info) => {
          if (err) return err; //console.log('Send error');
          console.log(`Mail sent to: ${name}  at  ${mailTo}`); 
          //console.log(info.envelope);
          //console.log(info.messageId);
      });
      }
      sendEmailFromNotReplay(request, emailaddss, null);
      var fs = require('fs');
      var message = 'Message: ' + request + `\n \nReply_to:  ` + emailaddss;

      let ts = Date.now();

      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let hour = date_ob.getHours();
      let min = date_ob.getMinutes();

      let key = `${date}-${month}-${year}-${hour}:${min}`;
      textBoxContact[key] = {Name: name, Message: request, ReplayTo: emailaddss};
      contactsReceived[key] = {Name: name, Message: request, ReplayTo: emailaddss};
      console.log("JSON.object: " , contactsReceived);
      //textBoxContact = `${textBoxContact}<br/>${message}`;
      fs.appendFile('contacts.txt', message , function (err) {
        if (err) return console.log(err);
          console.log('Contact > contacts.txt');
      });
      fs.appendFile('contacts.txt', '\n------------------------------------------------------------\n' , function (err) {
        if (err) return console.log(err);
      });
      res.render('contact', { title: 'Contact received ', device: userDevice, contact: 'post', req:req});
      var userDevice = isMobile(req); 
      // filename = __dirname + '/fmrk.html' // do something 
      // fs.readFile(filename, function(err, data) { //read file index.html in public folder
      //   if (err) { 
      //     res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error 
      //     return res.end("404 Not Found: " + __dirname + "and " + q.pathname);
      //     console.error('error' + __dirname);
      //   }
        //res.render('contact', { title: 'We will contact you back', device: userDevice, contact: 'post', req:req});
        //res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML 
        //res.write(data); //write data from index.html 
        console.log('Page sent: contact, meth:post'); 
        //return res.end();
      //});
});

// Replay with info received
//
router.get('/users/contact-1', function(req, res, next) { 
  
  var fs = require('fs');
  fs.readFile('contacts.txt', function(err, data) {
    if(err) throw err;
    return res.send([data]);
    // var array = data.toString().split("\n");
    // for(i in array) {
    //     console.log(array[i]);
    // }
  });
  
  return res.send([contactsReceived]);
});


router.get('/users/contact-2', function(req, res, next) { 
  contactsReceived = {};
  return res.send(contactsReceived);
});






module.exports = router; 
process.on('SIGINT', function () { //on ctrl+c 
  process.exit(); //exit completely
});
