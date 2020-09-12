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

    const handleMarkerUpdate = event => {
        API.updateMarker({ ...props.marker, content: event.target.textContent })
        .then(res => console.log(res.data))
    }

    const handleDelete = event => {
        API.deleteMarker(props.marker._id)
        .then(res => {
            console.log(res);
            props.setUpdate(Math.random())
        })
    }

    return (
        <ListItem>
            <p onBlur={handleMarkerUpdate} contentEditable={true}>{props.marker.content}</p>
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