import React, { Component } from 'react';
import logo from './logo.svg';

import {Route, Switch, Link} from 'react-router-dom'

import './App.css'
import PostsList from './components/PostsList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to='/' ><h1 className='title'>Postmaster</h1></Link>
        <Switch>
          <Route exact path='/:category' component={PostsList} />
          <Route exact path='/' component={PostsList} />
        </Switch>
      </div>
    );
  }
}

export default App;
