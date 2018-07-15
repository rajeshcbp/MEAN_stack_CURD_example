var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var user = require('./../../schemas/user');
var request = require('request');

//CREATE===========================================================================================================

module.exports.createUser = function (req, res) {

	var formData = {
		"name": req.body.name,
		"email": req.body.email,
		"phone": req.body.phone
	}
	console.log("formData", formData);

	user.create(formData, function (err, result) {
		if (err) {
			console.log("DBERROR in creating account", err.message);
			res.status(500).json({
				"error": err.message
			});
			return;
		}
		console.log("User created==================", result);
		res.status(200).json({
			"message": "CREATED"
		});
	})

}

//GET ALL USERS===========================================================================================================
module.exports.getAllUserDetails = function (req, res) {
	user.find({	}, function (err, result) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		console.log("  User details fetched succesfully ", result);
		//   log.info( "  User details fetched succesfully  " );
		res.status(200).json(result);

	})
}

//GET Single USERS===========================================================================================================
module.exports.getUserDetails = function (req, res) {
	user.findOne({
		_id: req.params.Id
	}, function (err, result) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		console.log("  User details fetched succesfully ", result);
		//   log.info( "  User details fetched succesfully  " );
		res.status(200).json(result);

	})
}
//Update Single USERS===========================================================================================================
module.exports.updateUser = function (req, res) {
	var Id = req.params.Id;
	console.log("user Id==================", Id);

	user.update({
		_id: Id
	}, {
		$set: {
			"name": req.body.name,
			"email": req.body.email,
			"phone": req.body.phone
		}
	}, {
		w: 1
	}, function (err, result) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		console.log("  User details updated succesfully ");
		res.status(200).json({
			"message": "UPDATED"
		});
	})

}

//Delete Single USERS===========================================================================================================
module.exports.delete = function (req, res) {
	var Id = req.params.Id;
	console.log("user Id==================", Id);
	user.remove({
		_id: Id
	}, function (err, result) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		console.log("  User deleted succesfully ");

		res.status(200).json({
			"message": "DELETED"
		});

	})

}