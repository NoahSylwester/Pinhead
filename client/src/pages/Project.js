import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { useParams, Link, useHistory } from 'react-router-dom';
import Marker from '../components/Marker';
import Canvas from '../components/Canvas';

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

export default function Project(props) {

    const { id } = useParams()
    const history = useHistory()
    const renderNumber = useRef(1)

    const [deletePressed, setDeletePressed] = useState(false)
    const [submitImagePressed, setSubmitImagePressed] = useState(false)
    const [imageStage, setImageStage] = useState({ data: "", config: "" })
    const [project, setProject] = useState({
        _id: "",
        title: "",
        author: "",
        image: "",
        date_created: "",
        markers: [],
      });
    const [update, setUpdate] = useState(0)
    const [selectedMarker, setSelectedMarker] = useState("")

    useEffect(() => {
        API.queryProject(id)
        .then(response => {
            setProject(response.data)
        })
    }, [])

    useEffect(() => {
        if (renderNumber.current < 1) {
            renderNumber.current++;
            return;
        }
        console.log(project)
        API.queryProject(project._id)
        .then(res => {
            console.log("PROJECT  ", res)
            API.queryProject(id)
            .then(response => {
                setProject(response.data)
            })
        })
    }, [update])

    const handleTitleUpdate = event => {
        const newTitle = event.target.textContent
        API.updateProject({ ...project, title: newTitle })
        .then(res => {
            console.log(res)
            API.queryProject(id)
            .then(response => {
                setProject(response.data)
            })
        })
    }

    const handleImageUpload = event => {
        const imageFile = event.target.files[0];
        let data = new FormData();  
        data.append('file', imageFile);
        const config = {
            headers: {
            'Accept': 'application/json',
            }
          };
        setImageStage({ data, config })
    }

    const handleImageUpdate = event => {
        let { data, config } = imageStage;
        API.updateProjectImage(project._id, data, config)
        .then(res => {
            console.log(res.data)
            history.go(0)
        })
    }

    const handleDelete = () => {
        API.deleteProject(id)
        .then(res => {
            history.push("/dashboard")
            console.log(res)
        })
    }

    return (
        <Page>
            <BackButton to={"/dashboard"}>Back</BackButton>
            <DataSection>
                <h1 contentEditable="true" style={{ textAlign: "center" }} onBlur={handleTitleUpdate}>{project.title}</h1>
                {deletePressed ? 
                <div style={{ display: "flex" }}>
                    <button onClick={handleDelete}>Yes, delete</button>
                    <button onClick={() => setDeletePressed(false)}>Cancel</button>
                </div>
                :
                <button onClick={() => setDeletePressed(true)}>Delete</button>}

                {submitImagePressed ? 
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ textAlign: "center" }}>
                        <input type="file" onChange={handleImageUpload}/>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button onClick={handleImageUpdate}>Submit</button>
                        <button onClick={() => setSubmitImagePressed(false)}>Cancel</button>
                    </div>
                </div>
                :
                <button onClick={() => setSubmitImagePressed(true)}>Update image</button>}
                <p>Click on image to add a marker!</p>
                <ol style={{ width: "70%", padding: 0 }}>
                {project.markers.length ? 
                project.markers.map(marker => {
                    return <Marker key={marker._id} marker={marker} setUpdate={setUpdate} setSelectedMarker={setSelectedMarker}></Marker>
                }) : <></>}
                </ol>
            </DataSection>
            <ImageSection>
                {project._id ? <Canvas imagePath={`/api/projects/image/${project._id}`} markers={project.markers} project={project} setUpdate={setUpdate} selectedMarker={selectedMarker}></Canvas> : <></>}
                {/* <img src={`/api/projects/image/${project._id}`} /> */}
            </ImageSection>
        </Page>
    )
}