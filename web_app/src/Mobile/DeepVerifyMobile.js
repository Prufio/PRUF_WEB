import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, ArrowRightCircle, CornerUpLeft, CheckCircle, UploadCloud } from "react-feather";
import QrReader from 'react-qr-reader'

class DeepVerifyMobile extends Component {
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
          String(this.state.type).replace(/\s/g, ''),
          String(this.state.manufacturer).replace(/\s/g, ''),
          String(this.state.model).replace(/\s/g, ''),
          String(this.state.serial).replace(/\s/g, '')
        );
      }

      else if (this.state.QRreader === true && this.state.Checkbox === false) {
        idxHash = this.state.result
      }

      else if (this.state.Checkbox === true) {
        idxHash = this.state.idxHashRaw
      }

      let doesExist = await window.utils.checkAssetExistsBare(idxHash);
      let infoArr = Object.values(window.utils.checkAssetExists(idxHash).obj);

      if (!doesExist) {
        return alert("Asset doesnt exist! Ensure data fields are correct before submission."),
          this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, DVresult: "" })
      }

      console.log("idxHash", idxHash);
      // console.log("rgtHash", rgtHash);

      return this.setState({
        idxHash: idxHash,
        assetClass: infoArr[2],
        status: await window.utils.getStatusString(String(infoArr[0])),
        QRreader: false,
        accessPermitted: true
      })

    }

    //State declaration.....................................................................................................

    this.state = {
      addr: "",
      error: undefined,
      error1: undefined,
      DVresult: "",
      result: "",
      assetClass: undefined,
      ipfs1: "",
      txHash: "",
      txStatus: false,
      transaction: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      first: "",
      middle: "",
      surname: "",
      id: "",
      idxHashRaw: "",
      idxHash: "",
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
      if (tempBool.exists === true) {
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
        await this.setState({ QRreader: false, DVresult: "" })
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

    const submitHandler = (e) => {
      e.preventDefault();
    }

    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({
        result: "",
        accessPermitted: false,
        Checkbox: false,
        QRreader: false,
        assetFound: "",
        idxHashRaw: "",
        idxHash: "",
        transaction: false,
        name: "",
        status: "",
        assetClass: "",
        txHash: "",
        txStatus: false,
        DVresult: ""
      })
    }

    const _verify = async () => {
      this.setState({ help: false })
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true });

      var idxHash = this.state.idxHash;

      // if(this.state.idxHashRaw !== undefined && this.state.idxHash === undefined){
      //   idxHash = this.state.idxHashRaw;
      // }
      // else if (this.state.idxHashRaw === undefined && this.state.idxHash !== undefined){
      //   idxHash = this.state.idxHash;
      // }
      // else{clearForm(); return alert("Multiple values for idxHash found. Clearing form.")}

      console.log(idxHash)
      let rgtRaw = window.web3.utils.soliditySha3(
        String(this.state.first).replace(/\s/g, ''),
        String(this.state.middle).replace(/\s/g, ''),
        String(this.state.surname).replace(/\s/g, ''),
        String(this.state.id).replace(/\s/g, ''),
        String(this.state.secret).replace(/\s/g, '')
      );
      console.log(rgtRaw)

      let rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtRaw));

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
          self.setState({ txStatus: receipt.status });
          console.log(receipt.events.REPORT.returnValues._msg);
          this.setState({ DVresult: receipt.events.REPORT.returnValues._msg })
        });

      return this.setState({ accessPermitted: false, Checkbox: false });
    };

    return (
      <div>
        {this.state.QRreader === false && (
          <div>
            <div className="mediaLinkADHome">
              <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeaderMobile">Deep Verify</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
            </div>
          </div>
        )}
        <Form className="formMobile" id='MainForm' onSubmit={submitHandler}>
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
                      onChange={(e) => this.setState({ idxHashRaw: e.target.value })}
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
                        src={require("../Resources/Images/QRSCANPIC.png")}
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
                    legacyMode={true}
                  />
                  {/* <div className="uploadImageQR">
                    <div className="uploadImageQRContent">
                      <UploadCloud size={60} onClick={() => { openImageDialog }} />
                    </div>
                  </div> */}
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
                    className="key"
                    type="text"
                    required
                    onChange={(e) => this.setState({ secret: e.target.value })}
                    size="lg"
                    autoComplete="off"
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
        {this.state.transaction === false && this.state.txStatus === false && this.state.QRreader === false && (
          <div className="assetSelectedResultsMobile">
            <Form.Row>
              {this.state.idxHash !== "" && this.state.txHash === "" && (
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContentMobile">{this.state.idxHash.substring(0, 18) + "..." + this.state.idxHash.substring(48, 66)}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContentMobile">{this.state.assetClass}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContentMobile">{this.state.status}</span> </div>
                </Form.Group>
              )}
            </Form.Row>
          </div>
        )}
        {this.state.QRreader === false && (<>

          {this.state.transaction === true && (
            <div className="resultsMobile">
              <h1 className="loadingh1">Transaction In Progress</h1>
            </div>)}
          {this.state.transaction === false && (
            <div>
              {this.state.txHash > 0 && (
                <div className="resultsMobile">
                  {this.state.txStatus === false && (
                    <div className="transactionErrorTextMobile">
                      !ERROR! :
                      <a
                        className="transactionErrorTextMobile"
                        href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        TX Hash:{this.state.txHash}
                      </a>
                    </div>
                  )}
                  {this.state.txStatus === true && (
                    <> {" "}
                      {this.state.DVresult !== "" && (
                        <div className="transactionErrorTextMobile">
                          {
                            this.state.DVresult === "Match confirmed"
                              ? "Match Confirmed :"
                              : "No Match Found :"
                          }
                        </div>
                      )}
                      <br></br>
                      <a
                        className="transactionErrorTextMobile"
                        href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        TX Hash:{this.state.txHash}
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          )}</>
        )}
      </div>
    );
  }
}
export default DeepVerifyMobile;
