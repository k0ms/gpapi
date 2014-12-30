var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comments = mongoose.model('comments');


exports.index = function (req, res){
  var station = req.param('station_id');

  var options = {
      sort: {date_modified: -1}
  }
  var page = req.param('page');
  var perPage = req.param('perPage');
    
  if(page != undefined || perPage != undefined ) {
      options['skip'] = page * perPage;
      options['limit'] = perPage;
      console.log(options);
  };
  var query = {};  
  comments.list(query, options, function (err, articles) {
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

exports.findById = function (req, res){
  var station = req.params.id
  var page = req.param('page');
  var perPage = req.param('perPage');
  var options = {
    perPage: perPage,
    page: page,
    sort: {date_modified: -1}
  };

  var options = {
      sort: {date_modified: -1}
  }
  var query =  {station_id: station};
  
  if(page != undefined || perPage != undefined ) {
      options['skip'] = page * perPage;
      options['limit'] = perPage;
      console.log(options);
  };

  comments.list(query, options, function (err, articles) {
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

exports.addComments = function (req, res){
  var comms = req.body;
  comments.on('error', console.log);
  console.log(JSON.stringify(req.body));
  comms._id = mongoose.Types.ObjectId()+'';

  var dateNow =  formatDate();
  if(comms.date_modified === undefined) {
      comms['date_modified'] = dateNow;
  }
  if(comms.date_created === undefined) {
      comms['date_created'] = dateNow;
  }

  if(req.body)
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