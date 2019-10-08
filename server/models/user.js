const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	email:{
		type:String,
		default:''
	},
	password:{
		type:String,
		default:''
	},
	isDeleted:{
		type:Boolean,
		default:false
	},
	signUpDate:{
		type:Date,
		default:Date.now()
	}
});

//methods
UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.password);
}

//export as a mongoose.model using Schema
module.exports = mongoose.model("User",UserSchema);
