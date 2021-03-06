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
    var isExisting = false;
    console.log('Adding users: ' + JSON.stringify(users));
    console.log('password users: '+ JSON.stringify(users.password));
    users._id = new ObjectId().toHexString();

    //add processing for social media

    //find if email is existing 
    console.log("ADDUSERS");
    isUserExist(users, db, addUserFunc,res);
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
                if(result) {
                    console.log('' + result + ' document(s) updated');
                    responseMsg.msg = "OK";
                    responseMsg.data = users;
                    res.send(responseMsg);
                }
                else {
                    responsMsg.msg = "NO_RESULT";
                    responseMsg.data = 0;
                    res.send(responseMsg);
                }
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
    var social;
    var newUser;

    if(user.social_type != undefined && user.social_type != '') {
        social = isSocialExist(user);
        if(social != undefined) {
            db.collection('users', function(err, collection) {
                collection.findOne({'_id': ""+social.user_id}, function(err, item) {
                    responseMsg.data = [];
                    if(err) {
                        responseMsg.msg = "NG";
                    }
                    else {
                        if(item === null) {
                            responseMsg.msg = "NOT_FOUND";
                        }
                        else {
                            item.socials = social;
                            responseMsg.msg = "OK";
                            responseMsg.data = item;
                        }
                    }
                    res.send(responseMsg);

                });
            });
        }
        else {
            //add user add social
            db.collection('users', function(err, collection) {
                collection.insert(user, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {

                        newUser = addSocialsTable(result[0]._id, user.social_type, user.social_id)
                        result[0].socials = newUser;
                        console.log('Success: ' + JSON.stringify(result[0]));
                        responseMsg.msg = "OK";
                        responseMsg.data = result;
                        res.send(responseMsg);
                        }
                });
            });
        }
    }
    else {
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
                        if(JSON.stringify(user.password ) == JSON.stringify(item.password))
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
}



var addSocialsTable = function(userId, socialType, socialId) {
    var users = { 'user_id': userId, 'social_type': socialType, 'social_id': socialId}    
    db.collection('socials', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {
            if (err) {
                return undefined;
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                return result;
            }
        });
    });
};

var isUserExist = function (users, db, callback,res) {
    var ret = false;
    console.log("isUserExist");
    db.collection('users', function(err,collection) {
        console.log(users.email);
        collection.findOne({'email': users.email}, function(err, item){
            if(err) {
                console.log("Error: "+err);
                ret = false;
            }
            else if(item) {
                console.log("EXIST: "+JSON.stringify(item));
                if(item.email != '') {
                    ret = true;
                }
                else {
                    ret = false;
                }
            }

            if((ret==false)) 
             callback(db,users,res);
            else {
                console.log("DUPLICATE");
                responseMsg.msg = "DUPLICATE";
                responseMsg.data = [];
                res.send(responseMsg);
             }

             return ret;
        });
    });
   
};

var isSocialExist = function (user){

    db.collection('socials', function(err, collection) {
        collection.findOne({'social_id': user.social_id, 'social_type': user.social_type}, function(err, item) {
            if(err) {
                return undefined;
            }
            else {
                if(item) {
                    return item;
                }
                else {
                    return undefined;
                }
            }
        });
    });
};

var addUserFunc = function (db, users,res){

    users.password = crypto.createHash('md5').update( JSON.stringify(users.password) ).digest("hex");
        db.collection('users', function(err, collection) {
            collection.insert(users, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    responseMsg.msg = "OK";
                    responseMsg.data = result;
                    res.send(responseMsg);
                }
            });
    });
};

exports.changePassword = function (req, res) {

    var user_id = req.body.user_id
    var old_password = req.body.old_password
    var new_password = req.body.new_password

    old_password = crypto.createHash('md5').update( JSON.stringify(old_password) ).digest("hex");
    new_password = crypto.createHash('md5').update( JSON.stringify(new_password) ).digest("hex");
    console.log("user id = "+user_id);
    console.log("old password = "+old_password);
    console.log("new password = "+new_password);    

    db.collection('users', function(err, collection){
        collection.update({'_id': ""+user_id, password: old_password}, {'$set': {password: new_password}}, {safe:true}, function(err, result) {
            if(err) {
                res.send({msg: "NG", data: err});
            }
            else {
                if(result == 0) {
                    res.send({msg: "OK", data: "no entry found or incorrect password"} );
                }
                else {
                   res.send({msg: "OK", data: req.body})
                }
            }
        });
    });
};



exports.changeEmail = function (req, res) {

    var user_id = req.body.user_id
    var password = req.body.password;
    var new_email = req.body.email;

    password = crypto.createHash('md5').update( JSON.stringify(password) ).digest("hex");
    
    console.log("user id = "+user_id);
    console.log("password = "+password);
    console.log("new email = "+new_email);    

    db.collection('users', function(err, collection){
        collection.update({'_id': ""+user_id, password: password}, {'$set': {email: new_email}}, {safe:true}, function(err, result) {
            if(err) {
                res.send({msg: "NG", data: err});
            }
            else {
                if(result == 0) {
                    res.send({msg: "OK", data: "no entry found or incorrect password"} );
                }
                else {
                   res.send({msg: "OK", data: req.body})
                }
            }
        });
    });
};