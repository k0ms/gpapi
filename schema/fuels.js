var mongoose = require('mongoose');

module.exports = {
	var fuelsSchema =  mongoose.Schema({
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

	var fuelsModel = mongoose.model('fuels', fuelsSchema);

};