import React, { Component } from "react";
import { NavLink, } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class BasicComponent extends Component {
    render() {
        return (
        <Nav className="headerForm">
        {/* <li>
                    <NavLink exact to="/">Home</NavLink>
                </li> */}
                <li>
                    <NavLink className="navBox" to="/asset-dashboard">Asset Dashboard</NavLink>
                </li>
                <li>
                    <NavLink className="navBox" to="/verify-lite">Verify Lite</NavLink>
                </li>
                <li>
                    <NavLink className="navBox" to="/verify-rights-holder">Deep Verify</NavLink>
                </li>
                <li>
                    <NavLink className="navBox" to="/retrieve-record">Search</NavLink>
                </li>
                </Nav>
        )
    }
}

export default BasicComponent;