import React,{Component} from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'


class Navbar extends Component{
	state = {

	}

	render(){
		return(
	  <nav>
        <ul>
          <li><NavLink to='/'>Home</NavLink></li>
          <li><NavLink to='/signIn'>Sign In</NavLink></li>
          <li><NavLink to='/profile'>Profile</NavLink></li>
          <li><NavLink to='/test'>Test</NavLink></li>
        </ul>
      </nav>

		);
	}

}

export default Navbar;