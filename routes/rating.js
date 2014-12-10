var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rating = mongoose.model('rating');

exports.getStationRating =  function(req,res) {
  console.log(req.params.id);
  rating.aggregate(
    [
      {$match: {"station_id": req.params.id}},
      {
        $group: {
          _id: null  ,
          avgRating : {
            $avg: "$rating"
          }
        }
      }
    ],
    function(err, result){

        console.log("execute");
        console.log(err);

        if (err)  {
          console.log(err);
          res.send({'msg': 'NG', 'data': []});
        }
        else {
          console.log(result);
          res.send({
            'msg': 'OK',
            'data': result
          });
        }
      }
  );

};

exports.getUserStationRating =  function(req,res) {
  user_id = req.param("user_id");
  station_id = req.param("station_id");

  console.log("user_id ="+user_id+" station_id ="+station_id);
  rating.findOne({"user_id": user_id, "station_id": station_id}, function(err, result){
        console.log("execute");
        console.log(err);

        if (err)  {
          console.log(err);
          res.send({'msg': 'NG', 'data': []});
        }
        else {
          console.log(result);
          res.send({
            'msg': 'OK',
            'data': result
          });
        }
  });

};

exports.updateUserRating =  function(req,res) {
  data = req.body;
  if(data._id === undefined) {
    console.log("new: "+JSON.stringify(data));
    data._id = mongoose.Types.ObjectId()+'';
      var newRating = new rating(data);
      newRating.save(function(err, result, numAffected) {  
        if (err) {
          console.log(err);  
          res.send({'msg': 'NG', 'data': err, 'numAffected': numAffected});
        }
        else {
          res.send({
              'msg': 'OK',
              'data': result,
              'numAffected': numAffected
          });
        }
      });
  }
  else {
     console.log(JSON.stringify(data));
     rating.update({"user_id": data.user_id, "station_id": data.station_id }, {'$set': {"rating": data.rating}}, data, function(err, result){
        console.log("execute");
        console.log(err);

        if (err)  {
          console.log(err);
          res.send({'msg': 'NG', 'data': []});
        }
        else {
          console.log(result);
          res.send({
            'msg': 'OK',
            'data': result
          });
        }
      });
  }
};



/*
exports.index = function (req, res){
  var station = req.param('station_id');
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    //perPage: perPage,
    //page: page
  };

  rating.list(options, function (err, articles) {
    if (err)  res.send({'msg': 'NG', 'data': []});
    comments.count().exec(function (err, count) {
      res.send({
        'msg': 'OK',
        'data': articles,
        'page': page + 1,
        'pages': Math.ceil(count / perPage)
      });
    });
  });
};



exports.addRating = function (req, res){
  var comms = req.body;
  comments.on('error', console.log);
  console.log(JSON.stringify(req.body));
  comms._id = mongoose.Types.ObjectId()+'';
  
  var insComment = new comments(req.body);
  insComment.save(function(err, comm, numAffected) {  
    if (err) {
      console.log(err);  
      res.send({'msg': 'NG', 'data': err, 'numAffected': numAffected});
    }
    else {
      res.send({
          'msg': 'OK',
          'data': comm,
          'numAffected': numAffected
      });
    }
  });
};
*/

//local methods
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