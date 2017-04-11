var express = require('express');
var app = express();


app.use(express.static('app/public'));
app.use(express.static('app'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-trix/dist/'));
//Select the port where you will  start serving requests.
app.listen(3000, function () {
  console.log("Listening on port 3000");
});
