import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, ArrowRightCircle, UploadCloud, Camera, CameraOff, CheckCircle } from "react-feather";
import QrReader from 'react-qr-reader'
import { ClickAwayListener } from '@material-ui/core';
import Alert from "react-bootstrap/Alert";

class DeepVerifyMobile extends Component {
  constructor(props) {
    super(props);


    this.accessAsset = async () => {
      this.setState({ txHash: "", txStatus: false })
      let idxHash;
      if (this.state.QRreader === false && this.state.Checkbox === false) {
        if (this.state.manufacturer === ""
          || this.state.type === ""
          || this.state.model === ""
          || this.state.serial === "") {
          return this.setState({ alertBanner: "Please fill out all forms before submission" })
        }
        idxHash = window.web3.utils.soliditySha3(
          String(this.state.type).replace(/\s/g, ''),
          String(this.state.manufacturer).replace(/\s/g, ''),
          String(this.state.model).replace(/\s/g, ''),
          String(this.state.serial).replace(/\s/g, '')
        );
      }

      if (this.state.QRreader === true && this.state.Checkbox === false) {
        idxHash = this.state.result
      }

      if (this.state.Checkbox === true) {
        idxHash = this.state.idxHashRaw
      }

      let doesExist = await window.utils.checkAssetExistsBare(idxHash);
      let tempObj = await window.utils.checkAssetExists(idxHash)
      if (!doesExist) {
        this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, DVresult: "" })
        return this.setState({ alertBanner: "Asset doesnt exist! Ensure data fields are correct before submission." })
      }

      let infoArr, acName, tempStatus;
      infoArr = Object.values(tempObj.obj);
      acName = await window.utils.getACName(infoArr[2])
      tempStatus = await window.utils.getStatusString(String(infoArr[0]))


      console.log("idxHash", idxHash);

      return this.setState({
        idxHash: idxHash,
        assetClass: acName,
        status: tempStatus,
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
        this.setState({ Checkbox: true, idxHashRaw: "" })
      }
      else {
        this.setState({ Checkbox: false, idxHashRaw: "" })
      }
    }


    const previewStyle = {
      height: 240,
      width: 320,
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
          self.setState({ alertBanner: "Something went wrong!" })
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
              <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeaderMobile">Deep Verify</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
            </div>
          </div>
        )}
        <Form className="formMobile" id='MainForm' onSubmit={submitHandler}>
          {window.addr === undefined && (
            <div className="resultsMobile">
              <h2>User address unreachable</h2>
              <h3>Please
                <a
                  onClick={() => {
                    this.setState({ userMenu: undefined })
                    if (window.ethereum) { window.ethereum.enable() }
                    else { this.setState({ alertBanner: "You do not currently have a Web3 provider installed, we recommend MetaMask" }); }
                  }
                  }
                  className="userDataLink">
                  click here
                </a>
                  to enable Ethereum.
                  </h3>
            </div>
          )}
          {window.addr > 0 && (
            <div>

              {this.state.QRreader === false && !this.state.accessPermitted && (
                <div>
                  <Form.Check
                    type="checkbox"
                    checked={this.state.Checkbox}
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
                        onChange={(e) => this.setState({ idxHashRaw: e.target.value.trim() })}
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
                        onChange={(e) => this.setState({ type: e.target.value.trim() })}
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
                        onChange={(e) => this.setState({ model: e.target.value.trim() })}
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
                        onChange={(e) => this.setState({ serial: e.target.value.trim() })}
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
                      <div className="submitButtonContentMobile">
                        <ArrowRightCircle
                          onClick={() => { this.accessAsset() }}
                        />
                      </div>
                    </div>
                    <div className="mediaLinkCameraMobile">
                      <div className="submitButtonContentMobile">
                        <Camera
                          onClick={() => { QRReader() }}
                        />
                      </div>
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
                      <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/' }} /></a>
                    </div>
                    <h2 className="formHeaderMobileVL">Scan QR</h2>
                    <div className="mediaLinkBackMobile">
                      <a className="mediaLinkContentBack" ><CameraOff onClick={() => { QRReader() }} /></a>
                    </div>
                  </div>
                  <div className="QRreaderMobile">
                    <QrReader
                      ref="qrReader1"
                      delay={300}
                      previewStyle={previewStyle}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      style={{ width: '100%' }}
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
                      onChange={(e) => this.setState({ first: e.target.value.trim() })}
                      size="lg"
                    />
                  </Form.Row>
                  <Form.Row>
                    <Form.Label className="formFont">Middle Name:</Form.Label>
                    <Form.Control
                      placeholder="Middle Name"
                      required
                      onChange={(e) => this.setState({ middle: e.target.value.trim() })}
                      size="lg"
                    />
                  </Form.Row>
                  <Form.Row>
                    <Form.Label className="formFont">Last Name:</Form.Label>
                    <Form.Control
                      placeholder="Last Name"
                      required
                      onChange={(e) => this.setState({ surname: e.target.value.trim() })}
                      size="lg"
                    />
                  </Form.Row>

                  <Form.Row>
                    <Form.Label className="formFont">ID Number:</Form.Label>
                    <Form.Control
                      placeholder="ID Number"
                      required
                      onChange={(e) => this.setState({ id: e.target.value.trim() })}
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
                      onChange={(e) => this.setState({ secret: e.target.value.trim() })}
                      size="lg"
                      autoComplete="off"
                    />
                  </Form.Row>
                  <Form.Row>
                    <div className="submitButtonRRMobile">
                      <div className="submitButtonContentMobile">
                        <CheckCircle
                          onClick={() => { _verify() }}
                        />
                      </div>
                    </div>
                  </Form.Row>
                </>
              )}
            </div>
          )}

        </Form>
        {this.state.transaction === false && this.state.txStatus === false && this.state.QRreader === false && (
          <div className="assetSelectedResultsMobile">
            {this.state.alertBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                <Alert className="alertBannerMobile" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                  {this.state.alertBanner}
                </Alert>
              </ClickAwayListener>
            )}
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
                  {this.state.DVresult === "Match confirmed"
                    ? <Alert
                        className="alertFooterMobile"
                        variant="success"> 
                        Match confirmed!
                          <Alert.Link 
                            className="alertLinkMobile"
                            href={" https://kovan.etherscan.io/tx/" + this.state.txHash}
                            target="_blank"
                            rel="noopener noreferrer"> CLICK HERE
                          </Alert.Link> 
                        to view transaction on etherscan.
                      </Alert>
                    : <Alert
                      className="alertFooterMobile"
                      variant="danger"> 
                      No match found! 
                        <Alert.Link 
                          className="alertLinkMobile"
                          href={" https://kovan.etherscan.io/tx/" + this.state.txHash}
                          target="_blank"
                          rel="noopener noreferrer"> CLICK HERE
                        </Alert.Link>
                      to view transaction on etherscan.
                    </Alert> 
                    }
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
