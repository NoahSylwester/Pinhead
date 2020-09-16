import React, { useState } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { Link, useHistory } from 'react-router-dom';
import SVGLoadingIcon from '../components/SVGLoadingIcon';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    input {
        width: 100%;
        margin: 1px;
    }
`

const SignupForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default function Signup(props) {

    const history = useHistory()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = event => {
        event.preventDefault()
        setLoading(true)
        API.registerUser(username, password, email)
        .then(res => {
            setLoading(false)
            alert("User successfully created")
            history.push("/")
        })
        .catch(err => {
            setLoading(false)
            console.log(err)
        })
    }

    return (
        <Container>
            {loading ?
            <SVGLoadingIcon />
            :
            <></>}

            <h1>SIGNUP</h1>
            <SignupForm>
                <input type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
                <input type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
                <input type="submit" value="Signup" onClick={handleSignup} disable={loading} />
            </SignupForm>
            <Link to="/">Back to login</Link>
        </Container>
    )
}