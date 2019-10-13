import React , {Component} from 'react';
import FileBase64 from 'react-file-base64';
import './ProfileEdit.css'

class ProfileEdit extends Component{

	state = {
		baseImage:'',
		username:'',
		address:'',
		work:'',
		workplace:'',
		imagesStatus:'',
	};

	componentDidMount(){

	}

	onUsernameChange = (e) => {
		this.setState({
			username:e.target.value
		});
	}
	onAddressChange = (e) => {
		this.setState({
			address:e.target.value
		});
	}
	onWorkChange = (e) => {
		this.setState({
			work:e.target.value
		});
	}
	onWorkplaceChange = (e) => {
		this.setState({
			workplace:e.target.value
		});
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

	submitData = () =>{

		const {username,address,work,workplace} = this.state;

		fetch('http://localhost:8080/api/account/profile/profileData'
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					token:this.props.signInToken,
					username:username,
					address:address,
					work:work,
					workplace:workplace
				})
			}).then((res)=>res.json()).then((json)=>{
				console.log('message')
				console.log(json.message);
		});
	}



	render(){

			var {baseImage,username,address,work,workplace} = this.state;

			if(this.props.shouldEditProfile){
				return(
					<div>
					

					<h3>Edit Your Profile</h3><br/>
					<p>Upload Profile Image: </p>
					<br/>
					<FileBase64 type = "file" multiple = {false} onDone = {this.getBaseFile.bind(this)} />
					<img className = 'profileImg' src = {baseImage} />
					<br/><br/>
					<input type="text" onChange = {this.onUsernameChange} placeholder = "Change your name"/>
					<br/><br/>
					<input type="text" onChange = {this.onAddressChange} placeholder = "Add your address"/>
					<br/><br/>
					<input type="text" onChange = {this.onWorkChange} placeholder = "Add your workplace"/>
					<br/><br/>				
					<input type="text" onChange = {this.onWorkplaceChange} placeholder = "Add your work"/>
					<br/>
					<br/>
					<button onClick = {this.submitData} > Submit </button>

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