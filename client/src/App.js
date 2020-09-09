import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Project from './pages/Project';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route path="/dashboard" component={Dashboard}></Route>
        <Route path="/project" component={Project}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
