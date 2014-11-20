var db = require('./db').db;
var BSON = require('mongodb').BSONPure;
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
var responseMsg = {'msg': '', 'data': []};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving vehicles: ' + id);
    db.collection('vehicles', function(err, collection) {
        collection.findOne({'_id': ""+id}, function(err, item) {
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
 
exports.findAll = function(req, res) {
    var id = req.params.id;
    db.collection('vehicles', function(err, collection) {
        collection.find({'user_id': id}).toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};
 
exports.addVehicles = function(req, res) {
    var vehicles = req.body;
    console.log('Adding vehicles: ' + JSON.stringify(vehicles));
    vehicles._id = new ObjectId().toHexString();

    db.collection('vehicles', function(err, collection) {
        collection.insert(vehicles, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateVehicles = function(req, res) {
    var id = req.params.id;
    var vehicles = req.body;
    console.log('Updating vehicles: ' + id);
    console.log(JSON.stringify(vehicles));
    db.collection('vehicles', function(err, collection) {
        collection.update({'_id': ""+id}, {'$set': vehicles}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating vehicles: ' + err);
                responseMsg.msg = "NG";
                res.send(responseMsg);

            } else {
                console.log('' + result + ' document(s) updated');
                responseMsg.msg = "OK";
                responseMsg.data = users;
                res.send(responseMsg);
            }
        });
    });
}
 
exports.deleteVehicles = function(req, res) {
    var id = req.params.id;
    
    console.log('Deleting users: ' + id);
    db.collection('vehicles', function(err, collection) {
        collection.remove({'_id':  ""+ id}, {safe:true}, function(err, result) {
            
            if (err) {
                res.send({'msg': 'NG'});
            } else {
                res.send({'msg': 'OK', 'data': { 'result': result}});
            }
        });
    });
}
