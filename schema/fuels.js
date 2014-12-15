var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = function() {
	var fuelsSchema =  Schema({
		station_id: {type: String, ref: 'stations'},
		franchise_fuels_id: {type: String, ref: 'franchise_fuels'},
		price: String,
		description: String,
		info: String,
		type: String,
		_id: String,
		user_id: {type: String, ref: 'users'},
		photo: String,
		date_created: String,
		date_modified: String,
		row_status: String,
	});

	

    fuelsSchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.populate('franchise_fuels_id')
    		.populate('station_id')
    		.sort({'date_modified': -1})
    		.exec(cb);
    	}
    };

	var fuelsModel = mongoose.model('fuels', fuelsSchema, 'fuels');

};