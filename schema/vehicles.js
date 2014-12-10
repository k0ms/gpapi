var mongoose = require('mongoose');

module.exports = function() {
	var vehiclesSchema =  mongoose.Schema({
		_id: String,
		user_id: {type: String, ref: 'users'},
		fuel_type: String,
		vehicle_name: String,
		vehicle_type: String,
		distance_traveled: String,
		selected: String,
		date_created: String,
		date_modified: String,
		row_status: String,
	});

	vehiclesSchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.sort({'date_modified': -1})
    		.exec(cb);
    	}
    };
	mongoose.model('vehicles', vehiclesSchema);

};