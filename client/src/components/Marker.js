import React, { useState, useEffect } from 'react';
import API from '../utils/API';
import styled from 'styled-components';
import DataRow from './DataRow'

const ListItem = styled.div`
    width: 90%;
    border: 1px solid gray;
    margin: 1px 0;
    padding: 5px;
    position: relative;
`

const ManualSelectionButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    background-color: ${props => props.bool ? "lightgreen": "lightgray"};
    border: none;
`

export default function Marker(props) {

    const [isDeletePressed, setIsDeletePressed] = useState(false)
    const [color, setColor] = useState(props.marker.color)
    const [shape, setShape] = useState(props.marker.shape)
    const [newDataKey, setNewDataKey] = useState("")
    const [isManuallySelected, setIsManuallySelected] = useState(false)

    const handleContentUpdate = event => {
        API.updateMarker({ ...props.marker, content: event.target.textContent })
        .then(res => {
            props.setUpdate(Math.random())
        })
    }

    const handleColorUpdate = event => {
        setColor(event.target.value)
        API.updateMarker({ ...props.marker, color: event.target.value })
        .then(res => {
            props.setUpdate(Math.random())
        })
    }

    const handleShapeUpdate = event => {
        setShape(event.target.value)
        API.updateMarker({ ...props.marker, shape: event.target.value })
        .then(res => {
            props.setUpdate(Math.random())
        })
    }

    const handleAddField = event => {
        if (!newDataKey) {
            return;
        }
        API.updateMarker({ ...props.marker, data_keys: [...props.marker.data_keys, newDataKey], data_values: [...props.marker.data_values, ""] })
        .then(res => {
            props.setUpdate(Math.random())
        })
    }

    const handleDataKeyChange = (event, index) => {
        const { textContent: key } = event.target;
        const data_keys = props.marker.data_keys;
        data_keys[index] = key;
        console.log("DATA", index, key, data_keys)
        API.updateMarker({ ...props.marker, data_keys })
        .then(res => {
            console.log(res)
            props.setUpdate(Math.random())
        })
    }

    const handleDataValueChange = (value, index) => {
        const data_values = props.marker.data_values;
        data_values[index] = value;
        console.log("VALUES", index, value, data_values)
        API.updateMarker({ ...props.marker, data_values })
        .then(res => {
            console.log(res)
            props.setUpdate(Math.random())
        })
    }

    const handleDeleteRow = index => {
        const data_keys = props.marker.data_keys;
        const data_values = props.marker.data_values;
        data_keys.splice(index, 1);
        data_values.splice(index, 1);
        API.updateMarker({ ...props.marker, data_keys, data_values })
        .then(res => {
            props.setUpdate(Math.random())
        })
    }

    const handleDelete = event => {
        API.deleteMarker(props.marker._id)
        .then(res => {
            props.setUpdate(Math.random())
        })
    }

    const handleOnMouseEnter = event => {
        props.setSelectedMarker(props.marker._id)
    }

    const handleOnMouseLeave = event => {
        props.setSelectedMarker("")
    }

    useEffect(() => {
        props.handleManualSelection(props.marker._id, isManuallySelected)
    }, [isManuallySelected])

    useEffect(() => {
        setIsManuallySelected(props.isManuallySelectedFromOutside)
    }, [props.isManuallySelectedFromOutside])

    return (
        <ListItem onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <ManualSelectionButton onClick={() => setIsManuallySelected(!isManuallySelected)} bool={isManuallySelected}>{isManuallySelected ? "Unselect" : "Select"}</ManualSelectionButton>
            <p style={{ fontSize: "1.1rem", color: "rgb(100,100,100)" }}  onBlur={handleContentUpdate} contentEditable={true}>{props.marker.content}</p>
            <div data>
                {props.marker.data_keys.map((data_key, i) => {
                    return (
                    <DataRow 
                        index={i}
                        key={props.marker._id + data_key}
                        data_key={data_key}
                        handleDataKeyChange={handleDataKeyChange}
                        handleDataValueChange={handleDataValueChange}
                        handleDeleteRow={handleDeleteRow}
                        data_value={props.marker.data_values[i]}
                    />
                    // <div key={props.marker._id + data_key}>
                    //     <span>{data_key}: </span><span contentEditable={true} index={i} onBlur={handleDataValueChange}>{props.marker.data_values[i]}</span><button>X</button>
                    // </div>
                    )
                })}
                <input type="text" placeholder={"Enter new field name"} value={newDataKey} onChange={event => setNewDataKey(event.target.value)} />
                <button onClick={handleAddField}>Add field</button>
            </div>
            <input type="color" value={color} onChange={handleColorUpdate} />
            <select value={shape} onChange={handleShapeUpdate}>
                <option value="circle">circle</option>
                <option value="square">square</option>
                <option value="rhombus">rhombus</option>
                <option value="triangle">triangle</option>
            </select>
            {isDeletePressed ? 
            <>
                <button onClick={handleDelete}>Confirm</button>
                <button onClick={() => setIsDeletePressed(false)}>Cancel</button>
            </>
            :
            <button onClick={() => setIsDeletePressed(true)}>Delete</button>}
        </ListItem>
    )
}