var express = require('express');
var users = require('./routes/users');
var vehicles  = require('./routes/vehicles');
var feeds = require('./routes/feeds')
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

app.get('/feeds', feeds.findAll);
app.get('/feeds/:id', feeds.findById);
app.get('/promos', feeds.promos);
app.get('/tips', feeds.tips);
app.get('/news', feeds.news);

app.listen(8080);
console.log('Listening on port 8080...');
