var db = require('./db').db;
var BSON = require('mongodb').BSONPure;
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
var responseMsg = {'msg': '', 'data': []};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving users: ' + id);
    db.collection('users', function(err, collection) {
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
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};
 
exports.addUsers = function(req, res) {
    var users = req.body;
    console.log('Adding users: ' + JSON.stringify(users));
    console.log('password users: '+ JSON.stringify(users.password));
    users._id = new ObjectId().toHexString();

    users.password = crypto.createHash('md5').update( JSON.stringify(users.password) ).digest("hex");
    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateUsers = function(req, res) {
    var id = req.params.id;
    var users = req.body;
    console.log('Updating users: ' + id);
    console.log(JSON.stringify(users));
    db.collection('users', function(err, collection) {
        collection.update({'_id': ""+id}, {'$set': users}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating users: ' + err);
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
 
exports.deleteUsers = function(req, res) {
    var id = req.params.id;
    
    console.log('Deleting users: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':  ""+ id}, {safe:true}, function(err, result) {
            
            if (err) {
                res.send({'msg': 'NG'});
            } else {
                res.send({'msg': 'OK', 'data': { 'result': result}});
            }
        });
    });
}

exports.authenticate = function(req, res) {
    var user = req.body;    
    console.log(JSON.stringify(user));
    console.log(JSON.stringify(user.password));
    user.password = crypto.createHash('md5').update( JSON.stringify(user.password) ).digest("hex");
    console.log(JSON.stringify(user.password));
    db.collection('users', function(err, collection) {
        collection.findOne({'email': user.email}, function(err, item) {
            console.log(item.password);
            if(err) {
                res.send({'msg': 'NG'});
                console.log("authorized");
            }
            else {
                if(item) {
                    if(JSON.stringify(user.password )== JSON.stringify(item.password))
                    res.send({"msg":'OK', 'data': item});
                    else
                        res.send({'msg': 'NOT_AUTHORIZED'});
                }
                else
                res.send({'msg': 'NOT_AUTHORIZED'});
            }
        });
    });
}



