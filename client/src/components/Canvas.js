import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { withResizeDetector } from 'react-resize-detector';

const Container = styled.div`
    width: 100%;
    height: 100%;
`

function Canvas(props) {

    const [theImageRatio, setTheImageRatio] = useState(0)
    const [imageState, setImageState] = useState("")

    useEffect(() => {
        let canvas = document.querySelector("canvas");
        let canvasContainer = document.querySelector("#canvas-container");
        let imageRatio;
        let c = canvas.getContext("2d");
        // fill container with canvas
        canvas.width = canvasContainer.offsetWidth
        canvas.height = canvasContainer.offsetHeight
        // erase previous canvas
        c.clearRect(0, 0, canvas.width, canvas.height)
        // load image
        var image = new Image();
        image.src = props.imagePath;
        setImageState(image);
        console.log(image, imageState)
        image.onload = function() {
            // logic to fit image into container
            imageRatio = image.width / image.height
            setTheImageRatio(imageRatio)
            let isWidthier = false;
            if (imageRatio >= 1) {
                isWidthier = true
            }
            if (isWidthier) {
                c.drawImage(image, 0, 0, canvas.width, (canvas.width/image.width) * image.height);
            }
            else {
                c.drawImage(image, 0, 0, (canvas.height/image.height) * image.width, canvas.height);
            }
            c.strokeStyle = props.selectorColor;
            c.lineWidth = 2;
            // render marker dots
            for (let i = 0; i < props.project.markers.length; i++) {
                // choose color
                c.fillStyle = props.project.markers[i].color;
                // determine center coordinates
                let x;
                let y;
                x = props.project.markers[i].x * imageRatio * (!isWidthier ? canvas.height / imageRatio : canvas.width);
                y = props.project.markers[i].y * imageRatio * (isWidthier ? canvas.width / imageRatio : canvas.height);
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
                if (props.project.markers[i]._id === props.selectedMarker || props.project.markers[i].isManuallySelected) {
                    c.beginPath();
                    c.arc(x, y, 12, 0, 2 * Math.PI);
                    c.stroke();
                }
            }
        }
      }, [props.project, props.selectedMarker, props.width, props.height]);

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
            console.log("MARKER  ", marker)
            props.setUpdate(Math.random())
            // props.setProject({ ...props.project, markers: [...props.markers, marker] })
        })
    }

    return (
        <Container id={"canvas-container"}>
            <canvas onMouseDown={handleMouseDown}></canvas>
        </Container>
    )
}

export default withResizeDetector(Canvas);