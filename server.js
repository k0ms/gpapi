var express = require('express');
var users = require('./routes/users');
var vehicles  = require('./routes/vehicles');
var feeds = require('./routes/feeds');
var stations = require('./routes/stations');
var userFuelHistory = require('./routes/userFuelHistory');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
require('./schema/comments')();
require('./schema/users')();
require('./schema/stations')();
require('./schema/userFuelHistory')();
require('./schema/vehicles')();
require('./schema/rating')();
require('./schema/franchises')();
require('./schema/fuels')();
require('./schema/franchise_fuels')();

var comments = require('./routes/comments');
var user_fuel_history = require('./routes/userFuelHistory2');
var ratings = require('./routes/rating');
var stationsMongoose = require('./routes/stationsMongoose');
var fuels = require('./routes/fuels');

var connect = function() {
	var options = {server: {socketOptions: {keepAlive:1}}};
	mongoose.connect('mongodb://gasgas:irvingdelacruz77@162.243.94.60:27017/gasgas',options);
};

connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

app.use(multer({dest:'./uploads'}));

app.use(bodyParser.json());
var port = process.env.PORT || 3003;

app.get('/comments', comments.index);
app.post('/comments', comments.addComments);
app.get('/comments/:id', comments.findById);

app.get('/user_fuel_history', user_fuel_history.index);

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUsers);
app.put('/users/:id', users.updateUsers);
app.delete('/users/:id', users.deleteUsers)

app.post('/auth', users.authenticate);
app.post('/stations', stations.addStation );

app.get('/vehicles/user/:id', vehicles.findAll);
app.get('/vehicles', vehicles.findAllVehicles);
app.get('/vehicles/:id', vehicles.findById);
app.post('/vehicles', vehicles.addVehicles);
app.put('/vehicles/:id', vehicles.updateVehicles);
app.delete('/vehicles/:id', vehicles.deleteVehicles)

app.get('/feeds', feeds.findAll);
app.get('/feeds/:id', feeds.findById);

app.get('/fuelhistory/:id', userFuelHistory.findAll);
app.post('/fuelhistory', userFuelHistory.addFuelHistory)

app.get('/rating/:id', ratings.getStationRating);
app.get('/rating/', ratings.getUserStationRating);
app.post('/rating/', ratings.updateUserRating);

app.get('/stationsMongoose/', stationsMongoose.findAll);

app.get('/fuels/', fuels.findAll);
app.get('/fuels/:id', fuels.findById);

app.get('/fueltype/', fuels.findFuelTypeDistinct);

app.listen(port);
console.log('Listening on port 8080...');
