import React,{Component} from 'react'
import {NavLink} from 'react-router-dom'
import './ProfileNavbar.css'


class ProfileNavbar extends Component{
	state = {

	}

	render(){
		return(
	  <nav>
        <ul>
          <li><NavLink to='/profile'>My Profile</NavLink></li>
          <li><NavLink to='/profile/friends'>Friends</NavLink></li>
        </ul>
      </nav>

		);
	}

}

export default ProfileNavbar;