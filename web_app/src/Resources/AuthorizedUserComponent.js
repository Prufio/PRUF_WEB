import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class AuthorizedUserComponent extends Component {
    render() {
        return (
            <Nav className="headerForm">
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/new-record">New</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/verify-rights-holder">Verify</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/retrieve-record">Search</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/transfer-asset">Transfer</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/import-asset">Import</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/export-asset">Export</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>

                        <NavLink to="/manage-escrow">Escrow</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavDropdown title="Modify">
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/modify-record-status">Modify Status</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/decrement-counter">Decrement Counter</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/modify-asset-information">Modify Asset Info</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/add-note">Add Note</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/force-transfer-asset">Modify Rightsholder</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </div>
            </Nav>
        )
    }
}

export default AuthorizedUserComponent;