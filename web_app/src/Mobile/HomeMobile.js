import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "../index.css";
import { Twitter, Video, Mail, GitHub } from 'react-feather';


class HomeMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addr: undefined,
      web3: null,
      APP: "",
      NP: "",
      STOR: "",
      AC_MGR: "",
      ECR_NC: "",
      ECR_MGR: "",
      AC_TKN: "",
      A_TKN: "",
      APP_NC: "",
      NP_NC: "",
      ECR2: "",
      authLevel: "",
      PIP: "",
      RCLR: "",
      assetClass: undefined,
      contractArray: [],
    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {

    return (
      <div>
        <div className="homeFormMobile">
          <img className="prufARCroppedFormMobile" src={require("../Resources/Pruf AR (2).png")} />
          <br></br>
          <br></br>
          {window._contracts === undefined && window.addr !== undefined && (<div className="textMobile"> <Form.Row><h1 className="loading">Connecting to the Blockchain</h1></Form.Row></div>)}
          {window._contracts === undefined && window.addr === undefined && (<div className="textMobile"> <Form.Row><h1 className="loading">Connecting to the Blockchain</h1></Form.Row></div>)}
          <div className="mediaLinkMobile">
            <a className="mediaLinkContent"><GitHub size={35} onClick={() => { window.open("https://github.com/vdmprojects/Bulletproof", "_blank") }} /></a>
            <a className="mediaLinkContent"><Mail size={35} onClick={() => { window.open("mailto:drake@pruf.io", "_blank") }} /></a>
            <a className="mediaLinkContent"><Twitter size={35} onClick={() => { window.open("https://twitter.com/umlautchair", "_blank") }} /></a>
            <a className="mediaLinkContent" ><Video size={35} onClick={() => { window.open("https://www.youtube.com/channel/UC9HzR9-dAzHtPKOqlVqwOuw", "_blank") }} /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeMobile;
