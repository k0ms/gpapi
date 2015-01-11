var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fuels_approval = mongoose.model('fuels_approval');
var fuels = mongoose.model('fuels');

exports.getStationPriceForApproval = function(req, res) {
   var id = req.params.id; //station_id
   console.log(id);
   fuels_approval.find({station_id: id, isApproved: false, IsNew: true}, function(err, result){ 


      if(err) {
          console.log(err);  
          res.send({'msg': 'NG', 'data': err});
      }
      else {
          fuels.find({station_id: id}, function(err, fuelsResult){

            if(err) {
              console.log(err);  
              res.send({'msg': 'NG', 'data': err});
            }
            else {
                //result for loop and match
                console.log("fuelsApproval: "+result);
                console.log("fuels: "+fuelsResult);
                var forSending = result;

                for(var count1 = 0; count1 < fuelsResult.length; count1++) {
                  var fuelApprovalRow = fuelsResult[count1];
                  var fuelRow;
                  var found = false;
                  for(var count2 =0; count2<result.length; count2++) {
                     fuelRow = result[count2];
                     console.log("fuelsApproval._id ="+fuelApprovalRow._id);
                     console.log("fuels_id          ="+fuelsResult.fuels_id);
                     if(fuelApprovalRow._id == fuelRow.fuels_id ) {
                       found = true;
                       console.log("TRUE");
                       break;
                     }
                  }

                  if(found == false) {
                    forSending.push(fuelApprovalRow);
                  }
                }
                //
                res.send({
                  'msg': 'OK',
                  'data': forSending
                });
            }
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
            result.IsNew = false;
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
  fuels_approval.update({_id: fuelApprovalId}, {$set: {isApproved: false, IsNew: false}}, {}, 
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
              item.isApproved = false;
              item.IsNew = true;

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

  var item = req.body;
  item._id = mongoose.Types.ObjectId()+'';
  item.isApproved = false;
  item.IsNew = true;
  
  var dateNow =  formatDate();
  if(item.date_modified === undefined) {
      item['date_modified'] = dateNow;
  }
  if(item.date_created === undefined) {
      item['date_created'] = dateNow;
  }
  
  saveItem = new fuels_approval(item);
  saveItem.save(function(err, comm, numAffected) {  
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