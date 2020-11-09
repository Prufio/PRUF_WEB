import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, ArrowRightCircle, CornerUpLeft, CheckCircle } from "react-feather";
import QrReader from 'react-qr-reader'

class VerifyLiteMobile extends Component {
  constructor(props) {
    super(props);


    this.accessAsset = async () => {
      let idxHash;
      if (this.state.QRreader === false && this.state.Checkbox === false) {
        if (this.state.manufacturer === ""
          || this.state.type === ""
          || this.state.model === ""
          || this.state.serial === "") {
        }
        idxHash = window.web3.utils.soliditySha3(
          String(this.state.type),
          String(this.state.manufacturer),
          String(this.state.model),
          String(this.state.serial),
        );
        console.log("IDXTEST1", idxHash)
      }

      else if (this.state.QRreader === true && this.state.Checkbox === false) {
        idxHash = this.state.result
        console.log("IDXTEST2", idxHash)
      }

      else if (this.state.Checkbox === true) {
        idxHash = this.state.idxHash
        console.log("IDXTEST3", idxHash)
      }
      console.log("IDXTEST4", idxHash)
      let doesExist = await window.utils.checkAssetExists(idxHash);

      if (!doesExist) {
        return alert("Asset doesnt exist! Ensure data fields are correct before submission."),
        this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, VLresult: "" })
      }

      console.log("idxHash", idxHash);
      // console.log("rgtHash", rgtHash);

      return this.setState({
        idxHash: idxHash,
        QRreader: false,
        accessPermitted: true
      })

    }

    //State declaration.....................................................................................................

    this.state = {
      addr: "",
      error: undefined,
      error1: undefined,
      VLresult: "",
      result: "",
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
      Checkbox: false,
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

  }

  componentDidUpdate() {//stuff to do when state updates

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }


  handleScan = async (data) => {
    if (data) {
      let tempBool = await window.utils.checkAssetExists(data)
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

  handleError = err => {
    console.error(err)
  }


  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const QRReader = async () => {
      if (this.state.QRreader === false) {
        await this.setState({ QRreader: true, Checkbox: false, assetFound: "" })
        console.log("TEST", this.state.QRreader)
      }
      else {
        await this.setState({ QRreader: false,  VLresult: "" })
        console.log("TEST2", this.state.QRreader)
      }
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
      this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, assetFound: "" })
    }

    const _verify = async () => {
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ VLresult: "" })
      var idxHash = this.state.idxHash;
      console.log(idxHash)
      let rgtRaw = window.web3.utils.soliditySha3(
        String(this.state.first),
        String(this.state.middle),
        String(this.state.surname),
        String(this.state.id),
        String(this.state.secret)
      );
      console.log(rgtRaw)

      let rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtRaw));

      console.log("idxHash", idxHash);
      console.log("rgtHash", rgtHash);
      console.log("addr: ", window.addr);

      var doesExist = await window.utils.checkAssetExists(idxHash);
      var infoMatches = await window.utils.checkMatch(idxHash, rgtHash);

      if (!doesExist) {
        return alert("Asset doesnt exist! Ensure data fields are correct before submission."),
        this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, assetFound: "" })
      }

      if (!infoMatches) {
        await this.setState({ VLresult: "0" })
      }

      if (infoMatches) { await this.setState({ VLresult: "170" }); }

      return this.setState({ accessPermitted: false, Checkbox: false });
    };

    return (
      <div>
        {this.state.QRreader === false && (
          <div>
            <div className="mediaLinkADHome">
              <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeaderMobile">Verify Lite</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
            </div>
          </div>
        )}
        <Form className="formMobile" id='MainForm'>
          <div>

            {this.state.QRreader === false && !this.state.accessPermitted && (
              <div>
                <Form.Check
                  type="checkbox"
                  className="checkBoxMobile"
                  id="inlineFormCheck"
                  onChange={() => { Checkbox() }}
                />
                <Form.Label className="checkBoxFormFontMobile">Input Raw Idx Hash</Form.Label>
                {this.state.Checkbox === true && (
                  <Form.Row>
                    <Form.Label className="formFont">Idx Hash:</Form.Label>
                    <Form.Control
                      placeholder="Idx Hash"
                      onChange={(e) => this.setState({ idxHash: e.target.value })}
                      size="lg"
                      required
                    />
                  </Form.Row>
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
                      onChange={(e) => this.setState({ type: e.target.value })}
                      size="lg"
                      required
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridManufacturer">
                    <Form.Label className="formFont">Manufacturer:</Form.Label>
                    <Form.Control
                      placeholder="Manufacturer"
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
                      onChange={(e) => this.setState({ model: e.target.value })}
                      size="lg"
                      required
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridSerial">
                    <Form.Label className="formFont">Serial:</Form.Label>
                    <Form.Control
                      placeholder="Serial"
                      onChange={(e) => this.setState({ serial: e.target.value })}
                      size="lg"
                      required
                    />
                  </Form.Group>
                </Form.Row>
              </>
            )}
            {this.state.QRreader === false && !this.state.accessPermitted && (
              <>
                <Form.Row>
                  <div className="submitButtonRRMobile">
                    <div className="submitButtonRRContent">
                      <ArrowRightCircle
                        onClick={() => { this.accessAsset() }}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => { QRReader() }}
                      className="buttonQRScanMobile"
                    >
                      <img
                        className="scanImageFormQR"
                        title="Scan QR Code"
                        src={require("../Resources/QRSCANPIC.png")}
                        alt="Pruf Print" />
                    </button>
                  </div>
                </Form.Row>
              </>
            )}

            {this.state.QRreader === true && (
              <div>
                <style type="text/css">
                  {`
                .formMobile {
                  background: none !important;
                  padding: 0rem !important;
                }
                   `}
                </style>
                <div>
                  <div className="mediaLinkADHome">
                    <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/' }} /></a>
                  </div>
                  <h2 className="formHeaderMobileVL">Scan QR</h2>
                  <div className="mediaLinkBackMobile">
                    <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { QRReader() }} /></a>
                  </div>
                </div>
                <div className="QRreaderMobile">
                  <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                  />
                  {this.state.result !== undefined && (
                    <div className="resultsMobile">
                      {this.state.assetFound}
                    </div>
                  )}
                </div>
              </div>
            )}

            {this.state.accessPermitted && (
              <>
                <Form.Row>
                  <Form.Label className="formFont">First Name:</Form.Label>
                  <Form.Control
                    placeholder="First Name"
                    required
                    onChange={(e) => this.setState({ first: e.target.value })}
                    size="lg"
                  />
                </Form.Row>
                <Form.Row>
                  <Form.Label className="formFont">Middle Name:</Form.Label>
                  <Form.Control
                    placeholder="Middle Name"
                    required
                    onChange={(e) => this.setState({ middle: e.target.value })}
                    size="lg"
                  />
                </Form.Row>
                <Form.Row>
                  <Form.Label className="formFont">Last Name:</Form.Label>
                  <Form.Control
                    placeholder="Last Name"
                    required
                    onChange={(e) => this.setState({ surname: e.target.value })}
                    size="lg"
                  />
                </Form.Row>

                <Form.Row>
                  <Form.Label className="formFont">ID Number:</Form.Label>
                  <Form.Control
                    placeholder="ID Number"
                    required
                    onChange={(e) => this.setState({ id: e.target.value })}
                    size="lg"
                  />
                </Form.Row>
                <Form.Row>
                  <Form.Label className="formFont">Password:</Form.Label>
                  <Form.Control
                    placeholder="Password"
                    type="password"
                    required
                    onChange={(e) => this.setState({ secret: e.target.value })}
                    size="lg"
                  />
                </Form.Row>
                <Form.Row>
                  <div className="submitButtonRRMobile">
                    <div className="submitButtonRRContent">
                      <ArrowRightCircle
                        onClick={() => { _verify() }}
                      />
                    </div>
                  </div>
                </Form.Row>
              </>
            )}
          </div>
        </Form>
        {this.state.QRreader === false && (
          <div className="resultsMobile">

            {this.state.VLresult !== "" && ( //conditional rendering
              <Form.Row>
                {
                  this.state.VLresult === "170"
                    ? "Match Confirmed"
                    : "No Match Found"
                }
              </Form.Row>
            )}

          </div>
        )}
      </div>
    );
  }
}
export default VerifyLiteMobile;
