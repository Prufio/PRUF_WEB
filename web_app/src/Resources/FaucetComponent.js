import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class FaucetComponent extends Component {
    render() {
        return (
            <Nav className="headerForm">
                <div className="headerFormContent">
                    <li>
                        <NavLink exact to="faucet">Faucet</NavLink>
                    </li>
                </div>
            </Nav>
        )
    }
}

export default FaucetComponent; 