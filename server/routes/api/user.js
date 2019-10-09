var User = require('../../models/user.js');

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
			sendError(res,'Email can\'t be blank');
		}
		if(!password){//validate password
			sendError(res,'Password can\'t be blank');
		}

		email = email.toLowerCase();
		email = email.trim();

		//verify email doesn't already exists

		User.find({
			email:email
		},(err,previousUsers)=>{
			if(err){ sendError(res,"Server error");}
			else if(previousUsers.length > 0) {
				sendError(res,'Email already exists');
			}
			
			//Now add user
			const newUser = User();
			newUser.email = email;
			newUser.password = newUser.generateHash(password);

			//save this user
			newUser.save((err,user)=>{
				if(err) sendError('Server error');
				else{
					return res.send({
						success:true,
						message:'Signed up.'
					});
				}
			});
		})

	});

};