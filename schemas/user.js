var mongoose = require('mongoose');

// stellar account details 
var userSchema = mongoose.Schema({
	name: { //body
		type: String,
		index: true
	},
	email: { //body
		type: String,
		index: true
	},
	phone: { //body
		type: String,
		index: true
	},
	password: { //body
		type: String,
		index: true
	}
});



//------------------------------------------Model---------------------------------------------------------------------------
var user = module.exports = mongoose.model('user', userSchema);