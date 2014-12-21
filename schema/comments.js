var mongoose = require('mongoose');
var Schema = mongoose.Schema;



module.exports = function() {

	var commentsSchema = new Schema({
		_id: String,
		user_id: {type: String, ref: 'users'},
		station_id: {type: String, ref: 'stations'},
		franchise_id: { type: String, ref: 'franchcises'},
		comments: String,
		date_created: String,
		date_modified: String,
		row_status: {type: String, default: ''},
	});

    commentsSchema.path('comments').required(true, 'Comment cannot be blank');
    commentsSchema.path('franchise_id').required(true, 'Franchise cannot be blank');
    commentsSchema.path('station_id').required(true, 'Station ID cannot be blank');
    commentsSchema.path('user_id').required(true, 'User ID cannot be blank');

    commentsSchema.statics = {
    	list: function(query, options, cb) {
    		var criteria = options.criteria || {};

    		this.find(query,{},options)
    		.populate('user_id', 'firstname lastname')
    		.populate('station_id', 'name rating')
    		.sort({'date_modified': -1})
    		.exec(cb);
    	}
    };

	mongoose.model('comments', commentsSchema, 'comments');

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