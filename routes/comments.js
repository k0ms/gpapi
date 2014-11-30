var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comments = mongoose.model('comments');


exports.index = function (req, res){
  var station = req.param('station_id');
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    //perPage: perPage,
    //page: page
  };

  comments.list(options, function (err, articles) {
    if (err) return res.send({'msg': OK, 'data': []});
    comments.count().exec(function (err, count) {
      res.send({
        title: 'Articles',
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};



exports.addComments = function (req, res){
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