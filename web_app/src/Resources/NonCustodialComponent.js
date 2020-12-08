import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class NonCustodialAdminComponent extends Component {
    render() {
        return (
            <Nav className="headerForm">
                <div className="headerFormContent">
                    <li>
                        <NavLink exact to="asset-dashboard">Asset Dashboard</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink exact to="new-record-NC">New</NavLink>
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
                        <NavLink to="/transfer-asset-NC">Transfer</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavLink to="/manage-escrow-NC">Escrow</NavLink>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavDropdown title="Import">
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/import-asset-NC">Import Asset</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/recycle-asset-NC">Recycle Asset</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavDropdown title="Export">
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/export-asset-NC">Export Asset</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/discard-asset-NC">Discard Asset</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </div>
                <div className="headerFormContent">
                    <li>
                        <NavDropdown title="Modify">
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/modify-record-status-NC">Modify Status</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/decrement-counter-NC">Decrement Counter</NavDropdown.Item>
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/modify-asset-information-NC">Modify Asset Info</NavDropdown.Item>
                            {/* <NavDropdown.Item id="header-dropdown" as={NavLink} to="/add-note-NC">Add Note</NavDropdown.Item> */}
                            <NavDropdown.Item id="header-dropdown" as={NavLink} to="/force-modify-record-NC">Modify Rightsholder</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </div>
            </Nav>
        )
    }
}

export default NonCustodialAdminComponent; 