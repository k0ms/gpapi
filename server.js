var express = require('express');
var users = require('./routes/users');
var vehicles  = require('./routes/vehicles');
var feeds = require('./routes/feeds')
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
var port = process.env.PORT || 3000;

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUsers);
app.put('/users/:id', users.updateUsers);
app.delete('/users/:id', users.deleteUsers)

app.post('/auth', users.authenticate);

app.get('/vehicles', vehicles.findAll);
app.get('/vehicles/:id', vehicles.findById);
app.post('/vehicles', vehicles.addVehicles);
app.put('/vehicles/:id', vehicles.updateVehicles);
app.delete('/vehicles/:id', vehicles.deleteVehicles)

app.post('/feeds', feeds.findAll);
app.post('/feeds/:id', feeds.findById);

app.listen(port);
console.log('Listening on port 8080...');
