import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, ArrowRightCircle, Camera, Tag, HelpCircle, AlertOctagon, CameraOff, UploadCloud } from "react-feather";
import QrReader from 'react-qr-reader'
import { ClickAwayListener } from '@material-ui/core';
import Alert from "react-bootstrap/Alert";

class RecycleMobile extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.accessAsset = async () => {
      this.setState({ help: false, txHash: "", txStatus: false })
      let idxHash;

      if (this.state.QRreader === false && this.state.Checkbox === false) {
        if (this.state.manufacturer === ""
          || this.state.type === ""
          || this.state.model === ""
          || this.state.serial === "") {
          return this.setState({ alertBanner: "Please fill out all fields before submission" })
        }

        else if (!this.state.Checkbox) {
          console.log("Here")
          idxHash = window.web3.utils.soliditySha3(
            String(this.state.type).replace(/\s/g, ''),
            String(this.state.manufacturer).replace(/\s/g, ''),
            String(this.state.model).replace(/\s/g, ''),
            String(this.state.serial).replace(/\s/g, '')
          );
        }
      }

      let resArray = await window.utils.checkStats(idxHash, [0, 2])

      console.log(resArray)


      if (Number(resArray[1]) === 0) {
        this.setState({ alertBanner: "Asset does not exist at given IDX" });
        return this.setState({
          idxHash: "", transaction: false, txStatus: false, txHash: "", accessPermitted: false, Checkbox: false, wasSentPacket: false, help: false
        })
      }

      if (Number(resArray[0]) !== 60) {
        this.setState({ alertBanner: "Asset not in recyclable status" });
        this.setState({
          idxHash: "", transaction: false, txStatus: false, txHash: "", accessPermitted: false, assetClassSelected: false, Checkbox: false, wasSentPacket: false, help: false
        })
      }

      if (this.state.QRreader) {
        idxHash = this.state.result
      }
      if (this.state.Checkbox) {
        idxHash = this.state.idxHashRaw
      }

      console.log("idxHash", idxHash);
      // console.log("rgtHash", rgtHash);

      await this.setState({
        idxHash: idxHash,
        QRreader: false,
        accessPermitted: true,
      })

    }

    this.clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: "", transaction: false, txStatus: false, txHash: "", accessPermitted: false, assetClassSelected: false, Checkbox: false, wasSentPacket: false, help: false })
    }

    this.mounted = false;
    this.state = {
      addr: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
      resultRA: "",
      assetClass: undefined,
      selectedAssetClass: "",
      assetClassSelected: false,
      CountDownStart: "",
      ipfs1: "",
      txHash: "",
      txStatus: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      idxHash: "",
      transaction: false,
      QRreader: false,
      Checkbox: false,
      help: false,
      legacyMode: false,
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.assetClass > 0) {
      this.setState({ assetClass: window.assetClass, assetClassSelected: true })
    }

    else {
      this.setState({ assetClassSelected: false })
    }
    this.setState({ QRReader: false });
  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    this.setState({ QRReader: false });
    this.setState({ runWatchDog: false });
  }

  componentDidUpdate() {//stuff to do when state updates

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

    const _setAC = async () => {
      let acDoesExist;
      let destinationACData;
      this.setState({ txHash: "" })

      if (this.state.selectedAssetClass === "0" || this.state.selectedAssetClass === "") { return this.setState({ alertBanner: "Selected AC Cannot be Zero" }) }
      else {
        if (
          isNaN(this.state.selectedAssetClass)
        ) {
          acDoesExist = await window.utils.checkForAC("name", this.state.selectedAssetClass);
          destinationACData = await window.utils.getACData("name", this.state.selectedAssetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist) {
            return this.setState({ alertBanner: "Asset class does not currently exist." })
          }

          this.setState({ ACname: this.state.selectedAssetClass });
          await window.utils.resolveAC(this.state.selectedAssetClass);
          await this.setState({ assetClass: destinationACData.AC });
        }

        else {
          acDoesExist = await window.utils.checkForAC("id", this.state.selectedAssetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist) {
            return this.setState({ alertBanner: "Asset class does not currently exist." })
          }

          this.setState({ assetClass: this.state.selectedAssetClass });
          await window.utils.resolveACFromID(this.state.selectedAssetClass)
          destinationACData = await window.utils.getACData("id", this.state.selectedAssetClass);

          await this.setState({ ACname: window.assetClassName });
        }
        if (this.state.wasSentPacket) {
          let resArray = await window.utils.checkStats(this.state.idxHash, [0, 2])
          console.log(resArray)

          if (Number(resArray[0]) !== 60) {
            alert("Asset is not discarded! Owner must export the assset in order to import.");
            window.sentPacket = undefined;
            return window.location.href = "/#/asset-dashboard-mobile"
          }

          console.log(destinationACData.root)

          if (resArray[1] != destinationACData.root) {
            alert("Import destination AC must have same root as origin!");
            window.sentPacket = undefined;
            this.clearForm()
            return window.location.href = "/#/asset-dashboard-mobile"
          }
        }
        this.setState({ assetClassSelected: true, acData: window.tempACData, txHash: "" });
        return window.assetClass = undefined;
      }
    }

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

    const submitHandler = (e) => {
      e.preventDefault();
    }


    const Checkbox = async () => {
      if (this.state.Checkbox === false) {
        this.setState({ Checkbox: true })
      }
      else {
        this.setState({ Checkbox: false })
      }
    }

    const _recycleAsset = async () => {
      this.setState({ help: false })
      if (
        this.state.first === "" ||
        this.state.middle === "" ||
        this.state.surname === "" ||
        this.state.id === "" ||
        this.state.secret === ""
      ) { return this.setState({ alertBanner: "Please fill out all forms" }) }

      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ resultRA: "" })
      this.setState({ transaction: true })
      var idxHash = this.state.idxHash;

      /*       if (this.state.result !== "") {
              idxHash = this.state.result;
            }
      
            else {
              idxHash = window.web3.utils.soliditySha3(
                String(this.state.type).replace(/\s/g, ''),
                String(this.state.manufacturer).replace(/\s/g, ''),
                String(this.state.model).replace(/\s/g, ''),
                String(this.state.serial).replace(/\s/g, ''),
              );
            } */

      var rgtRaw;

      rgtRaw = window.web3.utils.soliditySha3(
        String(this.state.first).replace(/\s/g, ''),
        String(this.state.middle).replace(/\s/g, ''),
        String(this.state.surname).replace(/\s/g, ''),
        String(this.state.id).replace(/\s/g, ''),
        String(this.state.secret).replace(/\s/g, '')
      );

      console.log(idxHash)
      console.log(this.state.selectedAssetClass)
      let isSameRoot = await window.utils.checkAssetRootMatch(this.state.selectedAssetClass, this.state.idxHash);
      console.log(isSameRoot)

      if (!isSameRoot) {
        this.setState({
          QRreader: false
        })
        this.clearForm()
        return this.setState({ alertBanner: "Import destination AC must have same root as previous AC" })
      }

      let rgtHash;

      console.log(rgtRaw, idxHash)

      if (idxHash.length % 2 !== 0) {
        rgtHash = window.web3.utils.soliditySha3((idxHash + "0"), rgtRaw);
      }

      else {
        rgtHash = window.web3.utils.soliditySha3(idxHash, rgtRaw);
      }



      console.log("rgtHash", rgtHash);
      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);

      window.contracts.RCLR.methods
        .$recycle(idxHash, rgtHash, this.state.assetClass)
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          this.setState({ alertBanner: "Something went wrong!" })
          this.clearForm();
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          this.setState({ txHash: receipt.transactionHash });
          this.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          window.recount = true;
          window.resetInfo = true;

          //Stuff to do when tx confirms
        });
      console.log(this.state.txHash);

      await this.setState({
        idxHash: "",
        accessPermitted: false
      })

      return this.clearForm();
    };

    return (
      <div>
        {this.state.QRreader === false && (
          <div>
            <div className="mediaLinkADHome">
              <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeaderMobile">Recycle Asset</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { this.clearForm() }} /></a>
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
          {window.addr > 0 && !this.state.assetClassSelected && this.state.QRreader === false && (
            <Form.Row>
              <Form.Label className="formFontRow">Asset Class:</Form.Label>
              <Form.Group as={Row} controlId="formGridAC">

                <Form.Control
                  className="singleFormRow"
                  placeholder="Submit an asset class name or #"
                  onChange={(e) => this.setState({ selectedAssetClass: e.target.value.trim() })}
                  size="lg"
                />
              </Form.Group>

              <div className="submitButtonRRMobile">
                <div className="submitButtonContentMobile">
                  <ArrowRightCircle
                    onClick={() => { _setAC() }}
                  />
                </div>
              </div>
            </Form.Row>
          )}
          {window.addr > 0 && (
            <div>
              {!this.state.accessPermitted && this.state.QRreader === false && this.state.assetClassSelected === true && (
                <>
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
                  {this.state.Checkbox === false && (
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

                      </Form.Row>
                      <Form.Row>

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

                      </Form.Row>
                      <Form.Row>

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
                </>
              )}
              {this.state.QRreader === false && !this.state.accessPermitted && this.state.assetClassSelected === true && (
                <>
                  <Form.Row>
                    <div className="submitButtonRRMobile">
                      <div className="submitButtonContentMobile">
                        <ArrowRightCircle
                          onClick={() => { this.accessAsset() }}
                        />
                      </div>
                    </div>
                    <div className="mediaLinkHelp">
                      <div className="mediaLinkHelpContentMobile">
                        <HelpCircle
                          onClick={() => { help() }}
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
                  {this.state.help === true && (
                    <div className="explainerTextBoxMobile2">
                      Recycling an asset requires that the asset has been discarded by its previous owner. Recycle can either
                      take a recreated hash made by providing asset information, an assets unique QR code, or simply the asset's Idx hash.
                      The address that provides this information will then be able to claim the asset as their own.
                    </div>
                  )}
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
                      <Form.Control
                        placeholder="First Name"
                        required
                        onChange={(e) => this.setState({ first: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>

                  </Form.Row>
                  <Form.Row>

                    <Form.Group as={Col} controlId="formGridMiddleName">
                      <Form.Label className="formFont">Middle Name:</Form.Label>
                      <Form.Control
                        placeholder="Middle Name"
                        required
                        onChange={(e) => this.setState({ middle: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>

                  </Form.Row>
                  <Form.Row>

                    <Form.Group as={Col} controlId="formGridLastName">
                      <Form.Label className="formFont">Last Name:</Form.Label>
                      <Form.Control
                        placeholder="Last Name"
                        required
                        onChange={(e) => this.setState({ surname: e.target.value.trim() })}
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
                        onChange={(e) => this.setState({ id: e.target.value.trim() })}
                        size="lg"
                      />
                    </Form.Group>

                  </Form.Row>
                  <Form.Row>

                    <Form.Group as={Col} controlId="formGridPassword">
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
                    </Form.Group>

                  </Form.Row>
                  <Form.Row>
                    <div>
                      <Form.Label className="costText"> Cost To Recycle Asset in AC {this.state.selectedAssetClass}: {Number(window.costs.newAsset) / 1000000000000000000} PRüF</Form.Label>
                      <div className="submitButtonRRMobile">
                        <div className="submitButtonContentMobile">
                          <Tag
                            onClick={() => { _recycleAsset() }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mediaLinkHelp">
                      <div className="mediaLinkHelpContentMobile">
                        <AlertOctagon
                          onClick={() => { help() }}
                        />
                      </div>
                    </div>
                  </Form.Row>
                  {this.state.help === true && (
                    <div className="explainerTextBoxMobile">
                      PRüF never stores your personal data. The information you provide here will be irreversibly hashed into a unique pattern that does not contain the data that you provide,
                      encrypted or otherwise.
                    </div>
                  )}
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
                  <div className="assetSelectedContentHead">Being Recycled Into Asset Class: <span className="assetSelectedContent">{this.state.selectedAssetClass}</span> </div>
                </Form.Group>
              )}
            </Form.Row>
          </div>
        )}
        {this.state.transaction === true && (
          <div className="resultsMobile">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>)}
        {this.state.transaction === false && (
          <div>
            {this.state.txHash > 0 && ( //conditional rendering
              <div className="resultsMobile">
                            {this.state.txStatus === false && (
              <Alert
                className="alertFooterMobile"
                variant="success">
                Transaction failed!
                <Alert.Link
                  className="alertLinkMobile"
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
                className="alertFooterMobile"
                variant="success">
                Transaction success!
                <Alert.Link
                  className="alertLinkMobile"
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
        )}
      </div>
    );
  }
}

export default RecycleMobile;
