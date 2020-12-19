import React, { Component } from "react";
import { NavLink, } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class AdminComponent extends Component {
    render() {
        return (
            <Nav className="headerForm">
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/ac-dashboard">ACN Dashboard</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/add-user">Authorize User</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/set-costs">Set Costs</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/enable-contract">Authorize Contract</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/transfer-ac">Transfer AC</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavDropdown title="AC Data">
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/update-ac-name">Update AC Name</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/get-ac-data">Retrieve AC Data</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/increase-ac-share">Increase Price Share</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </div>
            </Nav>
        )
    }
}

export default AdminComponent;