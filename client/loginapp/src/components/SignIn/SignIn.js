import React, {Component} from 'react'
import {Redirect,Link} from 'react-router-dom'
import './SignIn.css'

class SignIn extends Component{

	state = {
		isLoading:true,
		redirect:'',
		message:'',
		email:'',
		password:'',
		token:'',
	}

	componentDidMount(){
		this.setState({
			isLoading:false,
			token:localStorage.getItem('signInToken')
		});
	}

	//SignIn system
	onEmailTextBoxChange = (e)=>{
		this.setState({
			email:e.target.value
		});
	}
	
	onPasswordTextBoxChange = (e)=>{
		this.setState({
			password:e.target.value
		});
	}

	onSignIn = ()=>{
		const {email,password} = this.state;

		this.setState({
			isLoading:true
		});

		fetch('http://localhost:8080/api/account/signin'
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					email:email,
					password:password
				})
			}).then((res)=> res.json()).then((json)=>{

				if(json.success){
					localStorage.setItem('signInToken',json.token);					
					this.setState({
						isLoading:false,
						message:json.message,
						email:'',
						password:'',
						redirect:'/profile',
						// token:json.token
					});
				}else{
					this.setState({
						isLoading:false,
						message:json.message,
						email:'',
						password:''
					});
				}

			});
	}

	render(){

		const {
			isLoading,
			redirect,
			email,
			password,
			message,
			verificationMessage,
			token,
		} = this.state;

		if(token){ 
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
						// userName : json.userName,
						// userSignUpDate : json.userSignUpDate,
						// userEmail : json.userEmail,
						isLoading : false,
						message:json.message,
						redirect:'/profile'
					});
				}else{
					this.setState({
						isLoading:false,
					});
				}
			});
		}	

		if(redirect){
			return <Redirect to = {redirect} />
		}

		if(isLoading){
			return (<div><p>Loading......</p></div>);
		}

		return(

			<div>
				<div>
					<h3>Sign In</h3>
					<input type = 'email' placeholder = 'Email'
					 onChange = {this.onEmailTextBoxChange}/>
					<br/>
					<input type = 'password' placeholder = 'Password'
					onChange = {this.onPasswordTextBoxChange}/>
					<br/>

					<button onClick = {this.onSignIn}>Sign In </button>
					<p>{message}</p>
					<Link to='/'>Not registered? Sign up here</Link>
				</div>
			</div>
		)
	}
}

export default SignIn;