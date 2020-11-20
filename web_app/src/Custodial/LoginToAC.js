import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "../index.css";
import Col from "react-bootstrap/Col";
import { ArrowRightCircle} from 'react-feather'
class LoginToAC extends Component {
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
      watchDog: false,
      assetClass: undefined,
      contractArray: [],
    };
  }

  componentDidMount() {
    if (window.addr !== undefined) {
      this.setState({ addr: window.addr})
    }

  }

  componentWillUnmount() {
      this.setState({ watchDog: false })
  }

  componentDidUpdate() {

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {

    const setCustodialAC = async () => {
      let acDoesExist;

      if (this.state.assetClass === "0" || this.state.assetClass === undefined) { window.assetClass = undefined; return this.forceUpdate() }
      else {
        if (
          this.state.assetClass.charAt(0) === "0" ||
          this.state.assetClass.charAt(0) === "1" ||
          this.state.assetClass.charAt(0) === "2" ||
          this.state.assetClass.charAt(0) === "3" ||
          this.state.assetClass.charAt(0) === "4" ||
          this.state.assetClass.charAt(0) === "5" ||
          this.state.assetClass.charAt(0) === "6" ||
          this.state.assetClass.charAt(0) === "7" ||
          this.state.assetClass.charAt(0) === "8" ||
          this.state.assetClass.charAt(0) === "9"
        ) {
          acDoesExist = await window.utils.checkForAC("id", this.state.assetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.location.href = 'https://www.pruf.io'
          }
          window.useACforCustodial = this.state.assetClass;
          window.assetClass = this.state.assetClass;
          await window.utils.resolveACFromID(window.assetClass)
          await window.utils.getACData("id", window.assetClass)

          console.log(window.authLevel);
          return this.setState({ authLevel: window.authLevel });
        }

        else {
          acDoesExist = await window.utils.checkForAC("name", this.state.assetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.location.href = 'https://www.pruf.io';
          }

          window.assetClassName = this.state.assetClass
          window.useACforCustodial = await window.utils.resolveAC(this.state.assetClass);

          if(window.isAuthUser === true){
            window.location.href = "/#/"; 
          }

          return this.setState({ authLevel: window.authLevel });
        }
      }
    }

    return (
      <div>
        <div className="homeFormTestNet">
          <button
            className="imageButtonTestNet"
            title="Check out our website!"
            onClick={() => { window.open("https://pruf.io", "_blank") }}
          >
            <img
              className="prufARCroppedForm"
              src={require("../Resources/Images/Pruf AR (2).png")}
              alt="Pruf Logo" />
          </button>
         {window.contracts !== undefined && window.addr !== undefined && (
            <div>
              <Form.Group as={Col} controlId="formGridAC">
                <Form.Label className="formFont">Input desired asset class # or name : </Form.Label>
                <Form.Control
                  placeholder="Asset Class"
                  required
                  type="text"
                  onChange={(e) => this.setState({ assetClass: e.target.value })}
                  size="lg"
                />
              </Form.Group>
              <Form.Row>
                <div className="submitButtonHome">
                  <div className="submitButtonContent">
                    <ArrowRightCircle
                      onClick={() => { setCustodialAC() }}
                    />
                  </div>
                </div>
              </Form.Row>
            </div>
          )} 
          {window._contracts === undefined && (
            <div className="text">
              <br></br>
              <br></br>

              <Form.Row>
                <div className="homeErrorTextTestNet">
                  <h1 className="loading">
                    Connecting to the Blockchain
                 </h1>
                </div>
              </Form.Row>
            </div>
          )}
          {/* {window._contracts === undefined && window.addr === undefined && (
            <div className="text">
              <Form.Row>
                <h1 className="loading">
                  Connecting to the Blockchain
                 </h1>
              </Form.Row>
            </div>
          )} */}
          {window._contracts !== undefined && window.addr === undefined && (
            <div className="text">
              <Form.Row>
                <h1 className="homeErrorTextTestNet" >
                  Unable to Get User Address
                </h1>
              </Form.Row>
              <Form.Row>
                <h2 className="home2ndRowTestNet">
                  Please
                  <a onClick={() => {
                    alert("That doesn't direct you anywhere. Login to Web3 provider! If you do not have a Web3 provider, we recommend Metamask.io ");
                    this.setState({ settingsMenu: undefined })
                    window.ethereum.enable()
                  }} className="home2ndRowLink">
                    Log In
                  </a>
                  to Web3 Provider.
                </h2>
              </Form.Row>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default LoginToAC;
