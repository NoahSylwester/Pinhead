import React, { useState, useEffect } from 'react';
import ProjectItem from '../components/ProjectItem';
import styled from 'styled-components';
import API from '../utils/API';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

export default function Dashboard(props) {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        API.queryProjects()
        .then(result => {
            setProjects(result)
        })
    }, [])

    return (
        <Container>
            <h1>DASHBOARD</h1>
            {projects.map(project => <ProjectItem project={project} />)}
        </Container>
    )
}