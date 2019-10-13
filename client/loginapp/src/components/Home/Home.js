import React, {Component} from 'react'
import {Redirect,Link} from 'react-router-dom'
import './Home.css'

class Home extends Component{

	state = {
		isLoading:true,
		token:'',
		message:'',
		signUpEmail:'',
		signUpUsername:'',
		signUpPassword:'',
		redirect:'',
	}

	componentDidMount(){
		this.setState({
			isLoading:false,
			token:localStorage.getItem('signInToken')
		});
		
	}

	//SignUp system
	onSignUpEmailTextBoxChange = (e)=>{
		this.setState({
			signUpEmail:e.target.value
		});
	}

	onSignUpPasswordTextBoxChange = (e)=>{
		this.setState({
			signUpPassword:e.target.value
		});
	}

	onSignUpUsernameTextBoxChange = (e) =>{
		this.setState({
			signUpUsername:e.target.value
		});
	}

	onSignUp = ()=>{
		const {signUpEmail,signUpPassword,signUpUsername} = this.state;

		this.setState({isLoading:true});

		fetch('http://localhost:8080/api/account/signup'
			,{	
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					email:signUpEmail,
					password:signUpPassword,
					username:signUpUsername
				})
		}).then((res)=>  res.json()).then((json)=>{

			this.setState({
					signUpMessage:json.message,
					isLoading:false,
					signUpEmail:'',
					signUpPassword:'',
					signUpUsername:''
			});

		});

	}

	render(){

		const {
			isLoading,
			token,
			signUpMessage,
			signUpEmail,
			signUpPassword,
			signUpUsername,
			redirect
		} = this.state;	

		if(redirect){
			return <Redirect to = {redirect} />
		}

		if(isLoading){
			return (<div><p>Loading......</p></div>);
		}

		return(

			<div>
				<div>
					<h3>Sign Up</h3>
					<input type = 'email' placeholder = 'Email'
					 onChange = {this.onSignUpEmailTextBoxChange}/>
					<br/>
					<input type = 'text' placeholder = 'Name'
					 onChange = {this.onSignUpUsernameTextBoxChange}/>
					<br/>
					<input type = 'password' placeholder = 'Password'
					onChange = {this.onSignUpPasswordTextBoxChange}/>
					<br/>

					<button onClick = {this.onSignUp}>Sign Up </button>
					<p>{signUpMessage}</p>
					<Link to='/signin'>Already registered? Sign in here </Link>
				</div>
			</div>
		)
	}

}

export default Home;