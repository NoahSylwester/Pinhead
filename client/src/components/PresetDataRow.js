import React, { useState, useEffect } from 'react';

export default function PresetDataRow(props) {

    const {
        handleDeletePresetRow,
        handleUpdatePresetRowKey,
        handleUpdatePresetRowValue
    } = props.pass;

    const [key, setKey] = useState(props.data_key);
    const [value, setValue] = useState(props.data_value)

    useEffect(() => {
        handleUpdatePresetRowKey(key, props.index);
    }, [key])

    useEffect(() => {
        handleUpdatePresetRowValue(value, props.index);
    }, [value])

    return (
        <div style={{ marginLeft: 10 }}>
            <input style={{width: "40%"}} type="text" value={key} onChange={event => setKey(event.target.value)} />
            <input style={{width: "40%"}} type="text" value={value} onChange={event => setValue(event.target.value)} />
            <button style={{width: "5%", padding: "0"}} onClick={() => handleDeletePresetRow(props.index)}>X</button>
        </div>
    )
}