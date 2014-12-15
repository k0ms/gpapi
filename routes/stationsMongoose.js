var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stations = mongoose.model('stations');




exports.findAll = function(req,res) {
  stations.list({}, function (err, articles) {
    if (err)  res.send({'msg': 'NG', 'data': []});
      console.log(JSON.stringify(articles));
      res.send({
        'msg': 'OK',
        'data': articles,
      });
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