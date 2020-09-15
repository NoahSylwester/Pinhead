import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectItem from '../components/ProjectItem';
import styled from 'styled-components';
import API from '../utils/API';
import logo from "../pinhead.png"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin-bottom: 20%;
`

const LogoutButton = styled.button`
    position: absolute;
    top: 5px;
    left: 10px;
`

export default function Dashboard(props) {

    const [projects, setProjects] = useState([]);
    const [username, setUsername] = useState("");
    const history = useHistory();

    useEffect(() => {
        API.queryProjects()
        .then(response => {
            setProjects(response.data)
        })
        API.checkUser()
        .then(response => {
            setUsername(response.data.name)
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
            <img src={logo} style={{ objectFit: "cover", width: 100, }} />
            <h1>{username ? `Welcome, ${username}!` : ""}</h1>
            <button style={{ width: "200px" }} onClick={handleNewProject}>New Project</button>
            {projects.length ? projects.map(project => <ProjectItem key={project._id} project={project} />) : <p>No projects yet!</p>}
        </Container>
    )
}