import React , {Component} from 'react';
import FileBase64 from 'react-file-base64';
import './ProfileEdit.css'

class ProfileEdit extends Component{

	state = {
		baseImage:'',
	};

	componentDidMount(){

	}

	//function to capture base64 format of an image
	getBaseFile = (files)=>{
		this.setState({
			baseImage:files.base64
		});
		fetch('http://localhost:8080/api/account/profile/imageUpload'
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					imageData:files.base64.toString(),
					token:this.props.signInToken
				})
			}).then((res)=>res.json()).then((json)=>{
				console.log('message')
				console.log(json.message);
			})

	}



	render(){

			var {baseImage} = this.state;

			if(this.props.shouldEditProfile){
				return(
					<div>
					<h3>Edit Profile Menu</h3>
					<p>Upload Profile Image: </p>
					
					<FileBase64 type = "file" multiple = {false} onDone = {this.getBaseFile.bind(this)} />
					<img className = 'profileImg' src = {baseImage} />

					</div>

				);
			}else{
				return(
					<div>
					</div>
				)
			}
	}

}

export default ProfileEdit;