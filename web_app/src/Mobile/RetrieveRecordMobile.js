import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import QrReader from 'react-qr-reader'
import Jdenticon from 'react-jdenticon';
import { CornerUpLeft, Home, XSquare, Grid, ArrowRightCircle } from "react-feather";


class RetrieveRecordMobile extends Component {
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

          },
          moreInfo: true
        })
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

    this.generateAssetInfo = (obj) => {
      let images = Object.values(obj.photo)
      let text = Object.values(obj.text)
      let imageNames = Object.keys(obj.photo)
      let textNames = Object.keys(obj.text)
      let status = "";

      if (obj.status === "50") { status = "In Locked Escrow" }
      else if (obj.status === "51") { status = "Transferrable" }
      else if (obj.status === "52") { status = "Non-Transferrable" }
      else if (obj.status === "53") { status = "MARKED STOLEN" }
      else if (obj.status === "54") { status = "MARKED LOST" }
      else if (obj.status === "55") { status = "Transferred/Unclaimed" }
      else if (obj.status === "56") { status = "In Escrow" }
      else if (obj.status === "57") { status = "Escrow Ended" }
      else if (obj.status === "58") { status = "Locked Escrow Ended" }
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
      else if (obj.status === "7") { status = "Escrow Ended" }

      else { status = "Invalid Status Retrieved" }

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
            <button value={images[i]} class="assetImageSelectorButtonMobile" onClick={() => { showImage(images[i]) }}>
              <img src={images[i]} className="imageSelectorImageMobile" />
            </button>
          )
        }

        return component

      }

      const generateTextList = () => {
        let component = [];

        for (let i = 0; i < text.length; i++) {
          component.push(
            <>
              <h4 className="cardDescriptionSelected">
                {textNames[i]}: <h4 className="cardDescriptionSelectedContentMobile">{text[i]}</h4>
              </h4>
            </>
          )
        }

        return component
      }

      return (
        <>
          <Card style={{ width: '360px', overflowY: "auto", overflowX: "hidden", backgroundColor: "#005480", color: "white" }}>
            {this.state.selectedImage !== undefined ?
              (<Card.Img style={{ width: '340px', height: "340px" }} variant="top" src={this.state.selectedImage} />)
              : (<>{renderIcon()}</>)}

            <Card.Body>
              <div className="imageSelectorMobile">
                {generateThumbs()}
              </div>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">Name : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.name}</h4></Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">Asset Class : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.assetClass}</h4></Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">Asset Status : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.status}</h4></Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">ID : </h4><h4 className="cardDescriptionSelectedContentMobile">{obj.idxHash}</h4></Card.Title>
              <Card.Title>{generateTextList()}</Card.Title>
            </Card.Body>
          </Card>
          <div className="submitButtonRRQR3Mobile">
            <div className="submitButtonRRQR3MobileContent">
              <CornerUpLeft
                color={"#028ed4"}
                size={35}
                onClick={() => { this.setState({ moreInfo: false, Checkbox: false, QRreader: false }) }}
              />
            </div>
          </div>
        </>
      )
    }

    const renderIcon = () => {
      return <Jdenticon size="340" value={this.state.idxHash} />
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

      return this.getIPFSJSONObject(window.utils.getIpfsHashFromBytes32(hash))

    }

    this._retrieveRecordQR = async () => {

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
          // { from: window.addr },
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
                self.setState({ ipfs2: fullUrl, status: Object.values(_result)[0] });
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
        QRreader: undefined
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
      result: "",
      QRRR: undefined,
      assetFound: undefined,
      Checkbox: false,
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


  render() {//render continuously produces an up-to-date stateful document  
    const self = this;




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

    const _retrieveRecord = async () => {
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

      let doesExist = await window.utils.checkAssetExists(idxHash);

      if (!doesExist) {
        return alert("Asset doesnt exist! Ensure data fields are correct before submission."),
          this.setState({ result: "", accessPermitted: false, Checkbox: false, QRreader: false, VLresult: "" })
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

    // if (this.state.wasSentPacket === true) {
    //   return (
    //     <div>
    //       <div>
    //       <div>
    //           <div className="mediaLinkADHomeMobile">
    //             <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/' }} /></a>
    //           </div>
    //           <h2 className="formHeaderMobile">Here's What we Found</h2>
    //           <div className="mediaLinkClearForm">
    //             <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { document.getElementById("MainForm").reset() }} /></a>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="assetDashboard">
    //         {this.state.assetObj !== undefined && (<>{this.generateAssetInfo(this.state.assetObj)}</>)}
    //         {this.state.assetObj === undefined && (<h4 className="loading">Loading Asset</h4>)}
    //       </div>
    //       <div className="assetDashboardFooter">
    //       </div>
    //     </div >
    //   )
    // }
    return (
      <div>
        {!this.state.moreInfo && this.state.QRreader === false && (
          <div>
            <div>
              <div className="mediaLinkADHomeMobile">
                <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/' }} /></a>
              </div>
              <h2 className="formHeaderMobile">Search Assets</h2>
              <div className="mediaLinkClearForm">
                <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { document.getElementById("MainForm").reset() }} /></a>
              </div>
            </div>
            <Form className="formMobile" id="MainForm">
              <div>
                {this.state.QRreader === false && (
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
                          required
                          onChange={(e) => this.setState({ idxHashRaw: e.target.value })}
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
                <Form.Row>
                  <div className="submitButtonRRMobile">
                    <div className="submitButtonRRContent">
                      <ArrowRightCircle
                        onClick={() => { _retrieveRecord() }}
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
              </div>
            </Form>
            {this.state.QRreader === false && (
            <div className="resultsMobile">

            </div>
            )}
          </div>
        )}


        {this.state.QRreader === true && (
          <div>
            <div>
              <div className="mediaLinkADHome">
                <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/' }} /></a>
              </div>
              <h2 className="formHeaderMobile">Search Assets</h2>
              <div className="mediaLinkBackMobile">
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
              {this.state.result[2] !== "0" && (
                <div className="resultsMobile">
                  {this.state.assetFound}
                </div>
              )}
            </div>
          </div>
        )}

        {this.state.moreInfo && ( //conditional rendering
          <div>
            <div>
              <h2 className="assetDashboardHeaderMobile">Here's what we found: </h2>
            </div>
            <div className="assetDashboardMobile">
              {this.state.assetObj !== undefined && (<>{this.generateAssetInfo(this.state.assetObj)}</>)}
              {this.state.assetObj === undefined && (<h4 className="loading">Loading Asset</h4>)}
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
