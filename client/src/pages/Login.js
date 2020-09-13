import React, { useState } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { Link, useHistory } from 'react-router-dom';
import logo from "../pinhead.png"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin-bottom: 10%;
`

export default function Login(props) {

    const history = useHistory()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleLogin = event => {
        event.preventDefault()
        API.loginUser(email, password)
        .then(res => {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userId", res.data.userId)
            history.push("/dashboard")
        })
        .catch(err => setErrorMessage(err.response.data.error))
    }

    return (
        <Container>
            <img src={logo} style={{ objectFit: "cover", width: 200, height: 200}} />
            <h1 style={{ margin: 20 }}>PINHEAD</h1>
            <input type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <Link to="/signup">Not a user?</Link>
            {errorMessage ? <h3>{errorMessage}</h3> : <></>}
        </Container>
    )
}