import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, CheckCircle, AlertTriangle } from 'react-feather'


class TransferAC extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.updateAssets = setInterval(() => {
      if (this.state.assetClasses !== window.assetClasses && this.state.runWatchDog === true) {
        this.setState({ assetClasses: window.assetClasses })
      }

      if (this.state.hasLoadedAssetClasses !== window.hasLoadedAssetClasses && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssetClasses: window.hasLoadedAssetClasses })
      }
    }, 150)

    this.state = {
      addr: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
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
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    this.setState({runWatchDog: true})
   }

  componentWillUnmount() {//stuff do do when component unmounts from the window

  }

  componentDidUpdate() {//stuff to do when state updates

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = () => {
      document.getElementById("MainForm").reset();
      this.setState({ assetClass: "", assetClassSelected: false, help: false, transaction: false, txHash: "", txStatus: false })
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

    const _setAC = (_e) => {
      const e = JSON.parse(_e);
      console.log("In setAC", e);
      return this.setState({ acArr: e, assetClass: e.id, assetClassSelected: true, custodyType: e.custodyType, ACName: e.name, root: e.root });
    }

    const _transferAssetClass = async () => {
      this.setState({help: false})
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true });
      // var idxHash = this.state.idxHash;
      let to = this.state.to;

      console.log("AC", this.state.assetClass);
      console.log("addr: ", window.addr);

      if(this.state.assetClass < 1 || this.state.to < 1) {return}

      await window.contracts.AC_TKN.methods
        .safeTransferFrom(window.addr, to, this.state.assetClass)
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
          window.resetInfo = true;
            // window.recount = true;
          self.setState({ hasLoadedAssetClasses: false, transaction: false })
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
        });
      console.log(this.state.txHash);
      
      return this.setState({ assetClass: "", assetClassSelected: false, help: false, transaction: false })
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Transfer AC</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm' onSubmit={submitHandler}>
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
                 <Form.Group as={Col} controlId="formGridTo">
                   <Form.Label className="formFont">To:</Form.Label>
                   {this.state.transaction === false && (
                    <Form.Control
                      placeholder="Recipient Address"
                      required
                      onChange={(e) => this.setState({ to: e.target.value.trim() })}
                      size="lg"
                    />
                  )}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder={this.state.to}
                      required
                      onChange={(e) => this.setState({ to: e.target.value.trim() })}
                      size="lg"
                      disabled
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
                          onClick={() => { _transferAssetClass() }}
                        />
                      </div>
                    </div>
                    <div className="mediaLinkHelp">
                      <div className="mediaLinkHelpContent">
                        <AlertTriangle
                          onClick={() => { help() }}
                        />
                      </div>
                    </div>
                  </Form.Row>
                  {this.state.help === true && (
                    <div className="explainerTextBox2">
                      Transfer AC is a function that transfers an asset class token to a chosen address. This will remove all permissions associated
                      with asset class management related to this address. Proceed with caution.
                    </div>
                  )}
                </>
              )}
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
            )}
          </div>
        )}
      </div>
    );
  }
}

export default TransferAC;
