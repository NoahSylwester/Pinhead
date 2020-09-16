import React from 'react'
import styled, { keyframes } from 'styled-components'

const loadingAnimation = (spinRadius) => keyframes`
    from {
        transform: rotate(0deg) translateX(${spinRadius}px) rotate(0deg);
    }
    to {
        transform: rotate(360deg) translateX(${spinRadius}px) rotate(-360deg);
    }
`
const loadingPulseAnimation = () => keyframes`
    0% {
        r: 20;
        opacity: 1;
        stroke-width: 10;
    }
    100% {
        fill: white;
        stroke-width: 10;
        r: 70;
        opacity: 0;
    }
`


const LoadingSVGWrapper = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.small ? "100%" : "100vw"};
    height: ${props => props.small ? "100%" : "100vh"};
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.small ? "none" : `rgba(0,0,0,0.1)`};
`

const LoadingCircle = styled.circle`
    animation: ${props => props.animationDuration} ${props => loadingAnimation(props.spinRadius)} linear infinite;
    fill: ${props => props.fill};
`

const LoadingPulse = styled.circle`
    animation: ${props => props.animationDuration} ${loadingPulseAnimation} ease-out infinite;
    fill: ${props => props.fill};
`

export default function SVGLoadingIcon(props) {

    return (
        <LoadingSVGWrapper small={props.small}>
                <LoadingCircle
                    cx="50%"
                    cy="50%"
                    r="15"
                    fill={props.small ? "black" :"white"}
                    animationDuration={`${props.duration || 0.7}s`}
                    spinRadius="50"
                ></LoadingCircle>
                <LoadingCircle
                    cx="50%"
                    cy="50%"
                    r="15"
                    fill={"lightgrey"}
                    animationDuration={`${props.duration || 0.7}s`}
                    spinRadius="-50"
                ></LoadingCircle>
        </LoadingSVGWrapper>
    )
}