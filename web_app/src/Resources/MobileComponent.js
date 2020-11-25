import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import "../index.css";
import {
    isMobile
} from "react-device-detect";

class MobileComponent extends Component {
    render() {

        if (isMobile) {
            return (
                <Nav className="headerForm">
                    <div className="headerFormContent">
                        <li>
                            <NavLink exact to="/">Home</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContent">
                        <li>
                            <NavLink to="/retrieve-record-mobile">Search</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContent">
                        <li>
                            <NavLink to="/verify-lite-mobile">Verify Lite</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContent">
                        <li>
                            <NavLink to="/transfer-mobile">Transfer Asset</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContent">
                        <li>
                            <NavLink to="/deep-verify-mobile">Deep Verify</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContent">
                        <li>
                            <NavLink to="/modify-rights-holder-mobile">Modify Rights Holder</NavLink>
                        </li>
                    </div>
                </Nav>
            )
        }
    }
}

export default MobileComponent; 