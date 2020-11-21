import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "./index.css";
import { Twitter, GitHub, Mail, Send, } from 'react-feather'
import Snake from 'react-simple-snake'

class SnakeGame extends Component {
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
    if (window.addr !== undefined) {
      this.setState({ addr: window.addr })
    }

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
        <div className="homeFormTestNet">
        <Snake percentageWidth='80' snakeColor='blue' appleColor='red' startSnakeSize='4'/>
        </div>
      </div>
    );
  }
}

export default SnakeGame;
