import React , {Component,Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import ProfileNavbar from './ProfileNavbar.js';

import './Friends.css'

class Friends extends Component{

	state = {
		token:'',
		friendList:[],
		message:'',
	};

	componentDidMount(){
		this.setState({
			token:localStorage.getItem('signInToken'),
		});
	}

	render(){
		var {token,friendList,message} = this.state;


		if(token){

			fetch('http://localhost:8080/api/account/profile/friendList'
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
						this.setState({
							friendList:json.friendList,
							message:''					
						})
					}else{
						this.setState({
							message:json.message
						})
					}
				});

		}



		return (
			<div>
			<ProfileNavbar />
			<hr/>
			<p>This is the test page</p><br/>

			<h3>Your Friends</h3>
			
			<Fragment>

			<thead>
			<tr>
			<th>Name</th>
			<th>Since</th>
			</tr>
			</thead>

			<tbody>
				
				{friendList.map(friend => (
					<tr key= {friend.name}>
					<td >{friend.name}</td>
					<td >{friend.since}</td>
					</tr>
				))}

			</tbody>

			</Fragment>

			<p>{message?"friend List Fetch Message " + message:""}</p>

			</div>
		);
	}


}

export default Friends