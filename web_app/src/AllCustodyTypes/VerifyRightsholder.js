import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, ArrowRightCircle, CheckCircle, HelpCircle, Camera, UploadCloud, CameraOff } from "react-feather";
import QrReader from 'react-qr-reader'

class VerifyRightHolder extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.accessAsset = async () => {
      this.setState({ help: false })
      let idxHash;
      if (this.state.QRreader === false && !this.state.Checkbox) {
        if (this.state.manufacturer === ""
          || this.state.type === ""
          || this.state.model === ""
          || this.state.serial === "") {
          return alert("Please fill out all fields before submission")
        }
        idxHash = window.web3.utils.soliditySha3(
          String(this.state.type).replace(/\s/g, ''),
          String(this.state.manufacturer).replace(/\s/g, ''),
          String(this.state.model).replace(/\s/g, ''),
          String(this.state.serial).replace(/\s/g, '')
        );
      }

      else if (this.state.QRreader === true && !this.state.Checkbox) {
        idxHash = this.state.result
      }

      else if (this.state.Checkbox === true) {
        idxHash = this.state.idxHashRaw
      }

      let doesExist = await window.utils.checkAssetExistsBare(idxHash);

      if (!doesExist) {
        return alert("Asset doesnt exist! Ensure data fields are correct before submission.")
      }

      console.log("idxHash", idxHash);
      // console.log("rgtHash", rgtHash);

      return this.setState({
        idxHash: idxHash,
        QRreader: false,
        accessPermitted: true
      })

    }

    this.state = {
      addr: "",
      error: undefined,
      error1: undefined,
      result: "",
      DVresult: "",
      assetClass: undefined,
      ipfs1: "",
      txHash: "",
      txStatus: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      first: "",
      middle: "",
      surname: "",
      id: "",
      secret: "",
      QRreader: false,
      isNFA: false,
      transaction: false,
      Checkbox: false,
      help: false,
      legacyMode: false,
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    this.setState({ QRReader: false });
  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    this.setState({ QRReader: false });
    this.setState({ runWatchDog: false });
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  


  handleScan = async (data) => {
    if (data) {
      let tempBool = await window.utils.checkAssetExistsBare(data)
      if (tempBool === true) {
        this.setState({
          result: data,
          QRRR: true,
          assetFound: "Asset Found!"
        })
        console.log(data)
        this.accessAsset()
      }
      else {
        this.setState({
          assetFound: "Asset Not Found",
        })
      }
    }
  }
  handleError = (err) => {
    console.error(err)
    this.setState({ legacyMode: true })
  }
  openImageDialog() {
    this.refs.qrReader1.openImageDialog()
  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;


    const QRReader = async () => {
      if (this.state.QRreader === false) {
        this.setState({ QRreader: true, assetFound: "" })
      }
      else {
        this.setState({ QRreader: false })
      }
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const previewStyle = {
      height: 240,
      width: 320,
    }


    const Checkbox = async () => {
      if (this.state.Checkbox === false) {
        this.setState({ Checkbox: true })
      }
      else {
        this.setState({ Checkbox: false })
      }
    }


    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({ DVresult: "", accessPermitted: false, transaction: false, txHash: "", Checkbox: false, wasSentPacket: false, help: false })
    }

    const _verify = async () => {
      this.setState({ help: false })
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ DVresult: "" })
      this.setState({ transaction: true })
      var idxHash = this.state.idxHash;


      let rgtRaw = window.web3.utils.soliditySha3(
        String(this.state.first).replace(/\s/g, ''),
        String(this.state.middle).replace(/\s/g, ''),
        String(this.state.surname).replace(/\s/g, ''),
        String(this.state.id).replace(/\s/g, ''),
        String(this.state.secret).replace(/\s/g, '')
      );
      let rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtRaw));


      // var rgtHash = this.state.rgtHash;

      console.log("idxHash", idxHash);
      console.log("rgtHash", rgtHash);
      console.log("addr: ", window.addr);

      await window.contracts.STOR.methods
        .blockchainVerifyRightsHolder(idxHash, rgtHash)
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          alert("Something went wrong!")
          clearForm();
          console.log(Object.values(_error)[0].transactionHash);
          window.isInTx = false;
        })
        .on("receipt", (receipt) => {
          this.setState({ txHash: receipt.transactionHash });
          this.setState({ transaction: false })
          console.log(receipt.events.REPORT.returnValues._msg);
          this.setState({ DVresult: receipt.events.REPORT.returnValues._msg })
        });

      console.log(this.state.DVresult);

      await this.setState({
        idxHash: "",
        rgtHash: "",
        accessPermitted: false,
        Checkbox: false,
      })

      document.getElementById("MainForm").reset();

    };
    return (
      <div>
        {this.state.QRreader === false && (
          <div>
            <div className="mediaLinkADHome">
              <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeader">Deep Verify</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
            </div>
          </div>
        )}
        <Form className="form" id='MainForm'>
          {window.addr === undefined && (
            <div className="results">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
            </div>
          )}
          {window.addr > 0 && (
            <div>

              {this.state.QRreader === false && !this.state.accessPermitted && (
                <div>
                  <Form.Check
                    type="checkbox"
                    className="checkBox"
                    id="inlineFormCheck"
                    onChange={() => { Checkbox() }}
                  />
                  <Form.Label className="checkBoxFormFont">Input Raw Idx Hash</Form.Label>
                  {this.state.Checkbox === true && (
                    <Form.Group>
                      <Form.Label className="formFont">Idx Hash:</Form.Label>
                      <Form.Control
                        placeholder="Idx Hash"
                        required
                        onChange={(e) => this.setState({ idxHashRaw: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>
                  )}
                </div>
              )}

              {!this.state.accessPermitted && this.state.QRreader === false && this.state.Checkbox === false && (
                <>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridType">
                      <Form.Label className="formFont">Type:</Form.Label>
                      <Form.Control
                        placeholder="Type"
                        required
                        onChange={(e) => this.setState({ type: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridManufacturer">
                      <Form.Label className="formFont">Manufacturer:</Form.Label>
                      <Form.Control
                        placeholder="Manufacturer"
                        required
                        onChange={(e) => this.setState({ manufacturer: e.target.value.trim() })}
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
                        onChange={(e) => this.setState({ model: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridSerial">
                      <Form.Label className="formFont">Serial:</Form.Label>
                      <Form.Control
                        placeholder="Serial"
                        required
                        onChange={(e) => this.setState({ serial: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>
                  </Form.Row>
                </>
              )}
              {this.state.transaction === false && this.state.QRreader === false && !this.state.accessPermitted && (
                <>
                  <Form.Row>
                    <div className="submitButton">
                      <div className="submitButtonContent">
                        <ArrowRightCircle
                          onClick={() => { this.accessAsset() }}
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
                    <div className="mediaLinkCamera">
                      <div className="mediaLinkHelpContent">
                        <Camera
                          onClick={() => { QRReader() }}
                        />
                      </div>
                    </div>
                  </Form.Row>
                  {this.state.help === true && (
                    <div className="explainerTextBox">
                      Deep Verify is a function that confirms provenance of an item. As it initiates a blockchain transaction, Deep Verify is secure
                      despite your browser connection being securily protected. For a less verifyable, but free provenance check, use Verify Lite
                    </div>
                  )}
                </>
              )}

              {this.state.QRreader === true && (
                <div>
                  <style type="text/css">
                    {`
                .form {
                  background: none !important;
                }
                   `}
                  </style>
                  <div>
                    <div className="mediaLinkADHome">
                      <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                    </div>
                    <h2 className="formHeaderQR2">Scan QR</h2>
                    <div className="mediaLinkBack">
                      <a className="mediaLinkContentBack" ><CameraOff onClick={() => { QRReader() }} /></a>
                    </div>
                  </div>
                  <div className="QRreader">
                  <QrReader
                ref="qrReader1"
                delay={300}
                previewStyle={previewStyle}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '50rem', height: '50rem' }}
                legacyMode={this.state.legacyMode}
              />
              {this.state.legacyMode === true && (
                <div className="uploadImageQR">
                  <div className="uploadImageQRContent">
                    <UploadCloud size={60} onClick={() => { this.openImageDialog() }} />
                  </div>
                </div>
              )}
                    {this.state.result !== undefined && (
                      <div className="resultsQR">
                        {this.state.assetFound}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {this.state.accessPermitted && (
                <>
                  {this.state.transaction === true && this.state.type !== "" && (
                    <>
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
                  {this.state.type === "" && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridModel">
                        <Form.Label className="formFont">Idx Hash:</Form.Label>
                        <Form.Control
                          placeholder={this.state.idxHash}
                          required
                          disabled
                          size="lg"
                        />
                      </Form.Group>
                    </Form.Row>
                  )}
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstName">
                      <Form.Label className="formFont">First Name:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="First Name"
                          required
                          onChange={(e) => this.setState({ first: e.target.value.trim() })}
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

                    <Form.Group as={Col} controlId="formGridLastName">
                      <Form.Label className="formFont">Last Name:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="Last Name"
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
                    <Form.Group as={Col} controlId="formGridIdNumber">
                      <Form.Label className="formFont">ID Number:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="ID Number"
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

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label className="formFont">Password:</Form.Label>
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
                      <div className="mediaLinkHelp">
                        <div className="mediaLinkHelpContent">
                          <HelpCircle
                            onClick={() => { help() }}
                          />
                        </div>
                      </div>
                      <Form.Row>
                        <div className="submitButtonVRH2">
                          <div className="submitButtonVRH2Content">
                            <CheckCircle
                              onClick={() => { _verify() }}
                            />
                          </div>
                        </div>
                      </Form.Row>
                      {this.state.help === true && (
                        <div className="explainerTextBox2">
                          Deep Verify is a function that confirms provenance of an item. As it initiates a blockchain transaction, Deep Verify is secure
                          despite your browser connection being securily protected. For a less verifyable but free provenance check, use Verify Lite
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
          </div>
        )}
        {this.state.QRreader === false && this.state.transaction === false && (
          <div className="results">
            {this.state.txHash > 0 && ( //conditional rendering
              <Form.Row>
                <div className="transactionErrorText">
                  {this.state.DVresult === "Match confirmed"
                    ? "Match Confirmed :"
                    : "No Match Found :"}
                </div>
                <a
                  className="transactionErrorText"
                  href={" https://kovan.etherscan.io/tx/" + this.state.txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TX Hash:{this.state.txHash}
                </a>
              </Form.Row>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default VerifyRightHolder;
