import React from 'react';
import './App.css';
import Navbar from'./components/Navbar/Navbar.js';
import Main from './Main.js'

function App(){
    return(

      <div className = "App">
        <h1>Social Networking Site</h1>
        <Navbar />
        <hr/>
        <Main/>
      </div>

    );
}

export default App;