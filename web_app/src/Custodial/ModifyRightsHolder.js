import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { Home, CheckCircle, XSquare, AlertTriangle } from 'react-feather'
import { ClickAwayListener } from '@material-ui/core';

class ModifyRightsHolder extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.mounted = false;
    this.state = {
      addr: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
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
      first: "",
      middle: "",
      surname: "",
      id: "",
      secret: "",
      newFirst: "",
      newMiddle: "",
      newSurname: "",
      newId: "",
      newSecret: "",
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {
      if (Number(window.sentPacket.statusNum) === 3 || Number(window.sentPacket.statusNum) === 4 || Number(window.sentPacket.statusNum) === 53 || Number(window.sentPacket.statusNum) === 54) {
        alert("Cannot edit asset in lost or stolen status" );
        window.sentPacket = undefined;
        return window.location.href = "/#/retrieve-record"
      }

      if (Number(window.sentPacket.statusNum) === 6) {
        alert("Cannot edit asset in escrow! Please wait until asset has met escrow conditions");
        window.sentPacket = undefined;
        return window.location.href = "/#/retrieve-record"
      }
      this.setState({ 
        name: window.sentPacket.name,
        assetClassName: window.sentPacket.assetClassName 
      })
      this.setState({ idxHash: window.sentPacket.idxHash })
      this.setState({ assetClass: window.sentPacket.assetClass })
      this.setState({ status: window.sentPacket.status })

      window.sentPacket = undefined
      this.setState({ wasSentPacket: true })
    }

    this.setState({ runWatchDog: true })
  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    clearInterval(this.updateAssets);
    this.setState({ runWatchDog: false });
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: false, txHash: "", wasSentPacket: false, help: false })
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

    const accessAsset = async () => {
      const self = this;

      let idxHash = this.state.idxHash;

      let rgtRaw = window.web3.utils.soliditySha3(
        this.state.first,
        this.state.middle,
        this.state.surname,
        this.state.id,
        this.state.secret
      );

      var rgtHash = window.web3.utils.soliditySha3(idxHash, rgtRaw);

      var infoMatches = await window.utils.checkMatch(idxHash, rgtHash);

      if (!infoMatches) {
        return this.setState({alertBanner: "Supplied info does not match record credentials. Please Check forms and try again."})
      }

      return this.setState({ 
        rgtHash: rgtHash,
        accessPermitted: true,
        successBanner: "Credentials successfully matched to record"
       })

    }

    const _editRgtHash = async () => {
      var idxHash = this.state.idxHash;
      var newRgtRaw;
      if (idxHash === undefined || idxHash === "null" || idxHash === "") { return this.setState({ alertBanner: "Please select an asset from the dropdown" }) }
      this.setState({ help: false })
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true })



      newRgtRaw = window.web3.utils.soliditySha3(
        String(this.state.first).replace(/\s/g, ''),
        String(this.state.middle).replace(/\s/g, ''),
        String(this.state.surname).replace(/\s/g, ''),
        String(this.state.id).replace(/\s/g, ''),
        String(this.state.secret).replace(/\s/g, '')
      );

      var newRgtHash = window.web3.utils.soliditySha3(idxHash, newRgtRaw);

      console.log("idxHash", idxHash);
      console.log("New rgtHash", newRgtHash);
      console.log("addr: ", window.addr);

      await window.contracts.NP_NC.methods
        ._changeRgt(idxHash, newRgtHash)
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          self.setState({ alertBanner: "Something went wrong!" })
          clearForm();
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          this.setState({ txHash: receipt.transactionHash });
          this.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          //Stuff to do when tx confirms
        });

      console.log(this.state.txHash);
      return this.setState({ idxHash: undefined, wasSentPacket: false });
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Modify Rightsholder</h2>
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
          {window.addr > 0 && (
            <div>
              {!this.state.accessPermitted &&(
                <>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridFirstName">
                  <Form.Label className="formFont">First Name:</Form.Label>
                  <Form.Control
                    placeholder="First Name"
                    required
                    onChange={(e) => this.setState({ first: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMiddleName">
                  <Form.Label className="formFont">Middle Name:</Form.Label>
                  <Form.Control
                    placeholder="Middle Name"
                    required
                    onChange={(e) => this.setState({ middle: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridLastName">
                  <Form.Label className="formFont">Last Name:</Form.Label>
                  <Form.Control
                    placeholder="Last Name"
                    required
                    onChange={(e) => this.setState({ surname: e.target.value })}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridIdNumber">
                  <Form.Label className="formFont">ID Number:</Form.Label>
                  <Form.Control
                    placeholder="ID Number"
                    required
                    onChange={(e) => this.setState({ id: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label className="formFont">Password:</Form.Label>
                  <Form.Control
                    placeholder="Password"
                    type="password"
                    required
                    onChange={(e) => this.setState({ secret: e.target.value })}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>
                <Form.Row>
                <div className="submitButton">
                      <div className="submitButtonContent">
                        <CheckCircle
                          onClick={() => { accessAsset() }}
                        />
                      </div>
                    </div>
                </Form.Row>
                </>
              )}
              <Form.Row>
                <Form.Group as={Col} controlId="formGridNewFirstName">
                  <Form.Label className="formFont">New First Name:</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control
                      placeholder="New First Name"
                      required
                      onChange={(e) => this.setState({ first: e.target.value.trim() })}
                      size="lg"
                    />)}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder={this.state.first}
                      required
                      size="lg"
                    />)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridNewMiddleName">
                  <Form.Label className="formFont">New Middle Name:</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control
                      placeholder="New Middle Name"
                      required
                      onChange={(e) => this.setState({ middle: e.target.value.trim() })}
                      size="lg"
                    />)}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder={this.state.middle}
                      required
                      disabled
                      size="lg"
                    />)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridNewLastName">
                  <Form.Label className="formFont">New Last Name:</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control
                      placeholder="New Last Name"
                      required
                      onChange={(e) => this.setState({ surname: e.target.value.trim() })}
                      size="lg"
                    />)}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder={this.state.surname}
                      required
                      disabled
                      size="lg"
                    />)}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridNewIdNumber">
                  <Form.Label className="formFont">New ID Number:</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control
                      placeholder="New ID Number"
                      required
                      onChange={(e) => this.setState({ id: e.target.value.trim() })}
                      size="lg"
                    />)}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder={this.state.id}
                      required
                      disabled
                      size="lg"
                    />)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridNewPassword">
                  <Form.Label className="formFont">New Password:</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control
                      placeholder="Password"
                      className="key"
                      type="text"
                      required
                      onChange={(e) => this.setState({ secret: e.target.value.trim() })}
                      size="lg"
                      autoComplete="off"
                    />)}
                  {this.state.transaction === true && (
                    <Form.Control
                      placeholder="Password"
                      className="key"
                      type="text"
                      disabled
                      onChange={(e) => this.setState({ secret: e.target.value.trim() })}
                      size="lg"
                      autoComplete="off"
                    />)}
                </Form.Group>
              </Form.Row>
              {this.state.transaction === false && (
                <>
                  <Form.Row>
                    <div className="submitButton">
                      <div className="submitButtonContent">
                        <CheckCircle
                          onClick={() => { _editRgtHash() }}
                        />
                      </div>
                    </div>
                    <div className="mediaLinkHelp">
                      <div className="mediaLinkHelpContent2">
                        <AlertTriangle
                          onClick={() => { help() }}
                        />
                      </div>
                    </div>
                  </Form.Row>
                  {this.state.help === true && (
                    <div className="explainerTextBox2">
                      Modify Rightsholder allows the owner of an asset token to modify the ownership of an item. This does not transfer the asset
                      token. Pruf never stores your personal data. The information you provide here will be irreversibly hashed into a unique pattern
                      that does not contain the data that you provide.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Form>
        {this.state.transaction === false && this.state.txStatus === false && (
          <div className="assetSelectedResults">
            {this.state.alertBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                <Alert className="alertBanner" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                  {this.state.alertBanner}
                </Alert>
              </ClickAwayListener>
            )}
            {this.state.successBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ successBanner: undefined }) }}>
                <Alert className="alertBanner" key={1} variant="success" onClose={() => this.setState({ successBanner: undefined })} dismissible>
                  {this.state.successBanner}
                </Alert>
              </ClickAwayListener>
            )}
            <Form.Row>
              {this.state.idxHash !== undefined && this.state.txHash === false && (
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContent">{this.state.idxHash}</span> </div>
                  <div className="assetSelectedContentHead">Asset Name: <span className="assetSelectedContent">{this.state.name}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContent">{this.state.assetClassName}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContent">{this.state.status}</span> </div>
                </Form.Group>
              )}
            </Form.Row>
          </div>
        )}
        {this.state.transaction === true && (
          <div className="results">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>)}
          {this.state.txHash > 0 && ( //conditional rendering
          <div className="results">

            {this.state.txStatus === false && (
              <Alert
              className="alertFooter"
              variant = "success">
                Transaction failed!
                  <Alert.Link
                  className="alertLink"
                  href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CLICK HERE
                </Alert.Link>
                to view transaction on etherscan.
              </Alert>
              )}

              {this.state.txStatus === true && (
                <Alert
                className="alertFooter"
                variant = "success">
                  Transaction success!
                    <Alert.Link
                    className="alertLink"
                    href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CLICK HERE
                  </Alert.Link>
                  to view transaction on etherscan.
                </Alert>
              )}
          </div>
        )}
      </div>
    );
  }
}

export default ModifyRightsHolder;
