import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { Link, useHistory } from 'react-router-dom';
import logo from "../pinhead.png";
import SVGLoadingIcon from '../components/SVGLoadingIcon';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin-bottom: 10%;
    input {
        width: 100%;
        margin: 1px;
    }
`

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default function Login(props) {

    const history = useHistory()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        API.checkUser()
        .catch(err => history.push("/dashboard"))
    }, [])

    const handleLogin = event => {
        event.preventDefault()
        setLoading(true)
        API.loginUser(email, password)
        .then(res => {
            setLoading(false)
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userId", res.data.userId)
            history.push("/dashboard")
        })
        .catch(err => {
            setLoading(false)
            setErrorMessage(err.response.data.error)
        })
    }

    return (
        <Container>
            {loading ?
            <SVGLoadingIcon />
            :
            <></>}

            <img src={logo} style={{ objectFit: "cover", width: 200}} />
            <h1 style={{ margin: 20 }}>PINHEAD</h1>
            <LoginForm>
                <input type="text" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
                <input type="submit" value={"Submit"} onClick={handleLogin} disable={loading} />
            </LoginForm>
            <Link to="/signup">Not a user?</Link>
            {errorMessage ? <h3>{errorMessage}</h3> : <></>}
        </Container>
    )
}