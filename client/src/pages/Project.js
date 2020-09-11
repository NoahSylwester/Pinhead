import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { useParams, Link } from 'react-router-dom';
import Marker from '../components/Marker';

const Page = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`

const BackButton = styled(Link)`
    position: absolute;
    left: 10px;
    top: 5px;
`

const DataSection = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`

const ImageSection = styled.div`
    width: 70%;
    height: 95%;
    padding: 10px;
`

const Canvas = styled.canvas`
    width: 100%;
    height: 100%;
    border: 1px solid black;
`

export default function Project(props) {

    const { id } = useParams()

    const [project, setProject] = useState({
        _id: "",
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

    useEffect(() => {
        API.updateProject(project)
        .then(res => {
            console.log(res)
            // API.queryProject(id)
            // .then(response => {
            //     setProject(response.data)
            // })
        })
    }, [project])

    const handleTitleUpdate = event => {
        console.log(event.target.textContent)
        setProject({
            ...project,
            title: event.target.textContent
        })
    }

    const handleDelete = () => {
        API.deleteProject(id)
        .then(res => console.log(res))
    }

    return (
        <Page>
            <BackButton to={"/dashboard"}>Back</BackButton>
            <DataSection>
                <h1 contentEditable="true" style={{ textAlign: "center" }} onBlur={handleTitleUpdate}>{project.title}</h1>
                <button onClick={handleDelete}>Delete</button>
                <input type="file" />
                <p>Click on image to add a marker!</p>
                {project.markers.length ? 
                project.markers.map(marker => {
                    return <Marker>{marker}</Marker>
                }) : <></>}
            </DataSection>
            <ImageSection>
                <Canvas></Canvas>
            </ImageSection>
        </Page>
    )
}