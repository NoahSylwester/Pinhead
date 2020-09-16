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
    .show-button {
        width: 90%;
    }
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

const PresetsPanel = styled.div`
    width: 100%;
    background-color: lightgray;
    padding: 5px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 5px 0;
    button {
        width: 80%;
        margin: auto;
    }
`

const OperationsPanel = styled.div`
    background-color: lightgray;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
    button {
        width: 80%;
        margin: auto;
    }
`

const Operation = styled.div`
    margin: 2px;
    padding: 5px;
    border: 1px darkgray solid;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p, i {
        text-align: center;
    }
    i {
        margin: 3px;
    }
`

const FilterSortPanel = styled.div`
    background-color: lightgray;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
    button {
        width: 80%;
        margin: auto;
    }
`

const Settings = styled.div`
    width: 100%;
    background-color: lightgray;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
    button {
        width: 80%;
        margin: auto;
    }
`

export default function Project(props) {

    const { id } = useParams()
    const history = useHistory()
    const renderNumber = useRef(1)

    const [deletePressed, setDeletePressed] = useState(false)
    const [submitImagePressed, setSubmitImagePressed] = useState(false)
    const [definePresetsPressed, setDefinePresetsPressed] = useState(false)
    const [showOperationsPanel, setShowOperationsPanel] = useState(false)
    const [showFilterSortPanel, setShowFilterSortPanel] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
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
    const [manuallySelectedMarkers, setManuallySelectedMarkers] = useState([])
    const [selectorColor, setSelectorColor] = useState("#FF2D00")
    const [presetDataKeys, setPresetDataKeys] = useState([])
    const [presetDataValues, setPresetDataValues] = useState([])
    const [sortedMarkers, setSortedMarkers] = useState([])
    const [sortingConfig, setSortingConfig] = useState({
        type: "none",
        sortingCol: "",
        filteringCol: "",
        asc: true,
        comparator: "==",
        filteringValue: "",
        sort: false,
        filter: false,
    })
    const [op1Config, setOp1Config] = useState({
        col: "",
        val: "",
        comparator: "=="
    })
    const [op2Config, setOp2Config] = useState({
        col1: "",
        val1: "",
        col2: "",
        val2: "",
        comparator: "=="
    })
    const [op3Config, setOp3Config] = useState({
        colToDisplay: "",
        col: "",
        val: "",
        comparator: ""
    })

    useEffect(() => {
        API.queryProject(id)
        .then(response => {
            setProject(response.data)
            handleUpdateSortingFilter(response.data, sortingConfig)
        })
    }, [])

    useEffect(() => {
        if (renderNumber.current < 1) {
            renderNumber.current++;
            return;
        }
        API.queryProject(project._id)
        .then(res => {
            API.queryProject(id)
            .then(response => {
                setProject(response.data)
                handleUpdateSortingFilter(response.data, sortingConfig)
            })
        })
    }, [update])

    const handleUpdateSortingFilter = (projectData, config) => {
        let unprocessedMarkersArray = projectData.markers.slice();
        let processedMarkersArray = projectData.markers.slice();
        if (config.filter) {
            processedMarkersArray =  processedMarkersArray.filter(item => {
                switch (config.comparator) {
                    case ">":
                        return item.data_values[item.data_keys.indexOf(config.filteringCol)] > config.filteringValue;
                    case "<":
                        return item.data_values[item.data_keys.indexOf(config.filteringCol)] < config.filteringValue;
                    case ">=":
                        return item.data_values[item.data_keys.indexOf(config.filteringCol)] >= config.filteringValue;
                    case "<=":
                        return item.data_values[item.data_keys.indexOf(config.filteringCol)] <= config.filteringValue;
                    default:
                        return item.data_values[item.data_keys.indexOf(config.filteringCol)] === config.filteringValue;
                }
              })
        }
        if (config.sort) {
            processedMarkersArray = processedMarkersArray.sort((a, b) => {
                if (a.data_values[a.data_keys.indexOf(config.sortingCol)] < b.data_values[b.data_keys.indexOf(config.sortingCol)]) {
                  return config.asc ? -1 : 1;
                }
                if (a.data_values[a.data_keys.indexOf(config.sortingCol)] > b.data_values[b.data_keys.indexOf(config.sortingCol)]) {
                  return config.asc ? 1 : -1;
                }
                // a must be equal to b
                return 0;
              })
        }
        setSortedMarkers(processedMarkersArray)
        if (!config.sort && !config.filter) {
            setSortedMarkers(unprocessedMarkersArray)
        }
    }
    

    const handleTitleUpdate = event => {
        const newTitle = event.target.textContent
        API.updateProject({ ...project, title: newTitle })
        .then(res => {
            setUpdate(Math.random())
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
            history.go(0)
        })
    }

    const handleDelete = () => {
        API.deleteProject(id)
        .then(res => {
            history.push("/dashboard")
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

    const handleManualSelection = (id, isManuallySelected) => {
        let newArray = manuallySelectedMarkers.slice();
        switch (isManuallySelected) {
            case true:
                newArray.push(id)
                setManuallySelectedMarkers(newArray);
                return;
            case false:
                newArray.splice(newArray.indexOf(id), 1)
                setManuallySelectedMarkers(newArray);
                return;
            default:
                return;
        }
    }

    const handleSwitchComparatorOperation = (comparator, operand1, operand2) => {
        switch (comparator) {
            case ">":
                return operand1 > operand2;
            case "<":
                return operand1 < operand2;
            case ">=":
                return operand1 >= operand2;
            case "<=":
                return operand1 <= operand2;
            default:
                return operand1 === operand2;
        }
    }

    const handleOp1 = event => {
        event.preventDefault();
        let { col, val, comparator } = op1Config;

        console.log(col, val, comparator)
        setManuallySelectedMarkers([])
        let selectedMarkersArray;

        if (val) {
            selectedMarkersArray = project.markers.filter(item => {
                return handleSwitchComparatorOperation(comparator, item.data_values[item.data_keys.indexOf(col)], val)
            })
        }
        else {
            selectedMarkersArray =  project.markers.filter(item => {
                return item.data_keys.includes(col)
            })
        }
        setManuallySelectedMarkers(selectedMarkersArray.map(item => item._id))
    }

    const handleOp2 = () => {
        
    }

    const handleOp3 = () => {
        
    }

    useEffect(() => {
        if (sortingConfig.filteringCol && sortingConfig.filteringValue) {
            setSortingConfig({ ...sortingConfig, filter: true })
        }
        else {
            setSortingConfig({ ...sortingConfig, filter: false })
        }
    }, [sortingConfig.filteringCol, sortingConfig.filteringValue])

    return (
        <Page>
            <BackButton to={"/dashboard"}>Back</BackButton>
            <DataSection>
                <h1 contentEditable="true" style={{ textAlign: "center" }} onBlur={handleTitleUpdate}>{project.title}</h1>
                
                {showSettings ?
                <Settings>
                    <h3 style={{ textAlign: "center" }}>SETTINGS</h3>
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
                            <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload}/>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button onClick={handleImageUpdate}>Submit</button>
                            <button onClick={() => setSubmitImagePressed(false)}>Cancel</button>
                        </div>
                    </div>
                    :
                    <button onClick={() => setSubmitImagePressed(true)}>Update image</button>}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 0 }}>
                        <p style={{margin: 5}}>Selector color</p>
                        <input type="color" value={selectorColor} onChange={event => setSelectorColor(event.target.value)}/>
                    </div>
                    <button onClick={() => setShowSettings(false)}>Hide</button>
                </Settings>
                :
                <button className={"show-button"} onClick={() => setShowSettings(true)}>Settings</button>}

                {definePresetsPressed ?
                <PresetsPanel>
                    <h3 style={{ textAlign: "center" }}>PRESETS</h3>
                    {presetDataKeys.length ?
                    (<div style={{ marginLeft: 10 }}>
                        <input style={{width: "40%"}} value="Field names" disabled />
                        <input style={{width: "40%"}} value="Default values" disabled />
                    </div>) : <></>}
                    {presetDataKeys.length ? presetDataKeys.map((data_key, i) => {
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
                    }) : <p style={{textAlign: "center", marginBottom: 15}}>No presets!</p>}
                    <button onClick={handleAddPresetRow}>Add another row</button>
                    <button onClick={handleClearPresetRows}>Clear</button>
                    <button onClick={() => setDefinePresetsPressed(false)}>Hide</button>
                </PresetsPanel>
                    :
                <button className={"show-button"} onClick={() => setDefinePresetsPressed(true)}>Set marker presets</button>}

                {showOperationsPanel ? 
                <OperationsPanel>
                    <h3 style={{ textAlign: "center" }}>OPERATIONS</h3>
                    <i style={{ display: "inline-block", fontSize: "0.2rem" }}>* = optional value</i>
                    <Operation>
                        <p>Select all markers where</p>
                        <form onSubmit={handleOp1} style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex" }}>
                                <input onChange={event => setOp1Config({ ...op1Config, col: event.target.value})} value={op1Config.col} style={{width: "50%"}} placeholder="Field" />
                                <select onChange={event => setOp1Config({ ...op1Config, comparator: event.target.value })} value={op1Config.comparator}>
                                    <option value="==">==</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value=">=">&gt;=</option>
                                    <option value="<=">&lt;=</option>
                                </select>
                                <input onChange={event => setOp1Config({ ...op1Config, val: event.target.value})} value={op1Config.val} style={{width: "50%"}} placeholder="Value*" />
                            </div>
                            <i style={{ display: "inline-block", fontSize: "0.2rem" }}>Value defaults to 'anything'</i>
                            <input type="submit" value="Go" />
                        </form>
                    </Operation>
                    <Operation>
                        <p>Replace all values of</p>
                        <form style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex" }}>
                                <input onChange={event => setOp2Config({ ...op2Config, col1: event.target.value})} value={op2Config.col1} style={{width: "50%"}} placeholder="Field 1" />
                                <p style={{margin: 0}}>&nbsp;with&nbsp;</p>
                                <input onChange={event => setOp2Config({ ...op2Config, val1: event.target.value})} value={op2Config.val1} style={{width: "50%"}} placeholder="Value 1" />
                            </div>
                            <div style={{ display: "flex" }}>
                                <p style={{margin: 0}}>if&nbsp;</p>
                                <input onChange={event => setOp2Config({ ...op2Config, col2: event.target.value})} value={op2Config.col2} style={{width: "50%"}} placeholder="Field 2*" />
                                <select onChange={event => setOp2Config({ ...op2Config, comparator: event.target.value })} value={op2Config.comparator}>
                                    <option value="==">==</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value=">=">&gt;=</option>
                                    <option value="<=">&lt;=</option>
                                </select>
                                <input onChange={event => setOp2Config({ ...op2Config, val2: event.target.value})} value={op2Config.val2} style={{width: "50%"}} placeholder="Value 2" />
                            </div>
                            <i style={{ display: "inline-block", fontSize: "0.2rem" }}>Field 2 defaults to Field 1</i>
                            <input type="submit" value="Go" />
                        </form>
                    </Operation>
                    <Operation>
                        <p>Display all values of</p>
                        <form style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <input onChange={event => setOp3Config({ ...op3Config, colToDisplay: event.target.value})} value={op3Config.colToDisplay} style={{width: "50%"}} placeholder="Field 1" />
                            </div>
                            <div style={{ display: "flex" }}>
                                <p style={{margin: 0}}>where&nbsp;</p>
                                <input onChange={event => setOp3Config({ ...op3Config, col: event.target.value})} value={op3Config.col} style={{width: "50%"}} placeholder="Field 2*" />
                                <select onChange={event => setOp3Config({ ...op3Config, comparator: event.target.value })} value={op3Config.comparator}>
                                    <option value="==">==</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value=">=">&gt;=</option>
                                    <option value="<=">&lt;=</option>
                                </select>
                                <input onChange={event => setOp3Config({ ...op3Config, val: event.target.value})} value={op3Config.val} style={{width: "50%"}} placeholder="Value*" />
                            </div>
                            <i style={{ display: "inline-block", fontSize: "0.2rem" }}>Field 2 defaults to Field 1, Value defaults to 'anything'</i>
                            <input type="submit" value="Go" />
                        </form>
                    </Operation>
                    <button onClick={() => setShowOperationsPanel(false)}>Hide</button>
                </OperationsPanel> 
                    : 
                <button className={"show-button"} onClick={() => setShowOperationsPanel(true)}>Show operations panel</button>}
                
                {showFilterSortPanel ? (
                <FilterSortPanel>
                    <h3 style={{ textAlign: "center" }}>FILTER/SORT</h3>
                    <p>Filter by</p>
                    <div style={{ display: "flex" }}>
                        <input onChange={event => setSortingConfig({ ...sortingConfig, filteringCol: event.target.value})} value={sortingConfig.filteringCol} style={{width: "50%"}} placeholder="Field" />
                        <select onChange={event => setSortingConfig({ ...sortingConfig, comparator: event.target.value })} value={sortingConfig.comparator}>
                            <option value="==">==</option>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                        </select>
                        <input onChange={event => setSortingConfig({ ...sortingConfig, filteringValue: event.target.value})} value={sortingConfig.filteringValue} style={{width: "50%"}} placeholder="Value" />
                    </div>

                    <p>Sort by</p>
                    <div style={{ display: "flex", marginBottom: 10 }}>
                        <input onChange={event => setSortingConfig({ ...sortingConfig, sort: !!event.target.value, sortingCol: event.target.value })} value={sortingConfig.sortingCol} style={{width: "50%"}} placeholder="Field" />
                        <select onChange={event => setSortingConfig({ ...sortingConfig, asc: event.target.value === "true" ? true : false})} value={sortingConfig.asc} style={{width: "50%"}}>
                            <option value={true}>ascending</option>
                            <option value={false}>descending</option>
                        </select>
                    </div>

                    <button onClick={() => handleUpdateSortingFilter(project, sortingConfig)}>Submit</button>
                    <button onClick={() => {
                        let resetConfig = {
                            type: "none",
                            sortingCol: "",
                            filteringCol: "",
                            asc: true,
                            comparator: "==",
                            filteringValue: "",
                            sort: false,
                            filter: false,
                    }
                    handleUpdateSortingFilter(project, resetConfig)
                    setSortingConfig(resetConfig)}}>Reset</button>
                    <button onClick={() => setShowFilterSortPanel(false)}>Hide</button>
                </FilterSortPanel>
                )
                :
                <button className={"show-button"} onClick={() => setShowFilterSortPanel(true)}>Show filter/sort options</button>
                }

                <div style={{ width: "90%", paddingBottom: "70px" }}>
                <h3 style={{textAlign: "center"}}>MARKERS</h3>
                {sortedMarkers.length ?
                sortedMarkers.map((marker, i) => {
                    return (
                    <Marker 
                        key={marker._id} 
                        marker={marker} 
                        setUpdate={setUpdate} 
                        setSelectedMarker={setSelectedMarker}
                        handleManualSelection={handleManualSelection}
                    >
                    </Marker>)
                }) : <p>{project.markers.length ? "No markers found under current parameters." : "No markers yet. Upload an image in settings, then click the image to add a marker!"}</p>}

                </div>
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
                    manuallySelectedMarkers={manuallySelectedMarkers}
                >
                </Canvas> : <></>}
                {/* <img src={`/api/projects/image/${project._id}`} /> */}
            </ImageSection>
        </Page>
    )
}