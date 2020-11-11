import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, CheckCircle, HelpCircle } from 'react-feather'

class UpdateACName extends Component {
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
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
      result1: "",
      result2: "",
      assetClass: undefined,
      ipfs1: "",
      txHash: "",
      txStatus: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      to: "",
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
      help: false,
      newACName: "",
      hasLoadedAssetClasses: false
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

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const _setAC = (_e) => {
      const e = JSON.parse(_e);
      console.log("In setAC", e);
      return this.setState({ acArr: e, assetClass: e.id, assetClassSelected: true, custodyType: e.custodyType, ACName: e.name, root: e.root });
    }

    const updateName = async () => {
      var alreadyExists = await window.utils.checkACName(this.state.newACName)

      if (alreadyExists) {
        return (alert("AC name already exists! Choose a different name and try again"))
      }
      else {
        this.setState({transaction: true})
        await window.contracts.AC_MGR.methods
          .updateACname(
            this.state.newACName,
            this.state.assetClass
          )
          .send({ from: window.addr })
          .on("error", function (_error) {
            // self.setState({ NRerror: _error });
            self.setState({ transaction: false })
            self.setState({ txHash: Object.values(_error)[0].transactionHash });
            self.setState({ txStatus: false, });
            alert("Something went wrong!")
            clearForm();
            console.log(Object.values(_error)[0].transactionHash);
          })
          .on("receipt", (receipt) => {
            self.setState({ transaction: false })
            self.setState({ txHash: receipt.transactionHash });
            self.setState({ txStatus: receipt.status });
          });
        return clearForm();
      };
    }


    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Update AC Name</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm'>
          {window.addr === undefined && (
            <div className="results">
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
              <Form.Row>
                <Form.Group as={Col} controlId="formGridContractName">
                  <Form.Label className="formFont">New AC Name :</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control
                      placeholder="AC Name"
                      required
                      onChange={(e) => this.setState({ newACName: e.target.value })}
                      size="lg"
                    />
                  )}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder={this.state.newACName}
                      disabled
                      size="lg"
                    />
                  )}
                </Form.Group>
              </Form.Row>
              {this.state.transaction === false && (
                <>
                  <Form.Row>
                    <div className="submitButton">
                      <div className="submitButtonContent">
                        <CheckCircle
                          onClick={() => { updateName() }}
                        />
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
                      Update AC Name is a function that changes the name of your asset class. This will change what is displayed within all assets
                      registered within your asset class. There cannot be two asset classes with the same name.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Form>
        {
          this.state.transaction === false && !this.state.assetClassSelected && (
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
        {this.state.transaction === true && (
          <div className="results">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>)}
        {this.state.transaction === false && (
          <div>
            {this.state.txHash > 0 && ( //conditional rendering
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
            )}
          </div>
        )}
      </div>
    );
  }
}

export default UpdateACName;
