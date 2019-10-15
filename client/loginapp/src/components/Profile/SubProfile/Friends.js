import React , {Component} from 'react';
import {Redirect} from 'react-router-dom';

import './Friends.css'

//Class to check some functionalities of react js
class Friends extends Component{

	state = {
		token:'',
		friends:[],
	};

	componentDidMount(){
		this.setState({
			token:localStorage.getItem('signInToken')
		});
	}

	render(){
		var {token,friends} = this.state;
		if(token){

			fetch('http://localhost:8080/api/account/profile/friends'
				,{
					method:'POST',
					headers:{
						'Content-Type':'application/json',
						'Accept':'application/json'
					},															
					body:{
						token:token
					}

				}).then((res)=>res.json()).then((json)=>{
					//retreive friends list here
				});

		}

		return (
			<div>
			<p>This is the test page</p>
			</div>
		);
	}


}

export default Friends