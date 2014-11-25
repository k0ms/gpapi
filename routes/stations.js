var db = require('./db').db;
var BSON = require('mongodb').BSONPure;
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
var responseMsg = {'msg': '', 'data': []};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving vehicles: ' + id);
    db.collection('stations', function(err, collection) {
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
 
exports.findAllVehicles = function(req, res) {

    db.collection('vehicles', function(err, collection) {
        collection.find().toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};

/*exports.addStations = function(req, res) {
    var vehicles = req.body;
    console.log('Adding vehicles: ' + JSON.stringify(vehicles));
    vehicles._id = new ObjectId().toHexString();
    vehicles.date_created = formatDate();

    db.collection('vehicles', function(err, collection) {
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
}*/
 
exports.updateStations = function(req, res) {
    var id = req.params.id;
    var vehicles = req.body;
    vehicles.date_modified = formatDate();

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
                responseMsg.data = vehicles;
                res.send(responseMsg);
            }
        });
    });
}
 
exports.deleteStations = function(req, res) {
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

function formatDate() {

    //2014_09_30_11_00_46_320", "date_modified" : "2014_09_30_11_00_46_320", "row_status" : "" }

    var dte = new Date();

    var ret = dte.getFullYear() + '_';
    ret += (dte.getMonth() + 1) + '_' ;
    ret += dte.getDate() + '_';
    ret += dte.getHours() + '_';
    ret += dte.getMinutes() + '_';
    ret += dte.getSeconds() + '_';
    ret += dte.getMilliseconds() + '';

    return ret;
}



exports.addStation = function(req, res){

	console.log(req.files);
	console.log(req);
    var file = req.files.file;
    console.log('uploads/'+file.name);
};