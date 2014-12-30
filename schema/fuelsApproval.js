var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = function() {

	var fuelApprovalSchema = new Schema({
		_id: String,
        fuels_id: {type: String, ref: 'fuels'},
        user_id: {type: String, ref: 'users'},
        price: Number,
        isApproved: Boolean,
        date_created: String,
        date_modified: String, 
		row_status: {type: String, default: ''},
	});

    fuelApprovalSchema.path('fuels_id').required(true, 'Fuel info cannot be blank');
    fuelApprovalSchema.path('user_id').required(true, 'User info cannot be blank');
    fuelApprovalSchema.path('price').required(true, 'Price cannot be blank');

    fuelApprovalSchema.statics = {
    	list: function(options, cb) {
    		var criteria = options.criteria || {};

    		this.find(options)
    		.populate('user_id')
    		.populate('fuels_id')
    		.sort({'date_created': -1})
    		.exec(cb);
    	}
    };

	mongoose.model('fuels_approval', fuelApprovalSchema, 'fuels_approval');

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