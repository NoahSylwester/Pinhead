import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import API from '../utils/API';
import { withResizeDetector } from 'react-resize-detector';

const Container = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid black;
`

function Canvas(props) {

    console.log(props)

    // const isFirstRender = useRef(true)
    const [theImageRatio, setTheImageRatio] = useState(0)

    useEffect(() => {
        let canvas = document.querySelector("canvas");
        let canvasContainer = document.querySelector("#canvas-container");
        let imageRatio;
        let c = canvas.getContext("2d");
        // if (isFirstRender.current) {
            canvas.width = canvasContainer.offsetWidth
            canvas.height = canvasContainer.offsetHeight
        //     isFirstRender.current = false;
        // }

        c.clearRect(0, 0, canvas.width, canvas.height)
        var image = new Image();
        image.src = props.imagePath
        image.onload = function() {
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
            c.fillStyle = "black";
            c.strokeStyle = "red";
            for (let i = 0; i < props.project.markers.length; i++) {
                console.log(props.project.markers[i])
                let x;
                let y;
                x = props.project.markers[i].x * imageRatio * (!isWidthier ? canvas.width * imageRatio : canvas.width);
                y = props.project.markers[i].y * imageRatio * (isWidthier ? canvas.width / imageRatio : canvas.height);
                c.beginPath();
                c.arc(x, y, 3, 0, 2 * Math.PI);
                c.fill();
                if (props.project.markers[i]._id === props.selectedMarker) {
                    c.beginPath();
                    c.arc(x, y, 10, 0, 2 * Math.PI);
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
        let x = event.nativeEvent.offsetX / (!isWidthier ? canvas.width * theImageRatio : canvas.width) / theImageRatio;
        let y =  event.nativeEvent.offsetY / (isWidthier ? canvas.width / theImageRatio : canvas.height) / theImageRatio;
        API.createMarker(props.project._id, x, y)
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