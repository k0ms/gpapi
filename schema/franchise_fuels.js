var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = function() {
	var franchiseFuelsSchema =  Schema({
		franchise_id: {type: String, ref: 'franchises'},
		type: String,
		_id: String,
		name: String,
		date_created: String,
		date_modified: String,
		row_status: String,
	});

	mongoose.model('franchise_fuels', franchiseFuelsSchema, 'frachise_fuels');

};