import React, { useState } from 'react';

export default function DataRow(props) {

    const [key, setKey] = useState(props.data_key);
    const [value, setValue] = useState(props.data_value)

    return (
        <div>
            <span style={{ display: "inline-block", width: "40%" }} contentEditable={true} onBlur={event => props.handleDataKeyChange(event, props.index)}>{key}</span><span>: </span>
            <input style={{ width: "40%" }} value={value} onChange={event => setValue(event.target.value)} onBlur={event => props.handleDataValueChange(event, props.index)} />
            <button style={{ width: "10%", padding: 1 }} onClick={() => props.handleDeleteRow(props.index)}>X</button>
        </div>
    )
}