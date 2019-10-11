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

		User.find({
			email:email
		},(err,previousUsers)=>{
			if(err){
				return sendError(res,'Server error');
			}
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

	app.post('/api/account/verify',(req,res) => {
		const {body} = req;
		const {token} = body;

		if(!token){
			return sendError(res,"No session found");
		}

		UserSession.find({
			_id:token,
			isDeleted:false
		},(err,prevSessions)=>{
			if(err){
				return sendError(res,'Server error')
			}
			if(prevSessions.length < 1){
				return sendError(res,'Invalid session! Please sign in again')
			}

			//if sesssion is found and isn't deleted
			return res.send({
				success:true,
				message:"Session refreshed, ur signed in now."
			});

		});

	});

	app.post('/api/account/logout',(req,res)=>{
		const {body} = req;
		const {token} = body;

		if(!token){
			return sendError(res,"No session found, can't log out");
		}

		UserSession.findOneAndUpdate({
			_id:token,
			isDeleted:false
		},{
			$set:{isDeleted:true}
		},null,(err,prevSession)=>{
			if(err){
				return sendError(res,"Server error");
			}
			if(!prevSession){
				return sendError(res,"No session found, can't log out");
			}

			return res.send({
				success:true,
				message:"Session logged out"
			});

		});

	});

	app.post('/api/account/profile',(req,res)=>{
		const {body} = req;
		const {token} = body;

		if(!token){
			return sendError(res,"Invalid Session (no Token)");
		}

		UserSession.find({
			_id:token,
			isDeleted:false
		},(err,previousSessions)=>{
			if(err){
				return sendError(res,err);
			}else if(previousSessions.length < 1){
				return sendError(res,"Invalid Session(user session.find else");
			}

			const userID = previousSessions[0].userID;

			User.find({
				_id:userID,
				isDeleted:false	
			},(err,previousUsers)=>{
				if(err){
					return sendError(res,"Server Error(user.find if err)");
				}else if(previousUsers.length < 1){
					return sendError(res,"Invalid User(user.find else)");
				}

				const user = previousUsers[0];

				return res.send({
					success:true,
					userName: "TODO: add username in User model and input of sign up",
					userEmail: user.email,
					userSignUpDate: user.signUpDate,
					message:'Account data loaded successfully'
				});

			});

		});

	});

};