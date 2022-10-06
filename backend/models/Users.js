const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	date: {
		type: String,
		required: false
	},
	time: {
		type: String,
		required: false
	},
	ph:{
		type: String,
		required: false
	},
	turbidity:{
		type: String,
		required: false
	},
	temperature:{
		type: String,
		required: false
	},
	tds:{
		type: String,
		required: false
	},
	created:{
		type:String,
		required: false
	},
	id:{
		type:String,
		required: false
	},
	date1:{
		type:String,
		required: false
	}
});

module.exports = User = mongoose.model("Users", UserSchema);
