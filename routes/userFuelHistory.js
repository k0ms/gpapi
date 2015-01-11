var db = require('./db').db;
var BSON = require('mongodb').BSONPure;
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
var responseMsg = {'msg': '', 'data': []};



exports.findAll = function(req, res) {
    var id = req.params.id;
    db.collection('user_fuel_history', function(err, collection) {
        collection.find({'vehicle_id': id}).toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};

exports.addFuelHistory = function(req, res) {
    var vehicles = req.body;
    console.log('Adding fuel history: ' + JSON.stringify(vehicles));
    vehicles._id = new ObjectId().toHexString();

    db.collection('user_fuel_history', function(err, collection) {
        collection.insert(vehicles, {safe:true}, function(err, result) {
            if (err) {
                responseMsg.msg = "NG";
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                responseMsg.msg = "OK";
                responseMsg.data = result[0];
            }

            res.send(responseMsg);
        });
    });
}

/*
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving vehicle fuel history: ' + id);

    db.collection('vehicles', function(err, collection) {
        collection.find({'_id': ""+id}, function(err, item) {
            responseMsg.data = [];
            if(err) {
                responseMsg.msg = "NG";
            }
            else {
                if(item === null) {
                    responseMsg.msg = "NOT_FOUND";
                }
                else {
                    responseMsg.msg = "OK";
                    responseMsg.data = item;
                }
            }
            res.send(responseMsg);

        });
    });
};
 
 
exports.addFuelHistory = function(req, res) {
    var fuelHistory = req.body;
    console.log('Adding fuel history: ' + JSON.stringify(fuelHistory));
    fuelHistory._id = new ObjectId().toHexString();

    db.collection('user_fuel_history', function(err, collection) {
        collection.insert(fuelHistory, {safe:true}, function(err, result) {
            if (err) {
                responseMsg.msg = "NG";
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                responseMsg.msg = "OK";
                responseMsg.data = result[0];
            }

            res.send(responseMsg);
        });
    });
};
 



*/