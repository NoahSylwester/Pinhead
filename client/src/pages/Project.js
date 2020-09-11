import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

export default function Project(props) {

    const [project, setProject] = useState({
        title: "",
        author: "",
        image: "",
        date_created: "",
        markers: [],
      });

    useEffect(() => {
        API.queryProject()
        .then(result => {
            setProject(result)
        })
    }, [])

    return (
        <Container>
            <h1>PROJECT</h1>
            <div>{project.title}</div>
        </Container>
    )
}