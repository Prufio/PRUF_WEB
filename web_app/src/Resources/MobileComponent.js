import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import "../index.css";

class MobileComponent extends Component {
    render() {

            return (
                <Nav className="headerForm">
                    {/* <div className="headerFormContent">
                        <li>
                            <NavLink exact to="/">Home</NavLink>
                        </li>
                    </div> */}
                       <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/asset-dashboard-mobile">Asset Dashboard</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/retrieve-record-mobile">Search</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/verify-lite-mobile">Verify Lite</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/transfer-mobile">Transfer Asset</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/deep-verify-mobile">Deep Verify</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/modify-rights-holder-mobile">Modify Rights Holder</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/modify-status-mobile">Modify Status</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/recycle-mobile">Recycle</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/discard-mobile">Discard</NavLink>
                        </li>
                    </div>
                    <div className="headerFormContentMobile">
                        <li>
                            <NavLink to="/modify-description-mobile">Modify Asset Info</NavLink>
                        </li>
                    </div>
                </Nav>
            )
    }
}

export default MobileComponent; 