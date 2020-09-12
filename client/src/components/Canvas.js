import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/API';

const Container = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid black;
`

export default function Canvas(props) {

    useEffect(() => {
        let canvas = document.querySelector("canvas");
        let canvasContainer = document.querySelector("#canvas-container");
        let imageRatio;
        let c = canvas.getContext("2d");
        canvas.width = canvasContainer.offsetWidth
        canvas.height = canvasContainer.offsetHeight
        c.clearRect(0, 0, canvas.width, canvas.height)
        var image = new Image();
        image.src = props.imagePath
        image.onload = function() {
            imageRatio = image.width / image.height
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
                c.beginPath();
                c.arc(props.project.markers[i].x, props.project.markers[i].y, 3, 0, 2 * Math.PI);
                c.fill();
                if (props.project.markers[i]._id === props.selectedMarker) {
                    c.beginPath();
                    c.arc(props.project.markers[i].x, props.project.markers[i].y, 10, 0, 2 * Math.PI);
                    c.stroke();
                }
            }
        }
      }, [props.project, props.selectedMarker]);

    const handleMouseDown = event => {
        let x = event.nativeEvent.offsetX;
        let y =  event.nativeEvent.offsetY;
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