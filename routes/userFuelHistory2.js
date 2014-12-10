var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehicles = mongoose.model('vehicles');
var userFuelHistory = mongoose.model('user_fuel_history');




exports.index = function (req, res){
  var userId = req.param('user_id');
  var options = {
    user_id : userId 
  }

  vehicles.list(options, function (err, vehicleList) {
    if (err)  res.send({'msg': 'NG', 'data': []});
    else {
      var itr = 0;
      for(itr = 0; itr < vehicleList.length; itr++) {        
        userFuelHistory.list({vehicle_id: vehicleList.vehicle_id}, function(err, historyList){
            if(err) res.send({'msg': 'NG', 'data': []});
            else {
                var vehicle = vehicleList[itr];
                console.log(JSON.stringify(vehicleList[itr]));
                vehicle['history'] = historyList;
                vehicleList[itr] = vehicle;
            }
        });
      }

      res.send({
        'msg': 'OK',
        'data': vehicleList,
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