import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "../index.css";
import { Twitter, GitHub, Mail, Send } from 'react-feather';


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
          {window._contracts === undefined && window.addr !== undefined && (<div className="textMobile"> <Form.Row><h1 className="loadingMobile">Connecting to the Blockchain</h1></Form.Row></div>)}
          {window._contracts === undefined && window.addr === undefined && (<div className="textMobile"> <Form.Row><h1 className="loadingMobile">Connecting to the Blockchain</h1></Form.Row></div>)}
          <div className="mediaLinkMobile">
            <a className="mediaLinkContent"><GitHub size={20} onClick={() => { window.open("https://github.com/Prufio", "_blank") }} /></a>
            <a className="mediaLinkContent"><Mail size={20} onClick={() => { window.open("mailto:support@pruf.io", "_blank") }} /></a>
            <a className="mediaLinkContent"><Twitter size={20} onClick={() => { window.open("https://www.twitter.com/prufteam", "_blank") }} /></a>
            <a className="mediaLinkContent" ><Send size={20} onClick={() => { window.open("https://t.me/pruftalk", "_blank") }} /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeMobile;
