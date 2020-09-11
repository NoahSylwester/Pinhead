import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectItem from '../components/ProjectItem';
import styled from 'styled-components';
import API from '../utils/API';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

const LogoutButton = styled.button`
    position: absolute;
    top: 5px;
    left: 10px;
`

export default function Dashboard(props) {

    const [projects, setProjects] = useState([]);
    const history = useHistory();

    useEffect(() => {
        API.queryProjects()
        .then(response => {
            setProjects(response.data)
        })
    }, [])

    const handleLogout = () => {
        localStorage.setItem("token", "")
        localStorage.setItem("userId", "")
        history.push("/")
    }

    const handleNewProject = () => {
        API.createProject()
        .then(res => {
            history.push(`/project/${res.data._id}`);
        })
    }

    return (
        <Container>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            <h1>DASHBOARD</h1>
            <button onClick={handleNewProject}>New Project</button>
            {projects.length ? projects.map(project => <ProjectItem key={project._id} project={project} />) : <></>}
        </Container>
    )
}