import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import ProfileEdit from './ProfileEdit.js'

import './Profile.css'

import ProfileNavbar from './SubProfile/ProfileNavbar.js';

class Profile extends Component{
	state={
			isLoading:true,
			userName:'',
			userSignUpDate:'',
			userEmail:'',
			token:(localStorage.getItem('signInToken') ? localStorage.getItem('signInToken'):'-1'),
			message:'',
			redirect:'',
			editProfile:false,
			profileImg:'',
			address:'',
			workplace:'',
			work:'',
			isVerified:false,
			verificationCode:'',
		};	

	componentDidMount(){
		this.setState({
			isLoading:true,
		});
	}

	onEditProfile = ()=>{
		this.setState({
			editProfile:true
		})
	}

	onSignOut = ()=>{
		const {token} = this.state;

		this.setState({
			isLoading:true
		});

		fetch("http://localhost:8080/api/account/signout"
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					token:token
				})
			}).then((res)=>res.json()).then((json)=>{
				
				if(json.success){
					localStorage.removeItem('signInToken');
				}
				this.setState({
					isLoading:false,
					redirect:'/'
				});
			});

	}

	onVerifyInputChange = (e)=>{
		this.setState({
			verifyInput:e.target.value
		});
	}

	reqVerificationCode = ()=>{
		var {userEmail} = this.state;

		fetch('http://localhost:8080/api/account/profile/reqVerificationCode'
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					email:userEmail
				})
			}).then((res)=>res.json()).then((json)=>{
				
			});
	}

	verifyEmail =()=>{
		const {verifyInput,userEmail} = this.state;

		fetch('http://localhost:8080/api/account/profile/verifyEmail'
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					code:verifyInput,
					email:userEmail
				})
			}).then((res)=>res.json()).then((json)=>{
				console.log(json);	
			});
	}


	

	render(){

		const {isVerified,address,workplace,work,profileImg,editProfile,redirect,token,isLoading,message,userName,userEmail,userSignUpDate} = this.state;
		
		if(!userName && token){ //if there is no user and token is succesfully loaded from local storage
			fetch('http://localhost:8080/api/account/profile'
				,{	
					method:'POST',
					headers:{
						'Content-Type':'application/json',
						'Accept':'application/json'
					},
					body:JSON.stringify({
						token:token,
					})
			}).then((res)=>  res.json()).then((json)=>{

				if(json.success){
					this.setState({
						userName : json.userName,
						userSignUpDate : json.userSignUpDate,
						userEmail : json.userEmail,
						isLoading : false,
						message:json.message,
						profileImg:json.profileImg,
						address:json.address,
						work:json.work,
						workplace:json.workplace,
						isVerified:json.isVerified
					});
				}else{//redirect becoz no session
					this.setState({
						isLoading:false,
						redirect:'/'
					});
				}

			});
		}	

		if(redirect){
			return <Redirect to = {redirect} / >;
		}

		if(isLoading){
			return (<div><p>Loading......</p></div>);
		}

		let verifyButton;
		let verifyInput;
		let verifySubmit;

		if(!isVerified){
			verifyButton = <button onClick = {this.reqVerificationCode}>Send Verification code to your email </button>;
			verifyInput  = <input type='number' onChange = {this.onVerifyInputChange} 
									placeholder = 'Enter code sent to ur mail' />;
			verifySubmit = <button onClick = {this.verifyEmail}>Verify</button>;
		}

		var verifyShow;
		if(isVerified){
			verifyShow = "Yes";
		}else{
			verifyShow = "No";
		}

		return(
			<div>
			<ProfileNavbar />
			<hr/>
			<h3>Profile Page</h3>
			<br/>
				<img src ={profileImg} className = 'profileImg'/>
				<h4>Name: {userName} </h4>
				<h4>Email: {userEmail} verified: {verifyShow}</h4>
				<h4>SignUp Date: {userSignUpDate}</h4>
				
					<h4>Adress: {address}</h4>
					<h4>Work: {work}</h4>
					<h4>Workplace: {workplace}</h4>
					<br/>
					<hr/>
					<br/>

				<button onClick = {this.onSignOut}>Log Out</button><br/><br/>
				
				{verifyButton}<br/>
				{verifyInput} <br/>
				{verifySubmit}<br/>					
				{message}<br/>

				<button onClick = {this.onEditProfile} > Edit Profile</button>
				
				<ProfileEdit shouldEditProfile = { editProfile }  signInToken = {token}/>
			
			</div>

		);
	}

}

export default Profile