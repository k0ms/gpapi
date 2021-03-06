var mongoose = require('mongoose');
var Schema = mongoose.Schema;



module.exports = function() {

	var ratingSchema = new Schema({
		_id: String,
		user_id: {type: String, ref: 'users'},
		station_id: {type: String, ref: 'stations'},
		franchise_id: { type: String, ref: 'franchcises'},
		rating: String,
		date_created: {type: String, default: formatDate()},
		date_modified: {type: String, default: formatDate()},
		row_status: {type: String, default: ''},
	});

    ratingSchema.path('rating').required(true, 'Rating cannot be blank');
    ratingSchema.path('franchise_id').required(true, 'Franchise cannot be blank');
    ratingSchema.path('station_id').required(true, 'Station ID cannot be blank');
    ratingSchema.path('user_id').required(true, 'User ID cannot be blank');

    ratingSchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.populate('user_id', 'firstname lastname')
    		.populate('station_id', 'name rating')
    		.sort({'date_modified': -1})
    		.exec(cb);
    	}
    };

	mongoose.model('rating', ratingSchema, 'rating');

};

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