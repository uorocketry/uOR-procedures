import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Splash from './components/Splash';


function App() {
  return (
    <Router>
      <Route path='/' component={Splash} />
    </Router>
  );
}

export default App;
