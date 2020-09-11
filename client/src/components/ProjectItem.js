import React from 'react';
import { Link } from 'react-router-dom';

export default function Marker(props) {

    // {
    //     title: "",
    //     author: "",
    //     image: "",
    //     date_created: "",
    //     markers: [],
    // }

    return (
        <Link to={`/project/${props.project._id}`}>{props.project.title}</Link>
    )
}