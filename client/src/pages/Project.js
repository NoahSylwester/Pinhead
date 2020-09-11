import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { useParams } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

export default function Project(props) {

    const { id } = useParams()

    const [project, setProject] = useState({
        title: "",
        author: "",
        image: "",
        date_created: "",
        markers: [],
      });

    useEffect(() => {
        API.queryProject(id)
        .then(response => {
            setProject(response.data)
        })
    }, [])

    const handleDelete = () => {
        API.deleteProject(id)
        .then(res => console.log(res))
    }

    return (
        <Container>
            <h1>PROJECT</h1>
            <div>{project.title}</div>
            <button onClick={handleDelete}>Delete</button>
        </Container>
    )
}