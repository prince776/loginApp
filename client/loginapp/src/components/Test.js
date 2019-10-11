import React , {Component} from 'react';
import {Redirect} from 'react-router-dom';

//Class to check some functionalities of react js
class Test extends Component{

	state = {
		something:''
	};
	componentDidMount(){

	}

	render(){
		//return <Redirect to='/profile' />
		return (
			<div>
			<p>This is the test page</p>
			</div>
		);
	}


}

export default Test