import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ArrowRightCircle, Home, XSquare, CheckCircle, HelpCircle } from 'react-feather'

class NewRecord extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.state = {
      addr: "",
      lookupIPFS1: "",
      lookupIPFS2: "",
      error: undefined,
      NRerror: undefined,
      result: null,
      assetClass: undefined,
      countDownStart: "",
      ipfs1: "",
      txHash: "",
      assetName: "",
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      first: "",
      middle: "",
      surname: "",
      id: "",
      secret: "",
      txStatus: null,
      nameTag: "",
      rawIPFSHash: "",
      idxSubmitted: false,
      transaction: false,
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    this.setState({assetClass: window.useACforCustodial})
  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

  }
  componentDidUpdate() {//stuff to do on a re-render

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset()
      this.setState({
        txStatus: null,
        help: false,
        assetClassSelected: false,
        idxSubmitted: false,
      })
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const checkAsset = async () => {
      this.setState({ help: false })
      let ipfsObj = { photo: {}, text: {}, name: "" }

      if (this.state.nameTag !== "" && this.state.nameTag !== undefined) {
        ipfsObj = { photo: {}, text: {}, name: String(this.state.nameTag) }
      }

      let idxHash = window.web3.utils.soliditySha3(
        String(this.state.type),
        String(this.state.manufacturer),
        String(this.state.model),
        String(this.state.serial),
      );

      let doesExist = await window.utils.checkAssetExists(idxHash);

      if (!doesExist) {
        this.setState({ idxHash: idxHash, idxSubmitted: true });
        await window.utils.addIPFSJSONObject(ipfsObj)
      }

      else { return alert("Record already exists! Try again. (Note: nameTag can contain whatever you want, and cannot cause hash collisions)") }

    }

    const _newRecord = async () => {//create a new asset record
      this.setState({
        help: false,
        txStatus: false,
        txHash: "",
        error: undefined,
        result: "",
        transaction: true
      })


      //reset state values before form resubmission
      var idxHash = this.state.idxHash;
      //var ipfsHash = window.utils.getBytes32FromIPFSHash(String(window.rawIPFSHashTemp));
      var rgtRaw;

      rgtRaw = window.web3.utils.soliditySha3(
        this.state.first,
        this.state.middle,
        this.state.surname,
        this.state.id,
        this.state.secret
      );

      console.log(idxHash.length)

      if (idxHash.length !== 66) {
        return (alert("Something went wrong..."))
      }

      var rgtHash = window.web3.utils.soliditySha3(idxHash, rgtRaw);
      //rgtHash = tenThousandHashesOf(rgtHash)

      console.log("idxHash", idxHash);
      console.log("New rgtRaw", rgtRaw);
      console.log("New rgtHash", rgtHash);
      console.log("addr: ", window.addr);
      console.log("AC: ", this.state.assetClass);

      await window.contracts.APP.methods
        .$newRecord(
          idxHash,
          rgtHash,
          this.state.assetClass,
          "100000",
        )
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          alert("Something went wrong!")
          clearForm();
          self.setState({ assetClassSelected: false, idxSubmitted: false })

        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          this.setState({ txHash: receipt.transactionHash });
          this.setState({ txStatus: receipt.status });
          window.resetInfo = true;
          window.recount = true;
          if (self.state.wasSentPacket) {
            return window.location.href = '/#/asset-dashboard'
          }
        });

      this.setState({ idxSubmitted: false }) //clear form inputs
    }

    return (//default render
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">New Record</h2>
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

          {window.addr > 0 && (
            <div>

              {!this.state.idxSubmitted && (
                <>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridType">
                      <Form.Label className="formFont">Type:</Form.Label>
                      <Form.Control
                        placeholder="Type"
                        required
                        onChange={(e) => this.setState({ type: e.target.value })}
                        size="lg"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridManufacturer">
                      <Form.Label className="formFont">Manufacturer:</Form.Label>

                      <Form.Control
                        placeholder="Manufacturer"
                        required
                        onChange={(e) => this.setState({ manufacturer: e.target.value })}
                        size="lg"
                      />
                    </Form.Group>

                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridModel">
                      <Form.Label className="formFont">Model:</Form.Label>
                      <Form.Control
                        placeholder="Model"
                        required
                        onChange={(e) => this.setState({ model: e.target.value })}
                        size="lg"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridSerial">
                      <Form.Label className="formFont">Serial:</Form.Label>
                      <Form.Control
                        placeholder="Serial"
                        required
                        onChange={(e) => this.setState({ serial: e.target.value })}
                        size="lg"
                      />
                    </Form.Group>
                  </Form.Row>
                  <>
                    <Form.Row>
                      <div className="submitButton">
                        <div className="submitButtonContent">
                          <ArrowRightCircle
                            onClick={() => { checkAsset() }}
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
                        New Record creates a unique hash based on the given asset data. The "Name Tag" given within this version
                        of the web application may be visible to third parties if unencrypted. This data field should not include sensitive or personally
                        identifying data unless it is the intention of the user to make this data public.
                      </div>
                    )}
                  </>
                </>
              )}
              {this.state.idxSubmitted && (
                <>
                  {this.state.transaction === true && (
                    <>
                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridNewAssetName">
                          <Form.Label className="formFont">Name Tag:</Form.Label>
                          <Form.Control
                            placeholder={this.state.nameTag}
                            disabled
                            size="lg"
                          />
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridType">
                          <Form.Label className="formFont">Type:</Form.Label>
                          <Form.Control
                            placeholder={this.state.type}
                            required
                            disabled
                            size="lg"
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridManufacturer">
                          <Form.Label className="formFont">Manufacturer:</Form.Label>

                          <Form.Control
                            placeholder={this.state.manufacturer}
                            required
                            disabled
                            size="lg"
                          />
                        </Form.Group>

                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridModel">
                          <Form.Label className="formFont">Model:</Form.Label>
                          <Form.Control
                            placeholder={this.state.model}
                            required
                            disabled
                            size="lg"
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridSerial">
                          <Form.Label className="formFont">Serial:</Form.Label>
                          <Form.Control
                            placeholder={this.state.serial}
                            required
                            disabled
                            size="lg"
                          />
                        </Form.Group>
                      </Form.Row>
                    </>
                  )}
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstName">
                      <Form.Label className="formFont">First Name:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="First Name"
                          required
                          onChange={(e) => this.setState({ first: e.target.value })}
                          size="lg"
                        />)}
                      {this.state.transaction === true && (
                        <Form.Control
                          placeholder={this.state.first}
                          required
                          disabled
                          size="lg"
                        />)}
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridMiddleName">
                      <Form.Label className="formFont">Middle Name:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="Middle Name"
                          required
                          onChange={(e) => this.setState({ middle: e.target.value })}
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

                    <Form.Group as={Col} controlId="formGridLastName">
                      <Form.Label className="formFont">Last Name:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="Last Name"
                          required
                          onChange={(e) => this.setState({ surname: e.target.value })}
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
                    <Form.Group as={Col} controlId="formGridIdNumber">
                      <Form.Label className="formFont">ID Number:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="ID Number"
                          required
                          onChange={(e) => this.setState({ id: e.target.value })}
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

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label className="formFont">Password:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="Password"
                          type="password"
                          required
                          onChange={(e) => this.setState({ secret: e.target.value })}
                          size="lg"
                        />)}
                      {this.state.transaction === true && (
                        <Form.Control
                          placeholder="Password"
                          type="password"
                          required
                          disabled
                          size="lg"
                        />)}
                    </Form.Group>

                  </Form.Row>
                  {/* <Form.Row>              //Countdown Form
                    <Form.Group as={Col} controlId="formGridLogStartValue">
                      <Form.Label className="formFont">Log Start Value:</Form.Label>
                      <Form.Control
                        placeholder="Log Start Value"
                        required
                        onChange={(e) =>
                          this.setState({ countDownStart: e.target.value })
                        }
                        size="lg"
                      />
                    </Form.Group>

                  </Form.Row> */}
                  {this.state.transaction === false && (
                    <>
                      <Form.Row>
                        <div>
                          <Form.Label className="costText"> Cost in AC {this.state.assetClass}: {window.web3.utils.fromWei(String(window.costs.newRecordCost))} PRüF</Form.Label>
                          <div className="submitButtonNR">
                            <div className="submitButtonNRContent">
                              <CheckCircle
                                onClick={() => { _newRecord() }}
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
                          Pruf never stores your personal data. The information you provide here will be irreversibly hashed into a unique pattern that does not
                          contain the data that you provide, encrypted or otherwise. Creating a record will mint you a unique asset token which is tied to the asset
                          data the user provided.
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </Form>
        {this.state.transaction === true && (
          <div className="results">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>)}
        {this.state.transaction === false && (
          <div className="results">
            {
              this.state.transaction === false && this.state.txHash === "" && this.state.assetClassSelected && (
                <div className="assetSelectedContentHead">New Record Being Made in Asset Class: <span className="assetSelectedContent">{this.state.assetClass}</span> </div>
              )
            }
            {this.state.txHash > 0 && ( //conditional rendering
              <div>
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
    )
  }
}

export default NewRecord;
