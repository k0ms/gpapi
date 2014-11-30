
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

	var stationsSchema = new Schema({
		_id: String,
		address: String,
		desc: String,
		franchise_id: {type: String, ref: 'franchises'},
		image: String,
		key_status: String,
		rating: String,
		latitude: String,
		longitude: String,
		name: String,
		date_created: String,
		date_modified: String,
		row_status: {type: String, default: formatDate()},
	});

    //userssSchema.path('comments').required(true, 'Comment cannot be blank');


    stationsSchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.exec(cb);
    	} 
    };

	mongoose.model('stations', stationsSchema);

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