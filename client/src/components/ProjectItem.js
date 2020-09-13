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
`

const Column = styled.div`
    display: inline-block;
    width: 50%;
    text-align: center;
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
            <Column>markers: {props.project.markers.length}</Column>
        </Item>
    )
}