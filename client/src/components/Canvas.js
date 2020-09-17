import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { useWindowSize } from '@react-hook/window-size'
import SVGLoadingIcon from './SVGLoadingIcon';
import logo from "../pinhead.png"

const Container = styled.div`
    width: 100%;
    height: 95vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

function Canvas(props) {
    const [width, height] = useWindowSize()
    const [theImageRatio, setTheImageRatio] = useState(0)
    const [mouseX, setMouseX] = useState(-100)
    const [mouseY, setMouseY] = useState(-100)

    useEffect(() => {
        let canvas = document.querySelector("canvas");
        let imageRatio;
        // load image
        var image = new Image();
        image.src = props.imagePath;
        // console.log(image, imageState)
        image.onload = () => {
            imageRatio = image.width / image.height
            setTheImageRatio(imageRatio)
            renderCanvas()
        };
      }, []);

    useEffect(() => {
        renderCanvas()
    },[mouseX, mouseY, props.project, props.selectedMarker, width, height, props.manuallySelectedMarkers, props.displayedMarkers])

    const renderCanvas = () => {
        if (theImageRatio) {
            let canvas = document.querySelector("canvas");
            let canvasContainer = document.querySelector("#canvas-container");
            let imageState = document.querySelector("#img-ref");
            // fill container with canvas
            canvas.width = canvasContainer.offsetWidth
            canvas.height = canvasContainer.offsetHeight
            // erase previous canvas
            let c = canvas.getContext("2d");
            c.clearRect(0, 0, canvas.width, canvas.height)
            // logic to fit image into container
            let isWidthier = false;
            if (theImageRatio >= 1) {
                isWidthier = true
            }
            if (isWidthier) {
                c.drawImage(imageState, 0, 0, canvas.width, (canvas.width/imageState.width) * imageState.height);
            }
            else {
                c.drawImage(imageState, 0, 0, (canvas.height/imageState.height) * imageState.width, canvas.height);
            }
            c.strokeStyle = props.selectorColor;
            c.lineWidth = 2;
            c.font = "15px Arial";
            // render marker dots
            let hoverMatchFound = false;
            for (let i = 0; i < props.project.markers.length; i++) {
                // choose color
                c.fillStyle = props.project.markers[i].color;
                // determine center coordinates
                let x;
                let y;
                x = props.project.markers[i].x * theImageRatio * (!isWidthier ? canvas.height / theImageRatio : canvas.width);
                y = props.project.markers[i].y * theImageRatio * (isWidthier ? canvas.width / theImageRatio : canvas.height);
                // determine and draw shape
                switch (props.project.markers[i].shape) {
                    case "circle":
                        c.beginPath();
                        c.arc(x, y, 3, 0, 2 * Math.PI);
                        c.fill();
                        break;
                    case "square":
                        c.fillRect(x - 3, y - 3, 6, 6);
                        break;
                    case "triangle":
                        c.beginPath();
                        c.moveTo(x, y - 3);
                        c.lineTo(x - Math.sqrt(13), y + 3);
                        c.lineTo(x + Math.sqrt(13), y + 3);
                        c.lineTo(x, y - 3);
                        c.fill();
                        break;
                    case "rhombus":
                        c.beginPath();
                        c.moveTo(x, y - 4);
                        c.lineTo(x - 4, y);
                        c.lineTo(x, y + 4);
                        c.lineTo(x + 4, y);
                        c.lineTo(x, y - 4);
                        c.fill();
                        break;
                    default:
                        c.beginPath();
                        c.arc(x, y, 3, 0, 2 * Math.PI);
                        c.fill();
                        break;
                }
                // render highlight circle if applicable
                if (props.project.markers[i]._id === props.selectedMarker || props.manuallySelectedMarkers.includes(props.project.markers[i]._id)) {
                    c.beginPath();
                    c.arc(x, y, 12, 0, 2 * Math.PI);
                    c.stroke();
                }
                if (props.displayedMarkers.includes(props.project.markers[i]._id)) {
                    c.fillText(props.project.markers[i].data_values[props.project.markers[i].data_keys.indexOf(props.displayedColumn)], x + 10, y - 10)
                }
                if (mouseX <= x + 10 && mouseX >= x - 10 && mouseY <= y + 10 && mouseY >= y - 10) {
                    hoverMatchFound = true;
                    c.beginPath();
                    c.arc(x, y, 12, 0, 2 * Math.PI);
                    c.stroke();
                    props.setMouseHoveredMarkerId(props.project.markers[i]._id)
                }
                else if (!hoverMatchFound) {
                    props.setMouseHoveredMarkerId("")
                }
            }
                        
        }
    }

    const handleMouseDown = event => {
        let canvas = document.querySelector("canvas");
        let isWidthier;
        if (theImageRatio >= 1) {
            isWidthier = true
        }
        let x = event.nativeEvent.offsetX / (!isWidthier ? canvas.height / theImageRatio : canvas.width) / theImageRatio;
        let y =  event.nativeEvent.offsetY / (isWidthier ? canvas.width / theImageRatio : canvas.height) / theImageRatio;
        API.createMarker(props.project._id, x, y, props.presetDataKeys, props.presetDataValues)
        .then(marker => {
            props.setUpdate(Math.random())
        })
    }

    const handleMouseMove = event => {
        // let canvas = document.querySelector("canvas");
        setMouseX(event.nativeEvent.offsetX)
        setMouseY(event.nativeEvent.offsetY)
    }

    return (
        <div style={{ position: 'relative'}}>
            <img id="img-ref" style={{display: "none"}} src={props.imagePath} />
            <Container id={"canvas-container"}>
                {theImageRatio ?
                <canvas onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}></canvas>
                :
                    props.isImageUploaded
                    ?
                    <SVGLoadingIcon small />
                    :
                    <>
                        <img src={logo} style={{ width: 100, height: 65, objectFit: "contain"}} alt="logo" />
                        <p style={{marginBottom: 100}}>Try uploading an image!</p>
                    </>
                }
            </Container>
        </div>
    )
}

export default Canvas;