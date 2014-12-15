
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

	var franchisesSchema = new Schema({
		_id: String,
		logo_big: String,
        logo_small: String,
        name: String,
		date_created: {type: String, default: formatDate()} ,
		date_modified: {type: String, default: formatDate()},
		row_status: String
	});

    //userssSchema.path('comments').required(true, 'Comment cannot be blank');


    franchisesSchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.exec(cb);
    	} 
    };

	mongoose.model('franchises', franchisesSchema, 'franchises');

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