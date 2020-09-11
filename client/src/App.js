import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Project from './pages/Project';
import Dashboard from './pages/Dashboard';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`

function App() {
  return (
    <Container>
      <BrowserRouter>
        <div>
          {/* <Link to="/">LOGIN</Link>
          <Link to="/dashboard">DASHBOARD</Link> */}
          {/* <Link to="/project">PROJECT</Link> */}
        </div>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route path="/project/:id" component={Project}></Route>
        </Switch>
      </BrowserRouter>
    </Container>
  );
}

export default App;
