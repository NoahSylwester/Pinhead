import React, { useState } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { Link, useHistory } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

export default function Signup(props) {

    const history = useHistory()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = event => {
        event.preventDefault()
        API.registerUser(username, password, email)
        .then(res => {
            console.log(res)
            alert("User successfully created")
            history.push("/")
        })
        .catch(err => console.log(err))
    }

    return (
        <Container>
            <h1>SIGNUP</h1>
            <input type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
            <input type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <button onClick={handleSignup}>Signup</button>
            <Link to="/">Back to login</Link>
        </Container>
    )
}