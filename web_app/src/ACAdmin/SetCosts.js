import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { Home, XSquare, CheckCircle, HelpCircle } from "react-feather";
import { ClickAwayListener } from '@material-ui/core';

class SetCosts extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    //Component state declaration

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
      isNFA: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      transaction: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      hasLoadedAssets: false,
      hasLoadedAssetClasses: false,
      assetClass: "",
      serviceIndex: "",
      serviceCost: 0,
      beneficiary: "",
      web3: null,
      help: false
    };
  }

  //component state-change events......................................................................................................


  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {
      this.setState({
        assetClass: window.sentPacket.id,
        assetClassSelected: true,
      })
      console.log("Stat", window.sentPacket.status)

      window.sentPacket = undefined
      this.setState({ wasSentPacket: true })
    }

    this.setState({ runWatchDog: true })

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

  }

  componentDidUpdate() {//stuff to do when state updates

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = () => {
      document.getElementById("MainForm").reset();
      this.setState({
        assetClass: undefined,
        assetClassSelected: false,
        help: false,
        transaction: false,
        txHash: "",
        txStatus: false,
        wasSentPacket: false
      })
    }

    const _setAC = async (_e) => {
      const e = JSON.parse(_e);
      console.log("In setAC", e);
      this.setState({
        acArr: e,
        assetClass: e.id,
        assetClassSelected: true,
        custodyType: e.custodyType,
        ACName: e.name,
        root: e.root,
        txHash: "",
        txStatus: false,
        services: window.utils.getCosts(6, e.id)
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

    const setServiceIndex = (e) => {
      console.log(e)
      this.setState({ serviceIndex: e })
    }

    const setCosts = () => {
      const serviceCost = window.web3.utils.toWei(String(this.state.serviceCost))
      if (serviceCost === undefined || this.state.assetClass === "" || this.state.beneficiary === "") { return this.setState({ alertBanner: "Please fill out all forms before submission." }) }
      this.setState({ transaction: true })
      window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          this.state.assetClass,
          this.state.serviceIndex,
          serviceCost,
          this.state.beneficiary
        )

        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({
            error: _error,
            result: _error.transactionHash,
            transaction: false,
            wasSentPacket: false
          });
          return clearForm();
        })
        .on("receipt", (receipt) => {
          window.resetInfo = true;
          window.recount = true;
          self.setState({
            transaction: false,
            wasSentPacket: false,
            txHash: receipt.transactionHash,
            txStatus: receipt.status,
            hasLoadedAssetClasses: false
          })
          console.log("tx receipt: ", receipt);
        });

      console.log(this.state.txHash);
      return self.setState({
        assetClass: undefined,
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
          <h2 className="formHeader">Set Costs</h2>
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
                  <Form.Group as={Col} controlId="formGridService">
                    <Form.Label className="formFont">Service index # :</Form.Label>
                    {this.state.transaction === false && window.costs !== undefined && (
                      <Form.Control
                        as="select"
                        size="lg"
                        onChange={(e) => { setServiceIndex(e.target.value) }}
                      >
                        <optgroup className="optgroup">
                          {window.utils.generateOptionsFromObject(window.costs, "services")}
                        </optgroup>
                      </Form.Control>
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        size="lg"
                        placeholder={this.state.serviceIndex}
                        disabled
                      >
                      </Form.Control>
                    )}
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridNewCost">
                    <Form.Label className="formFont">New Service Cost :</Form.Label>
                    {this.state.transaction === false && (
                      <Form.Control
                        placeholder="New Service Cost (PRuF)"
                        required
                        onChange={(e) =>
                          this.setState({ serviceCost: e.target.value.trim() })
                        }
                        size="lg"
                      />
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        placeholder={this.state.serviceCost}
                        disabled
                        size="lg"
                      />
                    )}
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridBeneficiary">
                    <Form.Label className="formFont">Beneficiary Address :</Form.Label>
                    {this.state.transaction === false && (
                      <Form.Control
                        placeholder="Beneficiary Address"
                        required
                        onChange={(e) =>
                          this.setState({ beneficiary: e.target.value.trim() })
                        }
                        size="lg"
                      />
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        placeholder={this.state.beneficiary}
                        disabled
                        size="lg"
                      />
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
                              onClick={() => { setCosts() }}
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
                        Set Costs allows asset class owners to modify costs associated with all of the funtions throughout the PRuF ecosystem.
                        The service costs are set in PRuF tokens, the native utility token of the PRuF ecosystem.
                        The set benefitiary address will recieve any shares associated with transactions within the selected asset class.

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
        {this.state.transaction === false && this.state.txHash === "" && this.state.assetClassSelected && (
          <div className="assetSelectedResults">
            {this.state.alertBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                <Alert className="alertBanner" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                  {this.state.alertBanner}
                </Alert>
              </ClickAwayListener>
            )}
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

export default SetCosts;
