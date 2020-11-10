import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, CheckCircle, HelpCircle } from "react-feather";


class AddUser extends Component {
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
    }, 100)

    this.state = {
      addr: "",
      authAddr: "",
      userType: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
      resultIA: "",
      assetClass: undefined,
      CountDownStart: "",
      ipfs1: "",
      txHash: "",
      txStatus: false,
      isNFA: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      transaction: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      hasLoadedAssets: false,
      assetClass: "",
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
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
      this.setState({ assetClass: undefined, assetClassSelected: false, help: false, transaction: false })
    }

    const _setAC = async (e) => {
      return this.setState({ assetClass: e, assetClassSelected: true });
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const addUser = () => {
      if (Number(this.state.userType) < 1) { return alert("Please select a user type from the dropdown") }
      window.contracts.AC_MGR.methods
        .OO_addUser(
          this.state.authAddr,
          this.state.userType,
          this.state.assetClass
        )
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({ error: _error });
          self.setState({ result: _error.transactionHash });
          return clearForm();
        })
        .on("receipt", (receipt) => {
          console.log(
            "user added succesfully under asset class",
            self.state.assetClass
          );
          console.log("tx receipt: ", receipt);
          return clearForm();
        });
      this.setState({ transaction: true })
      console.log(this.state.txHash);
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Authorize User</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm'>
          {window.addr === undefined && (
            <div className="errorResults">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
            </div>
          )}
          {window.addr > 0 && !this.state.assetClassSelected && (
            <>
              <Form.Row>
                <Form.Label className="formFontRow">Asset Class:</Form.Label>
                <Form.Group as={Row} controlId="formGridAC">
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
                </Form.Group>
              </Form.Row>
            </>
          )}
          {window.addr > 0 && this.state.assetClassSelected && (
            <div>
              <>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridAsset">
                    <Form.Label className="formFont">
                      User Address :
                 </Form.Label>
                    {this.state.transaction === false && (
                      <Form.Control
                        placeholder="Authorized Address"
                        required
                        onChange={(e) => this.setState({ authAddr: e.target.value })}
                        size="lg"
                      />
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        placeholder={this.state.authAddr}
                        disabled
                        size="lg"
                      />
                    )}
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridACClass">
                    <Form.Label className="formFont">User Type :</Form.Label>
                    {this.state.transaction === false && (
                      <Form.Control
                        as="select"
                        size="lg"
                        onChange={(e) => this.setState({ userType: e.target.value })}
                        required
                      >
                        <optgroup className="optgroup">
                          <option value="0000"> Select a User Type </option>
                          <option value="1"> Custodian </option>
                          <option value="2"> NFM Custodian </option>
                          <option value="9"> Automated Custodian </option>
                        </optgroup>

                      </Form.Control>
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        as="select"
                        size="lg"
                        disabled
                      >
                        <optgroup className="optgroup">
                          <option> {this.state.userType} </option>
                        </optgroup>

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
                              onClick={() => { addUser() }}
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
                    {this.state.help === true && this.state.userType === "" && (
                      <div className="explainerTextBox2">
                        Authorize User gives authority within a specific asset class to a given user.
                        Depending on the user type selected, the user will have different permissions. Please select a user type to learn 
                        more about each individual user type.
                      </div>
                    )}
                    {this.state.help === true && this.state.userType === "0000" && (
                      <div className="explainerTextBox2">
                        Authorize User gives authority to a given user to modify and register assets within a custodial type asset class.
                        Depending on the user type selected, the user will have different permissions. Please select a user type to learn 
                        more about each individual type.
                      </div>
                    )}
                    {this.state.help === true && this.state.userType === "1" && (
                      <div className="explainerTextBox2">
                        Authorizing a user as a Custodian gives authority to modify and register assets within a custodial type asset class.
                      </div>
                    )}
                    {this.state.help === true && this.state.userType === "2" && (
                      <div className="explainerTextBox2">
                        Authorizing a user as an NFM Custodian gives authority to modify and register assets within a custodial type asset class.
                        NFM Coustodians are NOT allowed to force-modify asset rightsholder information.
                      </div>
                    )}
                    {this.state.help === true && this.state.userType === "9" && (
                      <div className="explainerTextBox2">
                        Authorizing a user as an Automated Custodian gives authority to modify assets within a custodial type asset class.
                        Autmoated Custodians are NOT allowed to register assets or to force-modify asset rightsholder information.
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          )}
        </Form>
        {
          this.state.transaction === false && this.state.txHash === "" && !this.state.assetClassSelected && (
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
                    KOVAN Etherscan:{this.state.txHash}
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
                    KOVAN Etherscan:{this.state.txHash}
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

export default AddUser;
