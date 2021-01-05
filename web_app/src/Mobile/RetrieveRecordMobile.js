import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import QrReader from 'react-qr-reader';
import Jdenticon from 'react-jdenticon';
import { CornerUpLeft, Home, XSquare, ArrowRightCircle, UploadCloud, Camera, CameraOff, Copy, Share2 } from "react-feather";
import { isChrome, isOpera, isAndroid } from "react-device-detect";
import { ClickAwayListener } from '@material-ui/core';
import Alert from "react-bootstrap/Alert";
import { RWebShare } from "react-web-share";

class RetrieveRecordMobile extends Component {
  constructor(props) {
    super(props);

    this.updateAssets = setInterval(() => {
      if (this.state.ipfsObject !== undefined && this.state.runWatchDog === true && this.state.assetObj === undefined) {
        let tempIPFS = this.state.ipfsObject;
        console.log(tempIPFS)
        if (this.state.idxHashRaw === undefined) {
          this.setState({
            assetObj: {
              idxHash: this.state.idxHash,
              name: tempIPFS.name,
              assetClassName: window.assetInfo.assetClassName,
              assetClass: window.assetInfo.assetClass,
              status: window.assetInfo.status,
              description: tempIPFS.text.description,
              text: tempIPFS.text,
              photo: tempIPFS.photo,

            },
            moreInfo: true,
            URL: this.state.baseURL + this.state.idxHash
          })
        }
        else {
          this.setState({
            assetObj: {
              idxHash: this.state.idxHashRaw,
              name: tempIPFS.name,
              assetClassName: window.assetInfo.assetClassName,
              assetClass: window.assetInfo.assetClass,
              status: window.assetInfo.status,
              description: tempIPFS.text.description,
              text: tempIPFS.text,
              photo: tempIPFS.photo,

            },
            moreInfo: true,
            URL: this.state.baseURL + this.state.idxHashRaw
          })
        }

        if (tempIPFS.photo.DisplayImage !== undefined) {
          this.setState({ selectedImage: tempIPFS.photo.DisplayImage })
        }

        else if (Object.values(tempIPFS.photo).length > 0) {
          this.setState({ selectedImage: Object.values(tempIPFS.photo)[0] })
        }

        else {
          this.setState({ selectedImage: undefined })
        }
      }

      if (this.state.runWatchDog === true && Number(this.state.queryValue) > 0 && window.contracts != undefined && this.state.runQuery === true) {
        this.setState({ runQuery: false })
        this._retrieveRecordQR(this.state.queryValue)
      }

    }, 150)
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

    this.generateAssetInfo = (obj) => {
      let images = Object.values(obj.photo)
      let text = Object.values(obj.text)
      let textNames = Object.keys(obj.text)
      let status = ""; //BS:EXAMINE defined but never used

      if (obj.status === "50") { status = "In Locked Escrow" }
      else if (obj.status === "51") { status = "Transferrable" }
      else if (obj.status === "52") { status = "Non-Transferrable" }
      else if (obj.status === "53") { status = "MARKED STOLEN" }
      else if (obj.status === "54") { status = "MARKED LOST" }
      else if (obj.status === "55") { status = "Transferred/Unclaimed" }
      else if (obj.status === "56") { status = "In Escrow" }
      else if (obj.status === "57") { status = "Out of Supervised Escrow" }
      else if (obj.status === "58") { status = "Imported" }
      else if (obj.status === "59") { status = "Discardable" }
      else if (obj.status === "60") { status = "Recyclable" }
      else if (obj.status === "70") { status = "Exported" }
      else if (obj.status === "0") { status = "No Status Set" }
      else if (obj.status === "1") { status = "Transferrable" }
      else if (obj.status === "2") { status = "Non-Transferrable" }
      else if (obj.status === "3") { status = "MARKED STOLEN" }
      else if (obj.status === "4") { status = "MARKED LOST" }
      else if (obj.status === "5") { status = "Transferred/Unclaimed" }
      else if (obj.status === "6") { status = "In Escrow" }
      else if (obj.status === "7") { status = "Out of Supervised Escrow" }

      else { status = "Invalid Status Retrieved" }

      const showImage = (e) => {
        console.log(this.state.selectedImage)
        console.log(e)
        this.setState({ selectedImage: e })
      }

      const renderIcon = () => {
        return <Jdenticon size="340" value={obj.idxHash} />
      }

      const copyLink = async () => {
        if (isAndroid && !isChrome) {
          this.setState({ alertMsg: "Copy this text to share asset:\n" + this.state.URL });
        }

        else {
          navigator.clipboard.writeText(String(this.state.URL));
          this.setState({ alertMsg: "Text copied to clipboard." });
        }
      }


      const generateThumbs = () => {
        let component = [];

        for (let i = 0; i < images.length; i++) {
          component.push(
            <button value={images[i]} class="assetImageSelectorButtonMobile" onClick={() => { showImage(images[i]) }}>
              <img src={images[i]} className="imageSelectorImageMobile" alt="imageSelectorImageMobile" />
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
                <h4 key={"TextElement" + String(i)} className="cardDescriptionSelectedMobile">
                  {textNames[i]}:
              <h4 key={"nestedText" + String(i)} className="cardDescriptionSelectedContentMobile">
                    {text[i].replace(/111APOST111/gi, "'").replace(/111QUOTE111/gi, '"')}</h4></h4>
                <br />
              </>
            )
          }
          else {
            component.unshift(<>
              <h4 key="TextElementDesc" className="cardDescriptionSelected">
                Description:
              <h4 key="nestedTextDesc" className="cardDescriptionSelectedContentMobile">
                  {text[i].replace(/111APOST111/gi, "'").replace(/111QUOTE111/gi, '"')}</h4></h4>
              <br />
            </>)
          }
        }

        return component
      }

      return (
        <>
          <Card style={{ height: '350px', width: '360px', overflowY: "auto", overflowX: "hidden", backgroundColor: "#005480", color: "white" }}>
            {this.state.selectedImage !== undefined ?
              (<Card.Img style={{ width: '340px', height: "340px" }} variant="top" src={this.state.selectedImage} />)
              : (<>{renderIcon()}</>)}

            <Card.Body>
              <div className="imageSelectorMobile">
                {generateThumbs()}
              </div>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">Name : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.name}</h4></Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">Asset Class : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.assetClassName}</h4></Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">Asset Status : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.status}</h4></Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">IDX : </h4>
                {/*               <div className="cardCopyButtonMobile">
                  <div className="cardCopyButtonMobileContent">
                    <Copy
                      size={15}
                      onClick={() => { navigator.clipboard.writeText(String(obj.idxHash)) }}
                    />
                  </div>
                </div> */}
                <h4 className="cardDescriptionSelectedContentMobile">
                  {obj.idxHash}
                </h4>
              </Card.Title>
              <Card.Title>{generateTextList()}</Card.Title>
            </Card.Body>
          </Card>
          <div className="backButtonMobileAD">
            <div className="submitButtonRRQR3MobileContent">
              <CornerUpLeft
                color={"#028ed4"}
                size={35}
                onClick={() => { window.location.href = "/#/retrieve-record-mobile"; this.setState({ moreInfo: false, wasSentQuery: false, queryValue: undefined, ipfsObject: undefined, assetObj: undefined, result: "" }) }}
              />
            </div>
          </div>
          <RWebShare
            className="shareMenu"
            data={{
              text: "Check out my PRüF-verified asset!",
              url: this.state.URL,
              title: "Share Asset Link",
            }}
          >
            <div className="shareButtonMobileAD">
              <div className="submitButtonRRQR3MobileContent">
                <Share2
                  color={"#028ed4"}
                  size={35}
                />
              </div>
            </div>
          </RWebShare>
        </>
      )
    }

    this.handlePacket = async () => {
      let idxHash = window.sentPacket;

      this.setState({
        idxHash: window.sentPacket.idxHash,
        wasSentPacket: true,
        name: window.sentPacket.name,
        assetClass: window.sentPacket.assetClass
      })

      window.sentPacket = undefined;
      let hash;
      let assetClass; //BS:EXAMINE defined but never used (NEEDED)
      let status; //BS:EXAMINE defined but never used (NEEDED)

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

      return this.getIPFSJSONObject(window.utils.getIpfsHashFromBytes32(hash))

    }

    this._retrieveRecordQR = async (query) => {

      this.setState({ QRRR: undefined, assetFound: "" })
      const self = this;
      var ipfsHash;
      var tempResult;
      let idxHash;
      if (query) {
        let tempBool = await window.utils.checkAssetExistsBare(this.state.queryValue)
        if (tempBool) {
          idxHash = String(this.state.queryValue)
        } else { this.setState({ wasSentQuery: false, queryValue: undefined }); return this.setState({ alertBanner: "Asset does not exist!" }) }

      } else {
        idxHash = String(this.state.result)
      }
      this.setState({ idxHash: idxHash })
      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);
      if (idxHash.substring(0, 2) !== "0x") { return this.setState({ wasSentQuery: false, queryValue: undefined }) }
      await window.contracts.STOR.methods
        .retrieveShortRecord(idxHash)
        .call(
          // { from: window.addr },
          function (_error, _result) {
            if (_error) {
              console.log(_error)
              self.setState({ error: _error });
              self.setState({ resultQR: "" });
            } else {
              self.setState({ resultQR: Object.values(_result) })
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
                self.setState({ ipfs2: fullUrl, status: Object.values(_result)[0] });
              }
            }
          });

      window.assetClass = tempResult[2]
      let assetClassName = await window.utils.getACName(tempResult[2])

      window.assetInfo = {
        assetClass: tempResult[2],
        assetClassName: assetClassName,
        status: tempResult[0],
        idx: idxHash
      }
      await window.utils.resolveACFromID(tempResult[2])
      await this.getACData("id", window.assetClass)

      console.log(window.authLevel);

      await this.getIPFSJSONObject(ipfsHash);

      return this.setState({
        authLevel: window.authLevel,
        QRreader: false,
        moreInfo: true,
      })
    }

    this.handleQuery = async (data) => {
      if (data.substring(0, 2) !== "0x") {
        return this.setState({ alertBanner: "'" + data + "'" + " is not a proper IDX!" })
      }

      let tempBool = true//await window.utils.checkAssetExistsBare(data)
      if (tempBool) {
        this.setState({
          queryValue: data,
          URL: window.location.href,
          assetFound: "Asset Found!",
          wasSentQuery: true
        })
      }
      else {
        return this.setState({ assetFound: "Asset Not Found." })
      }

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
      baseURL: "https://indevapp.pruf.io/#/",
      error: undefined,
      URL: undefined,
      NRerror: undefined,
      result: [],
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
      resultQR: "",
      QRRR: undefined,
      assetFound: undefined,
      Checkbox: false,
      moreInfo: false,
      idxHash: undefined,
      idxHashRaw: undefined,
      runQuery: true,
      legacyMode: false,
    };

    this.handleScan = this.handleScan.bind(this)
    this.openImageDialog = this.openImageDialog.bind(this)
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    window.jdenticon_config = {
      hues: [196],
      lightness: {
        color: [0.36, 0.70],
        grayscale: [0.24, 0.82]
      },
      saturation: {
        color: 0.75,
        grayscale: 0.10
      },
      backColor: "#ffffffff"
    };

    let hashString = window.location.hash;
    if (hashString.includes("0x")) {
      let str = hashString.substring(hashString.indexOf("0x"), hashString.indexOf("0x") + 66)
      this.handleQuery(str)
    }

    this.setState({ runWatchDog: true })

    this.setState({ QRReader: false });
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    clearInterval(this.updateAssets);
    this.setState({ QRReader: false });
    this.setState({ runWatchDog: false });
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
          resultQR: data,
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

  handleError = (err) => {
    console.error(err)
    this.setState({ legacyMode: true })
  }

  openImageDialog() {
    this.refs.qrReader1.openImageDialog()
  }


  render() {//render continuously produces an up-to-date stateful document 

    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({ wasSentQuery: false, queryValue: undefined, Checkbox: false, help: false })
    }

    const QRReader = async () => {
      if (this.state.QRreader === false) {
        this.setState({ QRreader: true, assetFound: "" })
      }
      else {
        this.setState({ QRreader: false, Checkbox: false })
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

    const previewStyle = {
      height: 240,
      width: 320,
    }

    const _retrieveRecord = async () => {
      const self = this;
      var ipfsHash;
      var tempResult;
      let idxHash

      if (this.state.Checkbox === false) {
        idxHash = window.web3.utils.soliditySha3(
          String(this.state.type).replace(/\s/g, ''),
          String(this.state.manufacturer).replace(/\s/g, ''),
          String(this.state.model).replace(/\s/g, ''),
          String(this.state.serial).replace(/\s/g, '')
        );
        console.log("idxHash", idxHash);
        console.log("addr: ", window.addr);
      }

      else if (this.state.Checkbox === true) {
        idxHash = this.state.idxHashRaw;
        console.log("idxHash", idxHash);
        console.log("addr: ", window.addr);
      }

      this.setState({ idxHash: idxHash })

      let doesExist = await window.utils.checkAssetExistsBare(idxHash);

      if (!doesExist) {
        this.setState({ alertBanner: "Asset doesnt exist! Ensure data fields are correct before submission." })
        this.setState({ resultQR: "", accessPermitted: false, Checkbox: false, QRreader: false, VLresult: "" })
      }

      await window.contracts.STOR.methods
        .retrieveShortRecord(idxHash)
        .call(function (_error, _result) {
          if (_error) {
            console.log(_error)
            self.setState({ error: _error });
            self.setState({ result: "" });
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
      let assetClassName = await window.utils.getACName(tempResult[2])

      window.assetInfo = {
        assetClassName: assetClassName,
        assetClass: tempResult[2],
        status: await window.utils.getStatusString(String(tempResult[0])),
        idx: idxHash
      }
      await window.utils.resolveACFromID(tempResult[2])
      await this.getACData("id", window.assetClass)

      console.log(window.authLevel);

      await this.getIPFSJSONObject(ipfsHash);

      return this.setState({ authLevel: window.authLevel, moreInfo: true, })
    }

    return (
      <div>
        {this.state.moreInfo === false && this.state.QRreader === false && this.state.queryValue === undefined && (
          <div>
            <div>
              <div className="mediaLinkADHomeMobile">
                <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/' }} /></a>
              </div>
              <h2 className="formHeaderMobile">Search Assets</h2>
              <div className="mediaLinkClearForm">
                <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
              </div>
            </div>
            <Form className="formMobile" id="MainForm" onSubmit={submitHandler}>
              <div>
                {this.state.QRreader === false && (
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
                          required
                          onChange={(e) => this.setState({ idxHashRaw: e.target.value.trim() })}
                          size="lg"
                        />
                      </Form.Row>
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
                <Form.Row>
                  <div className="submitButtonRRMobile">
                    <div className="submitButtonContentMobile">
                      <ArrowRightCircle
                        onClick={() => { _retrieveRecord() }}
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
              </div>
            )}
          </div>
        )}


        {this.state.QRreader === true && (
          <div>
            <div>
              <div className="mediaLinkADHome">
                <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/' }} /></a>
              </div>
              <h2 className="formHeaderMobile">Search Assets</h2>
              <div className="mediaLinkBackMobile">
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
              {this.state.resultQR[2] !== "0" && (
                <div className="resultsMobile">
                  {this.state.assetFound}
                </div>
              )}
            </div>
          </div>
        )}

        {(this.state.moreInfo || this.state.wasSentQuery) && ( //conditional rendering
          <div>
            <div>
              <h2 className="assetDashboardHeaderMobile">Here's what we found: </h2>
            </div>
            <div className="assetDashboardMobile">
              {this.state.msgBanner !== undefined && (
                <ClickAwayListener onClickAway={() => { this.setState({ msgBanner: undefined }) }}>
                  <Alert className="alertBannerADMobile" key={1} variant="success" onClose={() => this.setState({ msgBanner: undefined })} dismissible>
                    {this.state.msgBanner}
                  </Alert>
                </ClickAwayListener>
              )}
              {this.state.assetObj !== undefined && (<>{this.generateAssetInfo(this.state.assetObj)}</>)}
              {this.state.assetObj === undefined && (<h4 className="loadingRRMobile">Loading Asset</h4>)}
            </div>
            {/* <div className="resultsMobile">
            </div> */}
          </div >
        )}
      </div>
    );
  }
}

export default RetrieveRecordMobile;
