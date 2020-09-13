import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { useParams, Link, useHistory } from 'react-router-dom';
import Marker from '../components/Marker';
import Canvas from '../components/Canvas';
import PresetDataRow from '../components/PresetDataRow';

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
    overflow: scroll;
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
    const [definePresetsPressed, setDefinePresetsPressed] = useState(false)
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
    const [selectorColor, setSelectorColor] = useState("#FF2D00")
    const [presetDataKeys, setPresetDataKeys] = useState([])
    const [presetDataValues, setPresetDataValues] = useState([])

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

    const handleAddPresetRow = () => {
        setPresetDataKeys([...presetDataKeys, ""])
        setPresetDataValues([...presetDataValues, ""])
    }

    const handleUpdatePresetRowKey = (key, i) => {
        const presetKeys = presetDataKeys;
        presetKeys[i] = key
        setPresetDataKeys([...presetKeys])
    }

    const handleUpdatePresetRowValue = (value, i) => {
        const presetValues = presetDataValues;
        presetValues[i] = value;
        setPresetDataValues([...presetValues])
    }

    const handleDeletePresetRow = index => {
        const presetKeys = presetDataKeys;
        const presetValues = presetDataValues;
        presetKeys.splice(index, 1)
        presetValues.splice(index, 1)
        setPresetDataKeys([...presetDataKeys])
        setPresetDataValues([...presetDataValues])
    }

    const handleClearPresetRows = () => {
        setPresetDataKeys([])
        setPresetDataValues([])
    }

    const handleManualSelection = (index, isManuallySelected) => {
        const markers = project.markers;
        markers[index].isManuallySelected = isManuallySelected;
        setProject({ ...project, markers })
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
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 20 }}>
                    <p>Selector color</p>
                    <input type="color" value={selectorColor} onChange={event => setSelectorColor(event.target.value)}/>
                </div>
                {definePresetsPressed ?
                <div>
                    <div>
                        <input style={{width: "40%"}} value="Field names" disabled />
                        <input style={{width: "40%"}} value="Default values" disabled />
                    </div>
                    {presetDataKeys.map((data_key, i) => {
                        return (
                        <PresetDataRow
                            data_key={data_key}
                            data_value={presetDataValues[i]}
                            index={i}
                            pass={{
                                handleDeletePresetRow,
                                handleUpdatePresetRowKey,
                                handleUpdatePresetRowValue
                            }}
                        />)
                    })}
                    <button onClick={handleAddPresetRow}>Add another row</button>
                    <button onClick={handleClearPresetRows}>Clear</button>
                    <button onClick={() => setDefinePresetsPressed(false)}>Hide</button>
                </div>
                    :
                <button onClick={() => setDefinePresetsPressed(true)}>Set marker presets</button>}
                <p>Click on image to add a marker!</p>
                <ol style={{ width: "70%", padding: 0 }}>
                {project.markers.length ? 
                project.markers.map((marker, i) => {
                    return (
                    <Marker 
                        key={marker._id} 
                        marker={marker} 
                        index={i}
                        setUpdate={setUpdate} 
                        setSelectedMarker={setSelectedMarker}
                        handleManualSelection={handleManualSelection}
                    >
                    </Marker>)
                }) : <></>}
                </ol>
            </DataSection>
            <ImageSection>
                {project._id ? 
                <Canvas 
                    imagePath={`/api/projects/image/${project._id}`} 
                    markers={project.markers} project={project} 
                    setUpdate={setUpdate} 
                    selectedMarker={selectedMarker} 
                    selectorColor={selectorColor}
                    presetDataKeys={presetDataKeys}
                    presetDataValues={presetDataValues}
                >
                </Canvas> : <></>}
                {/* <img src={`/api/projects/image/${project._id}`} /> */}
            </ImageSection>
        </Page>
    )
}