import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'

class Profile extends Component{
	state={
			isLoading:true,
			userName:'',
			userSignUpDate:'',
			userEmail:'',
			token:(localStorage.getItem('signInToken') ? localStorage.getItem('signInToken'):'-1'),
			message:'',
			redirect:'',
			begin:false
		};	

	componentDidMount(){
		this.setState({
			isLoading:true,
			being:true
		});
	}

	render(){

		const {begin,redirect,token,isLoading,message,userName,userEmail,userSignUpDate} = this.state;
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
					console.log("success");					
					this.setState({
						userName : json.userName,
						userSignUpDate : json.userSignUpDate,
						userEmail : json.userEmail,
						isLoading : false,
						message:json.message
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

		return(
			<div>
			<h3>Profile Page</h3>
			<br/>
				<h4>Name: {userName}</h4>
				<h4>Email: {userEmail}</h4>
				<h4>SignUp Date: {userSignUpDate}</h4>
				<h3>{message}</h3>
			</div>
		);
	}

}

export default Profile