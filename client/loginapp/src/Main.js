import React from 'react'
import {Switch,Route} from 'react-router-dom'

import Home from './components/Home/Home.js'
import Profile from './components/Profile/Profile.js'
import Test from './components/Test.js'

const Main = ()=>(
	<Switch>
		<Route exact path='/' component = {Home}></Route> 
		<Route exact path='/profile' component = {Profile}></Route>
		<Route exact path='/test' component = {Test}></Route>                                     
	</Switch>
);

export default Main;