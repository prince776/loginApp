var User = require('../../models/user.js');
var UserSession = require('../../models/userSession.js');
var multer = require('multer');

var sendError = (res,error)=>{
	return res.send({
		success:false,
		message:'Error: ' + error + "!"
	})
}

//Multer stuff
const storage = multer.diskStorage({
	destination: (req,file,cb)=>{
		 cb(null,'./uploads/');
	},
	filename: (req,file,cb)=>{
		cb(null,Date.now()+file.originalname);
	}

});

const fileFilter = (req,file,cb)=>{
	if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
		cb(null,true);//store
	}else{
		cb(null,false);//reject
	}
}

const upload = multer({
	storage:storage,
	limits:{
		fileSize:1024*1024*5
	},
	fileFilter:fileFilter
});

module.exports = (app)=>{
	
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

					res.send({
						success:true,
						message:'Image uploaded Succesfully'
					})

				});



			})

		});
	

}
