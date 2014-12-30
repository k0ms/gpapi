var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fuels_approval = mongoose.model('fuels_approval');
var fuels = mongoose.model('fuels');

exports.getStationPriceForApproval = function(req, res) {
   var id = req.params.id; //station_id
   fuels_approval.find({station_id: id, isApproved: false, isNew: true}, function(err, result){ 
      if(err) {
          console.log(err);  
          res.send({'msg': 'NG', 'data': err});
      }
      else {
          res.send({
              'msg': 'OK',
              'data': result
          });
      }
   });
};

exports.approvePrice = function(req, res) {
  var id = req.params.id;
  fuels_approval.find({_id: fuelApprovalId},   function(err, result) {
      if(err) {
            console.log(err);  
            res.send({'msg': 'NG', 'data': err, 'numAffected': result});
      }
      else {
            result.isApproved = true;
            result.isNew = false;
            result.save(function(err, saveResult, numResults) {
              if(err) {
                console.log(err);  
                res.send({'msg': 'NG', 'data': err, 'numAffected': saveResult});         
              }
              else {
                fuels.update({_id: result.fuel_id}, {$set: {price: result.price}}, {}, function(err, fuelsaveResult){
                  if(err) {
                    console.log(err);
                    res.send({'msg': 'NG', 'data': err});              
                  }
                  else {
                    console.log(savResult);
                    res.send({'msg': 'OK', 'data': saveResult});
                  }
                });
              }
            });

      }
  });

};

exports.disapprovePrice = function(req, res) {
  //disapprove entry
  var fuelApprovalId = req.params.id;
  fuels_approval.update({_id: fuelApprovalId}, {$set: {isApproved: false, isNew: false}}, {}, 
      function(err, numAffected ){
          if(err) {
              console.log(err);  
              res.send({'msg': 'NG', 'data': err, 'numAffected': numAffected});
          }
          else if(numAffected> 0) {
            //enter new price for approval
              var item = req.body;
              item.on('error', console.log);
              item.log(JSON.stringify(req.body));
              item._id = mongoose.Types.ObjectId()+'';

              var dateNow =  formatDate();
              if(item.date_modified === undefined) {
                  item['date_modified'] = dateNow;
              }
              if(item.date_created === undefined) {
                  item['date_created'] = dateNow;
              }

              if(req.body)
              var insForApproval = new fuels_approval(item);
              insForApproval.save(function(err, comm, numAffected) {  
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
          }
          else {
              console.log(err);  
              res.send({'msg': 'NG', 'data': err, 'numAffected': numAffected});
          }
      });
};


exports.submitPrice = function(req, res) {

  var item = new fuelsApproval(req.body);
  item.save(function(err, comm, numAffected) {  
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