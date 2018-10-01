var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var useLocalEndpoint = true; // lance un endpoint fuseki local (https://github.com/scenaristeur/fuseki)

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

server.listen(port, ip, function() {
  console.log('Server running on http://%s:%s', ip, port);
  //  console.log('Server listening at port %d', port);
});

//app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res){
  //  console.log(req.originalUrl);
  //  console.log(res);
  //nécessaire pour ne pas avoir des cannot get sur http://127.0.0.1:3000/view2
  res.sendFile("index.html", {root: '.'});
});

if (useLocalEndpoint){
  var path = require('path');

  var serverHome =  path.join(__dirname, '../fuseki/');
  console.log(serverHome)
  var FusekiServer = require('fuseki');
  var fusekiServer = new FusekiServer({'home': serverHome , 'url': 'http://127.0.0.1:3030'});
  //console.log(fusekiServer)
  fusekiServer.start().then(function(s){
      console.log("Serveur Fuseki sur port 3030")
      //console.log(fusekiServer.datasets())
  });


}

io.sockets.on('connection', function (socket) {
console.log("connexion de "+socket.id)
console.log(fusekiServer.options.url)
fusekiServer.datasets().then(function(ds){
  console.log(ds)
  socket.send()
});
});
