import React, { useState } from 'react';
import API from '../utils/API';
import styled from 'styled-components';

const ListItem = styled.li`
    width: 100%;
    border: 1px solid black;
    margin: 10px;
    padding: 5px;
`

export default function Marker(props) {

    const [isDeletePressed, setIsDeletePressed] = useState(false)
    const [color, setColor] = useState(props.marker.color)

    const handleContentUpdate = event => {
        API.updateMarker({ ...props.marker, content: event.target.textContent })
        .then(res => console.log(res.data))
    }

    const handleColorUpdate = event => {
        setColor(event.target.value)
        API.updateMarker({ ...props.marker, color: event.target.value })
        .then(res => {
            console.log(res.data)
            props.setUpdate(Math.random())
        })
    }

    const handleDelete = event => {
        API.deleteMarker(props.marker._id)
        .then(res => {
            console.log(res);
            props.setUpdate(Math.random())
        })
    }

    const handleOnMouseEnter = event => {
        props.setSelectedMarker(props.marker._id)
    }

    const handleOnMouseLeave = event => {
        props.setSelectedMarker("")
    }

    return (
        <ListItem onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <p onBlur={handleContentUpdate} contentEditable={true}>{props.marker.content}</p>
            <input type="color" value={color} onChange={handleColorUpdate} />
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