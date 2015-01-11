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
      var vehicleHistory;

      for(itr = 0; itr < vehicleList.length; itr++) {

        console.log(itr);
     
        userFuelHistory.list({vehicle_id: vehicleList.vehicle_id}, function(err, historyList, vehicleHistory){
            if(err) res.send({'msg': 'NG', 'data': []});
            else {
                console.log(historyList);
                vehicleHistory = historyList;
//                var vehicle = vehicleList[itr];
//                console.log(JSON.stringify(vehicleList[itr]));
//                vehicle['history'] = historyList;
                
            }
        });

        if(itr === vehicleList.length) {
          res.send({
            'msg': 'OK',
            'data': vehicleList,
          });
        }
      }

      
    }

  });
};

exports.userVehicles = function(req, res) {
  var userId = req.param('user_id');
  var options = {
    user_id : userId 
  }

  vehicles.list(options, function (err, vehicleList) {
    var fuelHistoryOptions = {$or: []};
    if (err)  res.send({'msg': 'NG', 'data': [err]});
    else {
        for(var count = 0; count < vehicleList.length; count++) {
            fuelHistoryOptions['$or'].push({vehicle_id: vehicleList[count]._id});
        }

        var options = [
              {
                  $match: fuelHistoryOptions
              }, 
              {
                  $group: 
                  {
                      _id: "$vehicle_id", 
                      logs: 
                      {
                          $push: 
                          {
                            vehicle_id: "$vehicle_id", 
                            station_id: "$station_id", 
                            fuel_consumed: "$fuel_consumed",
                            fuel_id: "$fuel_id", 
                            liters: "$liters", 
                            amount: "$amount",
                            user_id: "$user_id", 
                            _id: "$_id", 
                            date_created: "$date_created", 
                            date_modified: "$date_modified", 
                            row_status: "$row_status"
                          } 
                      }
                  }
              }
            ];

        userFuelHistory.aggregate( options,
          function(err, result) {
            if(err)  {
              res.send({'msg': 'NG', 'data': [err]});
            }
            else {
              result2 = result.map(function(doc) {
                  doc['vehicle_id'] = doc._id;
                  delete doc._id;
                  return doc; 
              });
              var forFinal = result2;
              for(var count = 0; count < vehicleList.length; count++) {
                var found = false;

                var vehicleL = vehicleList[count];
                var resultL = {};
                for(var count2 = 0; count2 < result2.length; count2++) {
                  resultL = result2[count2];

                  if(vehicleL._id == resultL.vehicle_id) {
                    console.log("TRUE");
                    found = true;
                    break;
                  }
                }
                if(found == false) {
                  console.log("vehicle_id add " + vehicleL._id);
                  forFinal.push({vehicle_id: vehicleL._id});
                }
              }

              console.log(forFinal);

              vehicles.populate( forFinal, {"path": "vehicle_id logs"}, function(err,results) {
                if(err) {
                  res.send({'msg': 'NG', 'data': [err]});
                }
                else {
                  res.send({
                    'msg': 'OK',
                    'data': results,
                  });
                }
              });
            }
          }
        );      

    }
  });
}

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