var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fuels = mongoose.model('fuels');
var stations = mongoose.model('stations');
exports.findAll =  function(req,res) {
  //console.log(req.params.id);

  fuels.aggregate(
    [
      {
        $group: {
          _id: "$station_id",
          fuels : {
            $push: "$name"
          }
        }
      }
    ],
    function(err, results){

        console.log("Aggregate Results");
        console.log(JSON.stringify(results));
        if (err) throw err;
        results = results.map(function(doc) { 
            doc.station_id = doc._id;
            delete doc._id;
            return doc;
        });
        console.log("Map Results");
        console.log(JSON.stringify(results));

        opts = [
          { "path": "station_id latitude longitude"  },
          { "path": "franchise_id", "model": "franchise_fuels"  }
        ];

        stations.populate( results,opts , function(err,results) {
            if (err) res.send({"msg": "NG", "data": err});
            else {
              res.send({
                "msg": "OK",
                "data": results
              })
            }
            
        });
    }
/*
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
      */
  );

};


exports.findById = function (req, res){
  var station = req.param('id');
  console.log("station_id " + station);
  fuels.findOne({station_id: station})
    .populate("station_id")
    .populate("franchise_fuels_id")
    .exec(function(err, result) {
      if(err) {
          res.send({
            msg: "NG",
            data: err
          });
      }
      else {
          console.log("RESULTS: "+result);
          res.send({
            msg: "OK",
            data: result
          });
      }

    });
/*
  fuels.list({station_id: station}, function (err, articles) {
    if (err)  res.send({'msg': 'NG', 'data': []});
    fuels.count().exec(function (err, count) {
      res.send({
        'msg': 'OK',
        'data': articles,
      });
    });
  });*/
};

exports.findFuelTypeDistinct = function(req,res) {
  console.log("findFuelTypeDistinct");

  fuels.distinct("name", function(err, result) {
      if(err) {
          res.send({
            msg: "NG",
            data: err
          });
      }
      else {
          console.log("RESULTS: "+result);
          res.send({
            msg: "OK",
            data: result
          });
      }
  });
};

exports.findFuelClassDistinct = function(req,res) {
  console.log("findFuelTypeDistinct");

  fuels.distinct("type", function(err, result) {
      if(err) {
          res.send({
            msg: "NG",
            data: err
          });
      }
      else {
          console.log("RESULTS: "+result);
          res.send({
            msg: "OK",
            data: result
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