import React, { useState, useEffect } from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExcelExporter(props) {

    const [processedMarkers, setProcessedMarkers] = useState([])
    const [columnNames, setColumnNames] = useState([])

    useEffect(() => {
        // process markers into usable objects
        let markersAsObjectsArray = props.markers.map(item => {
            let obj = {};
            item.data_keys.forEach((data_key, i) => obj[data_key] = item.data_values[i])
            return obj;
        })
        setProcessedMarkers(markersAsObjectsArray)

        // build list of column names
        let allColumnNames = []
        props.markers.forEach(item => {
            item.data_keys.forEach(key => {
                if (!allColumnNames.includes(key)) {
                    allColumnNames.push(key)
                }
            })
        })
        setColumnNames(allColumnNames)

    }, [props.markers])

    return (
        <ExcelFile filename={props.title} element={<button>Download project markers as Excel spreadsheet</button>}>
            <ExcelSheet data={processedMarkers} name={props.title}>
                {columnNames.map(colName => {
                    return <ExcelColumn label={colName.toUpperCase()} value={colName}/>
                })}
            </ExcelSheet>
        </ExcelFile>
    );
}