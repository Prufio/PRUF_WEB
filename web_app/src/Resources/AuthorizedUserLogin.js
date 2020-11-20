import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class AuthorizedUserLogin extends Component {
    render() {
        return (
            <Nav className="headerForm">
                <div className="headerFormContent">
                    <li>
                        <NavLink exact to="/login">Log In</NavLink>
                    </li>
                </div>
            </Nav>
        )
    }
}

export default AuthorizedUserLogin;