import React, { useState } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { Link } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

export default function Login(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = event => {
        event.preventDefault()
        API.loginUser(email, password)
        .then(res => {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userId", res.data.userId)
        })
    }

    return (
        <Container>
            <h1>WELCOME TO PINHEAD</h1>
            <input type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <Link to="/signup">Not a user?</Link>
        </Container>
    )
}