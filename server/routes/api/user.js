var User = require('../../models/user.js');
var UserSession = require('../../models/userSession.js');
var sendError = (res,error)=>{
	return res.send({
		success:false,
		message:'Error: ' + error + "!"
	})
}

module.exports = (app)=>{

	app.post('/api/account/signup',(req,res)=>{
		console.log("signup route accessed");
		var {body} = req;
		var {email} = body;
		var {password} = body;

		if(!email){//validate email
			return sendError(res,'Email can\'t be blank');
		}
		if(!password){//validate password
			return sendError(res,'Password can\'t be blank');
		}

		email = email.toLowerCase();
		email = email.trim();

		//verify email doesn't already exists

		User.find({
			email:email
		},(err,previousUsers)=>{
			if(err){ return sendError(res,"Server error");}
			else if(previousUsers.length > 0) {
				return sendError(res,'Email already exists');
			}
			
			//Now add user
			const newUser = User();
			newUser.email = email;
			newUser.password = newUser.generateHash(password);

			//save this user
			newUser.save((err,user)=>{
				if(err) return sendError('Server error');
				else{
					return res.send({
						success:true,
						message:'Signed up.'
					});
				}
			});
		})

	});

	app.post('/api/account/signin',(req,res)=>{
		console.log('signing in commenced')
		const {body} = req;
		var {email,password} = body;

		if(!email){
			return sendError(res,'Email can\'t be empty');
		}
		if(!password){
			return sendError(res,'Password can\'t be empty');
		}

		email = email.toLowerCase();
		email = email.trim();
		console.log(email)

		User.find({
			email:email
		},(err,previousUsers)=>{
			if(err){
				return sendError(res,'Server error');
			}
			console.log(previousUsers[0].email);
			if(previousUsers.length < 1){
				return sendError(res,'Email not found');
			}

			const user = previousUsers[0];

			if(!user.validPassword(password)){
				return sendError(res,'Password incorrect');
			}

			//signin by creating user session
			var userSession = new UserSession();
			userSession.userID = user._id;//the document id of that user

			userSession.save((err,doc)=>{
				if(err){
					return sendError("Server error");
				}
				return res.send({
					success:true,
					message:"Signed in!",
					token:doc._id//will be used by browser to auto login
				});
			});

		});

	});

};