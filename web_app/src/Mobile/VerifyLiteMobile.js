import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, ArrowRightCircle, Camera, CameraOff, UploadCloud, CheckCircle } from "react-feather";
import QrReader from 'react-qr-reader'
import { ClickAwayListener } from '@material-ui/core';
import Alert from "react-bootstrap/Alert";

class VerifyLiteMobile extends Component {
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
      idxHashRaw: undefined,
      idxHash: undefined,
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

    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, assetFound: "", idxHashRaw: undefined, idxHash: undefined, VLresult: "" })
    }
    
    const submitHandler = (e) => {
      e.preventDefault();
  }

    const _verify = async () => {
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ VLresult: "" })

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

      var doesExist = await window.utils.checkAssetExistsBare(idxHash);
      var infoMatches = await window.utils.checkMatch(idxHash, rgtHash);

      if (!doesExist) {
        this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, assetFound: "" })
        return this.setState({ alertBanner: "Asset doesnt exist! Ensure data fields are correct before submission."})
      }

      if (!infoMatches) {
        await this.setState({ VLresult: "0" })
      }

      if (infoMatches) {this.setState({ msgBanner: "Match Confirmed"}); await this.setState({ VLresult: "170" }); }

      return this.setState({ accessPermitted: false, Checkbox: false });
    };

    return (
      <div>
        {this.state.QRreader === false && (
          <div>
            <div className="mediaLinkADHome">
              <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeaderMobile">Verify Lite</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
            </div>
          </div>
        )}
        <Form className="formMobile" id='MainForm' onSubmit={submitHandler}>
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
        </Form>
        {this.state.QRreader === false && (
          <div className="resultsMobile">
          {this.state.alertBanner !== undefined && (
            <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
              <Alert className="alertBannerMobile" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                {this.state.alertBanner}
              </Alert>
            </ClickAwayListener>
          )}
          {this.state.msgBanner !== undefined && (
            <ClickAwayListener onClickAway={() => { this.setState({ msgBanner: undefined }) }}>
              <Alert className="alertBannerMobile" key={1} variant="danger" onClose={() => this.setState({ msgBanner: undefined })} dismissible>
                {this.state.msgBanner}
              </Alert>
            </ClickAwayListener>
          )}

            {this.state.VLresult !== "" && ( //conditional rendering
            <>
              <Form.Row>
                {
                  this.state.VLresult === "170"
                    ? "Match Confirmed"
                    : "No Match Found"
                }
              </Form.Row>
              </>
            )}
            {this.state.idxHash !== undefined && this.state.VLresult === "" && (
            <Form.Row>
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContentMobile">{this.state.idxHash.substring(0, 18) + "..." + this.state.idxHash.substring(48, 66)}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContentMobile">{this.state.assetClass}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContentMobile">{this.state.status}</span> </div>
                </Form.Group> 
              </Form.Row>
            )}

          </div>
        )}
      </div>
    );
  }
}
export default VerifyLiteMobile;
