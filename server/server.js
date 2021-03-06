const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('../config/config.js');
const port = process.env.PORT || 8080;

//here do mongoose connection
mongoose.connect(config.mongodb,(err,docs)=>{
	if(!err){
		console.log("MonoDB connected");
	}else{
		console.log("MongoDB couldn't connect");
		console.log(docs);
	}
});

mongoose.Promise = global.Promise;


const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json({limit:'50mb'}));//increase payload size to accept image data
app.use(cors());
app.use('/uploads',express.static('uploads'));
app.use(express.static(path.join(__dirname,'../client/loginApp/public')));
//make sure done after app.use(express.json());

//default route
app.get('/',(req,res,next)=>{
	res.sendFile(path.join(__dirname,'../client/loginApp/public/index.html'))
})

require('./routes/api/user.js')(app);
require('./routes/api/userProfile.js')(app);
//listen on port
app.listen(port,()=>{
	console.log(`Server is running on port: ${port}`);
});

module.exports = app; // returns app on calling require
