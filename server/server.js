const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('../config/config.js');

const port = process.env.PORT || 3000;

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
app.use(express.json());
app.use(cors());

//listen on port
app.listen(port,()=>{
	console.log(`Server is running on port: ${port}`);
});

module.exports = app; // returns app on calling require
