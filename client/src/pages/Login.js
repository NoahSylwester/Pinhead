import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

export default function Login(props) {

    return (
        <Container>
            <h1>WELCOME TO PINHEAD</h1>
            <input type="text" placeholder="username" />
            <input type="password" placeholder="password" />
        </Container>
    )
}