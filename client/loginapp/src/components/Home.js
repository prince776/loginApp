import React, {Component} from 'react'

class Home extends Component{

	render(){
		return(

			<div>
				<div>
					<h3>Sign Up</h3>
					<input type = 'email' placeholder = 'Email'/>
					<br/>
					<input type = 'password' placeholder = 'Password'/>
					<br/>

					<button>Sign Up</button>
				</div>
			</div>
		)
	}

}

export default Home;