var User = require('../../models/user.js');
var UserSession = require('../../models/userSession.js');
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');

var sendError = (res,error)=>{
	return res.send({
		success:false,
		message:'Error: ' + error + "!"
	})
} 

//TODO:make this var locally global
var verficationCode = "";

function sendMail(targetEmail,subject,text) {

	var transporter = nodemailer.createTransport(smtpTransport({
		 service: 'gmail',
		 host: 'smtp.gmail.com',
		 auth: {
		    user: 'accverf007@gmail.com',
		    pass: 'accountverifier007'
		 }
	}));

	var mailOptions = {
		from : 'accverf007@gmail.com',
		to: targetEmail,
		subject: subject,
		text:text
	};

	transporter.sendMail(mailOptions,(err,info)=>{
		if(err){
			console.log(err);
		}
		
	});

}

module.exports = (app)=>{
	
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
					userName: user.username,
					userEmail: user.email,
					userSignUpDate: user.signUpDate,
					message:'Account data loaded successfully',
					profileImg: user.profileImg,
					address:user.address,
					work:user.work,
					workplace:user.workplace,
					isVerified:user.isVerified,
				});

			});

		});

	});

	app.route('/api/account/profile/imageUpload')
		.post((req,res,next) =>{

			var {body} = req;
			var {token,imageData} = body;

			//get the user
			UserSession.find({
				_id:token,
				isDeleted:false
			},(err,previousSessions)=>{
				if(err){
					return sendError(res,"Server error, Stage: finding user session");
				}

				else if(previousSessions.length < 1){
					return sendError(res,"Invalid session");
				}

				//if usersession is found get the user
				var userID = previousSessions[0].userID;

				User.find({
					_id:userID
				},(err,previousUsers)=>{
					if(err){
						return sendError(res,"Server error, Stage: finding user");
					}
					else if(previousUsers.length < 1){
						return sendError(res,"No User found");
					}

					//Now we have the user
					var user  = previousUsers[0];
					user.profileImg = imageData;

					user.save((err,doc)=>{
						if(err){
							return sendError(res,'Failed to save image to DB');
						}
					});

					 return res.send({
						success:true,
						message:'Image uploaded Succesfully'
					})

				});

			})

		});
		
	app.post('/api/account/profile/profileData' ,(req,res) =>{
			var {body} = req;
			var {token,username,address,work,workplace} = body;
			console.log(username);

			username = username.trim();
			address = address.trim();
			work = work.trim();
			workplace = workplace.trim();

			//get the user
			UserSession.find({
				_id:token,
				isDeleted:false
			},(err,previousSessions)=>{
				if(err){
					return sendError(res,"Server error, Stage: finding user session");
				}

				else if(previousSessions.length < 1){
					return sendError(res,"Invalid session");
				}

				//if usersession is found get the user
				var userID = previousSessions[0].userID;

				User.find({
					_id:userID
				},(err,previousUsers)=>{
					if(err){
						return sendError(res,"Server error, Stage: finding user");
					}
					else if(previousUsers.length < 1){
						return sendError(res,"No User found");
					}

					//Now we have the user
					var user  = previousUsers[0];
					if(username){
						user.username = username;
					}
					if(address){
						user.address = address;
					}
					if(work){
						user.work = work;
					}
					if(workplace){
						user.workplace = workplace;
					}

					user.save((err,doc)=>{
						if(err){
							return sendError(res,'Failed to save profile Data to DB');
						}
					});

					return res.send({
						success:true,
						message:'Profile data updated Succesfully'
					})

				});

			});
		});

	app.post('/api/account/profile/reqVerificationCode', (req,res) => {
		var {body} = req;
		var {email} = body;
		email = email.trim();


		var code = Math.random()*10000;
		code = Math.floor(code);
		verficationCode = code + "";
		console.log(verficationCode);
		sendMail(email,"Verification code" , verficationCode);
		

	});

	app.post('/api/account/profile/verifyEmail',(req,res)=>{
		var {body} = req;
		var {code,email} = body;

		if(code === verficationCode){
			
			User.find({
				email:email,
				isDeleted:false
			},(err,previousUsers)=>{
				if(err){
					return sendError(res,"Server Error");
				}else if(previousUsers.length < 1){
					return sendError(res,"Email not found");
				}

				var user = previousUsers[0];
				user.isVerified = true;

				user.save((err,doc)=>{
					if(err){
						return sendError(res,"Error saving user to DB");
					}
				});

			});

			return res.send({
				success:true,
				message:'Email Verified successfully'
			});
		}else{
			return sendError(res,"Wrong VerificationCode");
		}

	});

	app.post('/api/account/profile/friendList',(req,res)=>{
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
					friendList:user.friendList
				});

			});

		});
	})

}
