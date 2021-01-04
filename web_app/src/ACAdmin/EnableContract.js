import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { Home, XSquare, CheckCircle, HelpCircle } from "react-feather";
import { ClickAwayListener } from '@material-ui/core';

class enableContract extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................
    this.updateAssets = setInterval(() => {
      if (this.state.assetClasses !== window.assetsClasses && this.state.runWatchDog === true) {
        this.setState({ assetClasses: window.assetClasses })
      }

      if (this.state.hasLoadedAssetClasses !== window.hasLoadedAssetClasses && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssetClasses: window.hasLoadedAssetClasses })
      }
    }, 150)

    this.state = {
      addr: "",
      authAddr: "",
      userType: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
      resultIA: "",
      CountDownStart: "",
      ipfs1: "",
      txHash: "",
      txStatus: false,
      name: "",
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      transaction: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      hasLoadedAssets: false,
      assetClass: "",
      help: false,
      hasLoadedAssetClasses: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {
      this.setState({
        assetClass: window.sentPacket.id,
        assetClassSelected: true
      })
      console.log("Stat", window.sentPacket.status)

      window.sentPacket = undefined
      this.setState({ wasSentPacket: true })
    }

    this.setState({ runWatchDog: true })

  }

  componentDidUpdate() {//stuff to do when state updates

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    //console.log("unmounting component")
  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = () => {
      document.getElementById("MainForm").reset();
      this.setState({
        assetClass: "",
        assetClassSelected: false,
        help: false,
        transaction: false,
        txHash: "",
        txStatus: false,
        wasSentPacket: false
      })
    }

    const _setAC = (_e) => {
      const e = JSON.parse(_e);
      console.log("In setAC", e);
      return this.setState({
        acArr: e,
        assetClass: e.id,
        assetClassSelected: true,
        custodyType: e.custodyType,
        ACName: e.name,
        root: e.root,
        txHash: "",
        txStatus: false
      });
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const submitHandler = (e) => {
      e.preventDefault();
    }

    const _setContract = async (e) => {
      let authTemp, custodyId;

      if (this.state.custodyType === "Custodial") {
        custodyId = 1;
        switch (e) {
          case "APP":
            { authTemp = "1"; break; }
          case "NP":
            { authTemp = "1"; break; }
          case "ECR":
            { authTemp = "3"; break; }
          case "ECR_MGR":
            { authTemp = "3"; break; }
          case "AC_TKN":
            { authTemp = String(custodyId); break; }
          case "A_TKN":
            { if (this.state.root === this.state.assetClass) { authTemp = "1"; break; } else { authTemp = String(custodyId); break; } }
          case "AC_MGR":
            { authTemp = String(custodyId); break; }
          case "RCLR":
            { authTemp = "3"; break; }
          default:
            { this.setState({alertBanner: "Contract not allowed in asset class"}); clearForm(); break; }
        }
      }

      else {
        custodyId = 2;
        switch (e) {
          case "APP_NC":
            { authTemp = "2"; break; }
          case "NP_NC":
            { authTemp = "2"; break; }
          case "ECR_NC":
            { authTemp = "3"; break; }
          case "ECR_MGR":
            { authTemp = "3"; break; }
          case "AC_TKN":
            { authTemp = String(custodyId); break; }
          case "A_TKN":
            { if (this.state.root === this.state.assetClass) { authTemp = "1"; break; } else { authTemp = String(custodyId); break; } }
          case "AC_MGR":
            { authTemp = String(custodyId); break; }
          case "RCLR":
            { authTemp = "3"; break; }
          default:
            { this.setState({alertBanner: "Contract not allowed in asset class"}); clearForm(); break; }
        }
      }


      console.log(e, authTemp);
      return this.setState({ name: e, authLevel: authTemp })
    }

    const enableContract = async () => {
      this.setState({ transaction: true })
      if (this.state.name < 1) { return this.setState({alertBanner: "Please select a contract to enable"}) }
      if (this.state.assetClass === undefined) { return }
      console.log(this.state.name)
      console.log(this.state.assetClass)
      console.log(this.state.authLevel)

      await window.contracts.STOR.methods
        .enableContractForAC(
          this.state.name,
          this.state.assetClass,
          this.state.authLevel
        )
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({
            error: _error,
            transaction: false,
            wasSentPacket: false,
            result: _error.transactionHash
          });
          return clearForm();
        })
        .on("receipt", (receipt) => {
          console.log("contract added under authLevel:", self.state.authLevel);
          console.log("tx receipt: ", receipt);
          self.setState({
            transaction: false,
            wasSentPacket: false,
            txHash: receipt.transactionHash,
            txStatus: receipt.status,
            hasLoadedAssetClasses: false
          })
          window.resetInfo = true;
          console.log("tx receipt: ", receipt);
        });

      console.log(this.state.txHash);

      return self.setState({
        assetClass: "",
        assetClassSelected: false,
        help: false,
        transaction: false
      })
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Authorize Contract</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm' onSubmit={submitHandler}>
          {window.addr === undefined && (
            <div className="errorResults">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
            </div>
          )}
          {window.addr > 0 && !this.state.assetClassSelected && (
            <>
                        {this.state.alertBanner !== undefined && (
              
              <ClickAwayListener onClickAway={() => { this.setState({alertBanner: undefined}) }}>
              <Alert className="alertBanner" key={1} variant="danger" onClose={() => this.setState({alertBanner: undefined})} dismissible>
              {this.state.alertBanner}
            </Alert>
                  </ClickAwayListener>
            )}
              <Form.Row>
                <Form.Label className="formFontRow">Asset Class:</Form.Label>
                <Form.Group as={Row} controlId="formGridAC">
                  {!this.state.wasSentPacket && (
                    <Form.Control
                      as="select"
                      size="lg"
                      onChange={(e) => { _setAC(e.target.value) }}

                    >
                      {this.state.hasLoadedAssetClasses && (
                        <optgroup className="optgroup">
                          {window.utils.generateAssetClasses()}
                        </optgroup>)}
                      {!this.state.hasLoadedAssetClasses && (
                        <optgroup>
                          <option value="null">
                            Loading Held Asset Classes...
                           </option>
                        </optgroup>)}
                    </Form.Control>
                  )}
                </Form.Group>
              </Form.Row>
            </>
          )}
          {window.addr > 0 && this.state.assetClassSelected && (
            <div>
              <>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridAsset">
                    <Form.Label className="formFont">Contract Name :</Form.Label>
                    {this.state.transaction === false && (
                      <Form.Control
                        as="select"
                        size="lg"
                        onChange={(e) => { _setContract(e.target.value) }}

                      >
                        <optgroup className="optgroup">
                          {window.utils.generateOptionsFromObject(window.contracts, "contracts")}
                        </optgroup>
                      </Form.Control>
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        size="lg"
                        placeholder={this.state.name}
                        disabled
                      >
                      </Form.Control>
                    )}
                  </Form.Group>
                </Form.Row>
                {this.state.transaction === false && (
                  <>
                    <Form.Row>
                      <div>
                        <div className="submitButton">
                          <div className="submitButtonContent">
                            <CheckCircle
                              onClick={() => { enableContract() }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mediaLinkHelp">
                        <div className="mediaLinkHelpContent">
                          <HelpCircle
                            onClick={() => { help() }}
                          />
                        </div>
                      </div>
                    </Form.Row>
                    {this.state.help === true && (
                      <div className="explainerTextBox2">
                        Authorize Contract authorizes a given contract to communicate with the selected asset class. Depending on the authorization level provided,
                        the authorized contract will have certain rights to assets within the asset class.
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          )}
        </Form>
        {
          this.state.transaction === false && !this.state.assetClassSelected && this.state.txHash === "" && (
            <div className="assetSelectedResults">
            </div>
          )
        }
        {
          this.state.transaction === false && this.state.txHash === "" && this.state.assetClassSelected && (
            <div className="assetSelectedResults">
              <div className="assetSelectedContentHead">Configuring Asset Class: <span className="assetSelectedContent">{this.state.assetClass}</span> </div>
            </div>
          )
        }
        {
          this.state.transaction === true && (
            <div className="results">
              <h1 className="loadingh1">Transaction In Progress</h1>
            </div>)
        }
        {
          this.state.txHash > 0 && ( //conditional rendering
            <div className="results">
              {this.state.txStatus === false && (
                <div>
                  !ERROR! :
                  <a
                    href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TX Hash:{this.state.txHash}
                  </a>
                </div>
              )}
              {this.state.txStatus === true && (
                <div>
                  {" "}
                No Errors Reported :
                  <a
                    href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TX Hash:{this.state.txHash}
                  </a>
                </div>
              )}
            </div>
          )
        }
      </div >
    );
  }
}

export default enableContract;
