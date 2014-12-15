var mongoose = require('mongoose');

module.exports = function() {
	var userFuelHistorySchema =  mongoose.Schema({
		_id: String,
		vehicle_id: {type: String, ref: 'vehicles'},
		fuel_id: {type: String, ref: 'fuels'},
		station_id: {type: String, ref: 'stations'},
		user_id: {type: String, users: 'user_id'},
		amount: String,
		liters: String,
		date_created: String,
		date_modified: String,
		row_status: String,
	});


	userFuelHistorySchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.sort({'date_modified': -1})
    		.exec(cb);
    	}
    };

	mongoose.model('user_fuel_history', userFuelHistorySchema);
};