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

    var request = req.params;
    var nPerPage = req.params.page;
    var pageNumber = req.params.limit;
    var type = req.params.type;

    if(JSON.stringify(request.limit) != undefined) 
        nPerPage = JSON.stringify(request.limit);
    if(JSON.stringify(request.page) != undefined)
        pageNumber = JSON.stringify(request.page);
    if(JSON.stringify(request.type) != undefined)
        type.type = {type: JSON.stringify(request.type)+''};

    console.log("type" + type);
    console.log("pageNumber" + pageNumber);
    console.log("nPerPage" +  nPerPage);
    var cursor;

    db.collection('feeds', function(err, collection) {
        //collection.find().toArray(function(err, items) {
        //    responseMsg.msg = "OK";
        //    responseMsg.data = items;
        //    res.send(responseMsg);
        //});
        if(type === '') {
            cursor = collection.find().sort([['date_modified', -1]]);    
        }
        else {
            cursor = collection.find(type).sort([['date_modified', -1]]);       
        }

        
        cursor.skip(pageNumber > 0 ?((pageNumber-1)*nPerPage) : 0).limit(nPerPage).toArray(function(err, items){


            if(err) {
                responseMsg.msg = "OK";
                responseMsg.data = err;
                res.send(responseMsg);
            }
            else if(items) {
                responseMsg.msg = "NG";
                responseMsg.data = items;
                res.send(responseMsg);    
            }
            

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


 