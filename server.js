var express = require('express');
var users = require('./routes/users');
var vehicles  = require('./routes/vehicles');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

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


app.listen(8080);
console.log('Listening on port 8080...');
