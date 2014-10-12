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
    var date = req.param("date");
    var pageNumber = parseInt(req.param("limit"));
    var type = req.param("type");
    var direction = req.param("direction");

    db.collection('feeds', function(err, collection) {

        //cursor = collection.find().sort([['date_modified', -1]]);    
        collection.find(createSelector(type, direction, date)).sort([['date_modified', -1]]).limit(pageNumber).toArray(function(err, items){

            if(err) {
                responseMsg.msg = "NG";
                responseMsg.data = err;
                res.send(responseMsg);
            }
            else if(items) {
                responseMsg.msg = "OK";
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


var createSelector =  function (type, direction, date) {

   var selector = '';
   console.log("data: " + type + " " + direction + " " + date);
   if(type != undefined || type != '') {
       selector['type'] = type;
   } 

   if(direction != undefined) {
       if(direction == 'prev') {
          selector['date_modified'] = {$gt: date}
       }
       else if (direction == 'next') {
          selector['date_modified'] = {$lt: date}
       }
   }

   console.log('selector ' + selector);
   if(selector != '') {
       return selector;
   }

}