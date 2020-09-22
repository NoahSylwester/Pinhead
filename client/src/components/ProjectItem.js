import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Item = styled(Link)`
    padding: 3px;
    margin: 5px;
    border: 1px solid lightgrey;
    width: 200px;
    text-decoration: none;
    color: black;
    :hover {
        border: 1px solid gray;
    }
`

const Column = styled.div`
    display: inline-block;
    width: 50%;
    text-align: center;
    ${props => props.markerCount ? 
    `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif; font-size: 0.8rem;` : ``}
`

export default function ProjectItem(props) {

    // {
    //     title: "",
    //     author: "",
    //     image: "",
    //     date_created: "",
    //     markers: [],
    // }

    return (
        <Item to={`/project/${props.project._id}`}>
            <Column>{props.project.title}</Column>
            {console.log(props.project)}
            <Column markerCount>markers: {props.project.markers.length}</Column>
        </Item>
    )
}