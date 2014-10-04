var db = require('./db').db;
var BSON = require('mongodb').BSONPure;
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
var responseMsg = {'msg': '', 'data': []};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving feeds: ' + id);
    db.collection('feeds', function(err, collection) {
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
    db.collection('feeds', function(err, collection) {
        collection.find().toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};


exports.tips = function(req, res) {
    db.collection('feeds', function(err, collection) {
        collection.find().toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};

exports.promos = function(req, res) {
    db.collection('feeds', function(err, collection) {
        collection.find().toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};

exports.news = function(req, res) {
    db.collection('feeds', function(err, collection) {
        collection.find({type: 'News'}).toArray(function(err, items) {
            responseMsg.msg = "OK";
            responseMsg.data = items;
            res.send(responseMsg);
        });
    });
};


 