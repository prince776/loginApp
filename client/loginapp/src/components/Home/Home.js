import React, {Component} from 'react'

class Home extends Component{

	state = {
		isLoading:true,
		token:'',
		signUpMessage:'',
		signUpEmail:'',
		signUpUsername:'',
		signUpPassword:'',
		signInMessage:'',
		signInEmail:'',
		signInPassword:'',
		verificationMessage:'',
		logOutMessage:''
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
					//put token in local storage
					localStorage.setItem('signInToken',json.token);
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

	onVerify = ()=>{
		const {token} = this.state;

		this.setState({
			isLoading:true
		});

		fetch('http://localhost:8080/api/account/verify'
			,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':'application/json'
				},
				body:JSON.stringify({
					token:token
				})
			}).then((res)=> res.json()).then((json)=>{
				this.setState({
					verificationMessage:json.message,
					isLoading:false,
				});
			});

	}

	onLogout = ()=>{
		const {token} = this.state;

		this.setState({
			isLoading:true
		});

		fetch("http://localhost:8080/api/account/logout"
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
					logOutMessage:json.message
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
			signInEmail,
			signInPassword,
			signInMessage,
			verificationMessage,
			logOutMessage
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
					<input type = 'text' placeholder = 'Name'
					 onChange = {this.onSignUpUsernameTextBoxChange}/>
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

				<hr/>

				<div>
					<h4>Already Signed in? Click to refresh session</h4>
					<button onClick = {this.onVerify}>Auto Sign In</button>
					<p>{verificationMessage}</p>
				</div>

				<hr/>
				<div>
					<button onClick={this.onLogout}>Log out</button>
					<p>{logOutMessage}</p>
				</div>


			</div>
		)
	}

}

export default Home;