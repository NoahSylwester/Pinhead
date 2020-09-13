import React, { useState } from 'react';

export default function DataRow(props) {

    const [key, setKey] = useState(props.data_key);
    const [value, setValue] = useState(props.data_value)

    return (
        <div>
            <span contentEditable={true} onBlur={event => props.handleDataKeyChange(event, props.index)}>{key}</span><span>: </span>
            <input value={value} onChange={event => setValue(event.target.value)} onBlur={event => props.handleDataValueChange(event, props.index)} />
            <button onClick={() => props.handleDeleteRow(props.index)}>X</button>
        </div>
    )
}