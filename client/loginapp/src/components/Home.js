import React, {Component} from 'react'

class Home extends Component{

	state = {
		isLoading:true,
		token:'',
		signUpMessage:'',
		signUpEmail:'',
		signUpPassword:'',
		signInMessage:'',
		signInEmail:'',
		signInPassword:''
	}

	componentDidMount(){
		this.setState({
			isLoading:false
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

	onSignUp = ()=>{
		console.log('startuibg');
		const {signUpEmail,signUpPassword} = this.state;

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
					password:signUpPassword
				})
		}).then((res)=>  res.json()).then((json)=>{
			console.log('JSON:');
			console.log(json);

			if(json.success){//successful sign up
				this.setState({
					signUpMessage:json.message,
					isLoading:false,
					signUpEmail:'',
					signUpPassword:''
				});
			}else{
				this.setState({
					isLoading:false,
					signUpMessage:json.message,
					signUpEmail:'',
					signUpPassword:''
				});
			}

		});

	}

	//SignIn system
	onSignInEmailTextBoxChange = (e)=>{
		this.setState({
			signInEmail:e.target.value
		});
	}
	
	onSignInPasswordTextBoxChange = (e)=>{
		this.setState({
			signInPassword:e.target.value
		});
	}

	onSignIn = ()=>{
		const {signInEmail,signInPassword} = this.state;

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
					email:signInEmail,
					password:signInPassword
				})
			}).then((res)=> res.json()).then((json)=>{
				console.log(json.token);

				if(json.success){
					this.setState({
						isLoading:false,
						signInMessage:json.message,
						signInEmail:'',
						signInPassword:'',
						token:json.token
					});
				}else{
					this.setState({
						isLoading:false,
						signInMessage:json.message,
						signInEmail:'',
						signInPassword:''
					});
				}

			});

	}


	render(){

		const {
			isLoading,
			token,
			signUpMessage,
			signUpEmail,
			signUpPassword,
			signInEmail,
			signInPassword,
			signInMessage
		} = this.state;

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
					<input type = 'password' placeholder = 'Password'
					onChange = {this.onSignUpPasswordTextBoxChange}/>
					<br/>

					<button onClick = {this.onSignUp}>Sign Up </button>
					<p>{signUpMessage}</p>
				</div>
				<hr/>

				<div>
					<h3>Already registered? Sign in</h3>
					<input type = 'email' placeholder = 'Email'
					 onChange = {this.onSignInEmailTextBoxChange}/>
					<br/>
					<input type = 'password' placeholder = 'Password'
					onChange = {this.onSignInPasswordTextBoxChange}/>
					<br/>

					<button onClick = {this.onSignIn}>Sign In </button>
					<p>{signInMessage}</p>
				</div>


			</div>
		)
	}

}

export default Home;