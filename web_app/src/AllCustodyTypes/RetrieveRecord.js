import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import QrReader from 'react-qr-reader'
import { QRCode } from 'react-qrcode-logo';
import { CornerUpLeft, Home, XSquare, ArrowRightCircle, HelpCircle, X } from "react-feather";


class RetrieveRecord extends Component {
  constructor(props) {
    super(props);

    this.updateAssets = setInterval(() => {
      if (this.state.ipfsObject !== undefined && this.state.runWatchDog === true && this.state.assetObj === undefined) {
        let tempIPFS = this.state.ipfsObject;
        console.log(tempIPFS)
        this.setState({
          assetObj: {
            idxHash: this.state.idxHash,
            name: tempIPFS.name,
            assetClass: window.assetInfo.assetClass,
            status: window.assetInfo.status,
            description: tempIPFS.text.description,
            text: tempIPFS.text,
            photo: tempIPFS.photo,

          }, moreInfo: true
        })
        if (tempIPFS.photo.displayImage !== undefined && tempIPFS.photo.displayImage !== "") {
          this.setState({ selectedImage: tempIPFS.photo.displayImage })
        }
        else {
          this.setState({ selectedImage: Object.values(tempIPFS.photo)[0] })
        }

      }

    }, 100)
    //State declaration.....................................................................................................

    this.getIPFSJSONObject = (lookup) => {
      //console.log(lookup)
      window.ipfs.cat(lookup, async (error, result) => {
        if (error) {
          console.log(lookup, "Something went wrong. Unable to find file on IPFS");
          return this.setState({ ipfsObject: undefined })
        } else {
          console.log(lookup, "Here's what we found for asset description: ", result);
          return this.setState({ ipfsObject: JSON.parse(result) })
        }
      });
    };

    this.printQR = async () => {
      if (this.state.printQR === undefined) {
        this.setState({ printQR: true })
      }
      else {
        this.setState({ printQR: undefined })
      }
    }

    this.generateAssetInfo = (obj) => {
      let images = Object.values(obj.photo)
      let text = Object.values(obj.text)
      let textNames = Object.keys(obj.text)
      let status = obj.status;

      const showImage = (e) => {
        console.log(this.state.selectedImage)
        console.log(e)
        this.setState({ selectedImage: e })
      }

      const openPhotoNT = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) { newWindow.opener = null }
      }

      const generateThumbs = () => {
        let component = [];

        for (let i = 0; i < images.length; i++) {
          component.push(
            <button key={"thumb" + String(i)} value={images[i]} className="assetImageSelectorButton" onClick={() => { showImage(images[i]) }}>
              <img src={images[i]} className="imageSelectorImage" alt="" />
            </button>
          )
        }

        return component

      }

      const generateTextList = () => {
        let component = [];

        for (let i = 0; i < text.length; i++) {
          if (textNames[i] !== "Description") {
            component.push(
              <>
                <h4 key={"TextElement" + String(i)} className="cardDescriptionSelected">
                  {textNames[i]}:
                  <h4 key={"nestedText" + String(i)} className="cardDescriptionSelectedContent">
                    {text[i].replace(/111APOST111/gi, "'").replace(/111QUOTE111/gi, '"')}</h4></h4>
                <br />
              </>
            )
          }
          else {
            component.unshift(<>
              <h4 key="TextElementDesc" className="cardDescriptionSelected">
                Description:
                <h4 key="nestedTextDesc" className="cardDescriptionSelectedContent">
                  {text[i].replace(/111APOST111/gi, "'").replace(/111QUOTE111/gi, '"')}</h4></h4>
              <br />
            </>)
          }

        }

        return component
      }
      return (
        <div key="selectedAsset">
          <div>
            <div className="assetDashboardSelected">
              <style type="text/css"> {`
  
              .card {
                width: 100%;
                max-width: 100%;
                height: 50rem;
                max-height: 100%;
                background-color: #005480;
                margin-top: 0.3rem;
                color: white;
                word-break: break-all;
              }

              .btn-selectedImage {
                background-color: #005480;
                color: white;
                height: 4rem;
                margin-top: -20rem;
                margin-left: -0.8rem;
                font-weight: bold;
                font-size: 2.2rem;
                border-radius: 0rem 0rem 0.3rem 0.3rem;
              }

              .btn-selectedAsset {
                background-color: #005480;
                color: white;
                font-weight: bold;
                font-size: 1.2rem;
              }

              .btn-QR {
                background-color: #002a40;
                color: white;
                height: 2rem;
                width: 17rem;
                margin-top: auto;
                // margin-left: -0.8rem;
                font-weight: bold;
                font-size: 1rem;
                border-radius: 0rem 0rem 0.3rem 0.3rem;
                justify-content: center;
              }
  
            `}
              </style>
              <div className="card" value="100">
                <div className="row no-gutters">
                  <div className="assetSelecedInfo">
                    <div>
                      <button
                        onClick={() => { this.printQR() }}
                        className="buttonQR"
                      >
                        <img
                          className="imageFormQR"
                          title="Asset QR Code"
                          src={require("../Resources/QRPIC.png")}
                          alt="Pruf Print" />
                      </button>
                    </div>
                    {this.state.printQR && (
                      <div>
                        <div className="displayQR">
                          <div className="QR">
                            {this.state.idxHashRaw !== "" && (
                              <QRCode
                                value={this.state.idxHashRaw}
                                size="150"
                                fgColor="#002a40"
                                logoWidth="35"
                                logoHeight="46"
                                logoImage="https://pruf.io/assets/images/pruf-u-logo-with-border-323x429.png"
                              />
                            )}
                            {this.state.idxHashRaw === "" && (
                              <QRCode
                                value={obj.idxHash}
                                size="150"
                                fgColor="#002a40"
                                logoWidth="35"
                                logoHeight="46"
                                logoImage="https://pruf.io/assets/images/pruf-u-logo-with-border-323x429.png"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <button className="assetImageButtonSelected">
                      {this.state.selectedImage !== "" ?
                        (<img title="View Image" src={this.state.selectedImage} className="assetImageSelected" alt="" />)
                        : (<>{obj.identicon}</>)}
                    </button>
                    <p className="cardNameSelected">Name: {obj.name}</p>
                    <p className="cardAcSelected">Asset Class: {obj.assetClassName}</p>
                    <p className="cardStatusSelected">Status: {obj.status}</p>
                    {images.length !== 0 && (
                      <div className="imageSelector">
                        {generateThumbs()}
                      </div>
                    )}
                    {this.state.idxHashRaw !== "" && (
                      <div className="cardSelectedIdxForm">
                        <h4 className="cardIdxSelected">IDX : {this.state.idxHashRaw}</h4>
                      </div>
                    )}
                    {this.state.idxHashRaw === "" && (
                      <div className="cardSelectedIdxForm">
                        <h4 className="cardIdxSelected">IDX : {obj.idxHash}</h4>
                      </div>
                    )}
                    <div className="cardDescriptionFormSelected">
                      {generateTextList()}
                    </div>
                  </div>
                  {this.state.moreInfo && (
                    <div className="cardButton2">
                      <div className="cardButton2Content">
                        <CornerUpLeft
                          size={35}
                          onClick={() => { this.setState({ moreInfo: false, ipfsObject: undefined, assetObj: undefined, Checkbox: false, idxHashRaw: "" }) }}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div >
            </div >
          </div>
        </div>


      )
    }

    this.handlePacket = async () => {
      this.setState({ help: false })
      let idxHash = window.sentPacket;

      this.setState({
        idxHash: window.sentPacket.idxHash,
        wasSentPacket: true,
        name: window.sentPacket.name,
        assetClass: window.sentPacket.assetClass
      })

      window.sentPacket = undefined;
      let hash;
      let assetClass;
      let status;

      await window.contracts.STOR.methods.retrieveShortRecord(idxHash)
        .call((_error, _result) => {
          if (_error) {
            console.log("IN ERROR IN ERROR IN ERROR")
          } else {
            if (Number(Object.values(_result)[5]) > 0) {
              hash = Object.values(_result)[5]

            }
            else {
              return hash = "0"
            }
            assetClass = Object.values(_result)[2]
            status = Object.values(_result)[0]
          }
        })
      this.setState({ retrievedAssetClass: assetClass, retrievedStatus: status });
      return this.getIPFSJSONObject(window.utils.getIpfsHashFromBytes32(hash))

    }

    this._retrieveRecordQR = async () => {
      this.setState({ help: false })
      this.setState({ QRRR: undefined, assetFound: "" })
      const self = this;
      var ipfsHash;
      var tempResult;
      let idxHash = String(this.state.result)
      this.setState({ idxHash: idxHash })
      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);

      await window.contracts.STOR.methods
        .retrieveShortRecord(idxHash)
        .call(
          function (_error, _result) {
            if (_error) {
              console.log(_error)
              self.setState({ error: _error });
              self.setState({ result: 0 });
            } else {
              self.setState({ result: Object.values(_result) })
              self.setState({ error: undefined });
              tempResult = Object.values(_result);
              if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
              console.log("ipfs data in promise", ipfsHash)
              if (Object.values(_result)[6] > 0) {
                console.log("Getting ipfs2 set up...")
                let knownUrl = "https://ipfs.io/ipfs/";
                let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
                let fullUrl = knownUrl + hash;
                console.log(fullUrl);
                self.setState({ ipfs2: fullUrl });
              }
            }
          });

      window.assetClass = tempResult[2]

      window.assetInfo = {
        assetClass: tempResult[2],
        status: tempResult[0],
        idx: idxHash
      }
      await window.utils.resolveACFromID(tempResult[2])
      await this.getACData("id", window.assetClass)

      console.log(window.authLevel);

      await this.getIPFSJSONObject(ipfsHash);

      return this.setState({
        authLevel: window.authLevel,
        QRreader: false
      })
    }

    this.getACData = async (ref, ac) => {
      let tempData;
      let tempAC;

      if (window.contracts !== undefined) {

        if (ref === "name") {
          console.log("Using name ref")
          await window.contracts.AC_MGR.methods
            .resolveAssetClass(ac)
            .call((_error, _result) => {
              if (_error) { console.log("Error: ", _error) }
              else {
                if (Number(_result) > 0) { tempAC = Number(_result) }
                else { return 0 }
              }
            });

        }

        else if (ref === "id") { tempAC = ac; }

        await window.contracts.AC_MGR.methods
          .getAC_data(tempAC)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              let _custodyType;

              if (Object.values(_result)[1] === "1") {
                _custodyType = "Custodial"
              }

              else {
                _custodyType = "Non-Custodial"
              }

              tempData = {
                root: Object.values(_result)[0],
                custodyType: _custodyType,
                discount: Object.values(_result)[2],
                exData: Object.values(_result)[3],
                AC: tempAC
              }
            }
          });
        return tempData;
      }

    }

    this.state = {
      addr: "",
      lookupIPFS1: "",
      lookupIPFS2: "",
      hashPath: "",
      error: undefined,
      NRerror: undefined,
      resultArr: [],
      assetClass: undefined,
      ipfs1: "",
      ipfs2: "",
      txHash: "",
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      first: "",
      middle: "",
      surname: "",
      id: "",
      secret: "",
      status: "",
      assetObj: undefined,
      wasSentPacket: false,
      ipfsObject: undefined,
      showDescription: false,
      QRreader: false,
      result: "",
      QRRR: undefined,
      assetFound: undefined,
      Checkbox: false,
      idxHashRaw: "",
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window

    if (window.sentPacket !== undefined) {

      this.handlePacket()
    }

    this.setState({ runWatchDog: true })


  }

  componentDidUpdate() {//stuff to do when state updates


  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

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
        this._retrieveRecordQR()
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

    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({ Checkbox: false, help: false })
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
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

    const Checkbox = async () => {
      if (this.state.Checkbox === false) {
        this.setState({ Checkbox: true })
      }
      else {
        this.setState({ Checkbox: false })
      }
    }

    const _retrieveRecord = async () => {
      this.setState({ help: false })
      const self = this;
      var ipfsHash;
      var tempResult;
      let idxHash

      if (this.state.Checkbox === false) {
        idxHash = window.web3.utils.soliditySha3(
          String(this.state.type),
          String(this.state.manufacturer),
          String(this.state.model),
          String(this.state.serial),
        );
        this.setState({ idxHash: idxHash })
        console.log("idxHash", idxHash);
        console.log("addr: ", window.addr);
      }

      if (this.state.Checkbox === true) {
        idxHash = this.state.idxHashRaw;
        console.log("idxHash", idxHash);
        console.log("addr: ", window.addr);
      }

      await window.contracts.STOR.methods
        .retrieveShortRecord(idxHash)
        .call(function (_error, _result) {
          if (_error) {
            console.log(_error)
            self.setState({ error: _error });
            self.setState({ result: 0 });
          } else {
            self.setState({ result: Object.values(_result) })
            self.setState({ error: undefined });
            tempResult = Object.values(_result);
            if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
            console.log("ipfs data in promise", ipfsHash)
            if (Object.values(_result)[6] > 0) {
              console.log("Getting ipfs2 set up...")
              let knownUrl = "https://ipfs.io/ipfs/";
              let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
              let fullUrl = knownUrl + hash;
              console.log(fullUrl);
              self.setState({ ipfs2: fullUrl });
            }
          }
        });

      window.assetClass = tempResult[2]

      window.assetInfo = {
        assetClass: tempResult[2],
        status: await window.utils.getStatusString(String(tempResult[0])),
        idx: idxHash
      }
      await window.utils.resolveACFromID(tempResult[2])
      await this.getACData("id", window.assetClass)

      console.log(window.authLevel);

      await this.getIPFSJSONObject(ipfsHash);

      return this.setState({ authLevel: window.authLevel })
    }

    if (this.state.wasSentPacket === true) {
      return (
        <div>
          <div>
            <div>
              <div className="mediaLinkADHome">
                <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
              </div>
              <h2 className="AssetDashboardHeader">Here's What We Found :</h2>
              <div className="mediaLinkClearForm">
                <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
              </div>
            </div>
          </div>
          <div className="assetDashboard">
            {this.state.assetObj !== undefined && (<>{this.generateAssetInfo(this.state.assetObj)}</>)}
            {this.state.assetObj === undefined && (<h4 className="loading">Loading Asset</h4>)}
          </div>
          <div className="assetDashboardFooter">
          </div>
        </div >
      )

    }
    else {
      return (
        <div>
          {!this.state.moreInfo && this.state.QRreader === false && (
            <div>
              <div>
                <div className="mediaLinkADHome">
                  <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                </div>
                <h2 className="formHeader">Search Assets</h2>
                <div className="mediaLinkClearForm">
                  <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
                </div>
              </div>
              <Form className="form" id="MainForm">
                <div>
                  {this.state.QRreader === false && (
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
                            onChange={(e) => this.setState({ idxHashRaw: e.target.value })}
                            size="lg"
                          />
                        </Form.Group>
                      )}
                    </div>
                  )}

                  {this.state.Checkbox === false && (
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
                    </>
                  )}

                  <Form.Row>
                    <div className="submitButton">
                      <div className="submitButtonContent">
                        <ArrowRightCircle
                          onClick={() => { _retrieveRecord() }}
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
                    <div>
                      <button
                        onClick={() => { QRReader() }}
                        className="buttonQRScan"
                      >
                        <img
                          className="scanImageFormQR"
                          title="Scan QR Code"
                          src={require("../Resources/QRSCANPIC.png")}
                          alt="Pruf Print" />
                      </button>
                    </div>
                  </Form.Row>
                  {this.state.help === true && (
                    <div className="explainerTextBox">
                      Retrieve Record is a function that searches our platform for an asset based on a given Idx hash. This local search engine can either
                      take a recreated hash made by providing asset information, an assets unique QR code, or simply the asset's Idx hash.
                    </div>
                  )}
                </div>
              </Form>
              <div className="results"></div>
            </div>
          )}

          {this.state.QRreader === true && (
            <div>
              <div>
                <div className="mediaLinkADHome">
                  <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                </div>
                <h2 className="formHeader">Search Assets</h2>
                <div className="mediaLinkBack">
                  <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { QRReader() }} /></a>
                </div>
              </div>
              <div className="QRreader">
                <QrReader
                  delay={300}
                  onError={this.handleError}
                  onScan={this.handleScan}
                  style={{ width: '100%' }}
                />
                {this.state.result !== undefined && (
                  <div className="results">
                    {this.state.assetFound}
                  </div>
                )}
              </div>
            </div>
          )}

          {this.state.result[2] === "0" && (
            <div className="results">No Asset Found for Given Data</div>
          )}

          {this.state.moreInfo && ( //conditional rendering
            <div>
              <div>
                <h2 className="assetDashboardHeader">Here's what we found: </h2>
              </div>
              <div className="assetDashboard">
                {this.state.assetObj !== undefined && (<>{this.generateAssetInfo(this.state.assetObj)}</>)}
                {this.state.assetObj === undefined && (<h4 className="loading">Loading Asset</h4>)}
              </div>
              <div className="assetDashboardFooter">
              </div>
            </div >
          )}
        </div>
      );
    }
  }
}

export default RetrieveRecord;
