import React, { Component } from "react";
import { NavLink, } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class BasicComponent extends Component {
    render() {
        return (
            <Nav className="headerForm">
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/asset-dashboard">Asset Dashboard</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/ac-dashboard">ACN Dashboard</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/verify-lite">Verify Lite</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/verify-rights-holder">Deep Verify</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/retrieve-record">Search</NavLink>
                    </li>
                </div>
            </Nav>
        )
    }
}

export default BasicComponent;