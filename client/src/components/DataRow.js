import React, { useState, useEffect } from 'react';

export default function DataRow(props) {

    const [key, setKey] = useState(props.data_key);
    const [value, setValue] = useState(props.data_value)

    useEffect(() => {
        setValue(props.data_value)
    }, [props.data_value])

    return (
        <div style={{ padding: 5, backgroundColor: "whitesmoke" }}>
            <span style={{ display: "inline-block", width: "35%" }} contentEditable={true} onBlur={event => props.handleDataKeyChange(event, props.index)}>{key}</span><span>: </span>
            <input style={{ width: "40%" }} value={value} onChange={event => setValue(event.target.value)} onBlur={() => props.handleDataValueChange(value, props.index)} />
            <button style={{ width: "10%", padding: 1 }} onClick={() => props.handleDeleteRow(props.index)}>X</button>
        </div>
    )
}