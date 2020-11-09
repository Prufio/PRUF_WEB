import React from "react";
import Button from "react-bootstrap/Button";
import "./../index.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton';
import { RefreshCw, X, ChevronRight, CornerUpLeft, Home, Plus } from "react-feather";
import { QRCode } from 'react-qrcode-logo';
import Printer from '../Resources/Print'


class AssetDashboard extends React.Component {
  constructor(props) {
    super(props);


    this.updateAssets = setInterval(() => {
      if (this.state.assets !== window.assets && this.state.runWatchDog === true) {
        this.setState({ assets: window.assets })
      }

      if (this.state.hasLoadedAssets !== window.hasLoadedAssets && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssets: window.hasLoadedAssets })
      }

      if (this.state.hasNoAssets !== window.hasNoAssets && this.state.runWatchDog === true) {
        this.setState({ hasNoAssets: window.hasNoAssets })
      }
    }, 100)

    this.moreInfo = (e) => {
      if (e === "back") { return this.setState({ assetObj: {}, moreInfo: false, printQR: undefined }) }

      if (e.DisplayImage !== undefined && e.DisplayImage !== "") {
        this.setState({ selectedImage: e.DisplayImage })
      }
      else {
        this.setState({ selectedImage: "" })
      }
      this.setState({ assetObj: e, moreInfo: true, identicon: e.identicon })
      window.printObj = e;
      //this.setAC(e.assetClass)
    }

    this.setAC = async (AC) => {
      let acDoesExist;

      if (AC === "0" || AC === undefined) { return alert("Selected AC Cannot be Zero"), this.refresh() }
      else {
        if (
          AC.charAt(0) === "0" ||
          AC.charAt(0) === "1" ||
          AC.charAt(0) === "2" ||
          AC.charAt(0) === "3" ||
          AC.charAt(0) === "4" ||
          AC.charAt(0) === "5" ||
          AC.charAt(0) === "6" ||
          AC.charAt(0) === "7" ||
          AC.charAt(0) === "8" ||
          AC.charAt(0) === "9"
        ) {
          acDoesExist = await window.utils.checkForAC("id", AC);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.open('https://www.pruf.io')
          }

          this.setState({ assetClass: AC });
          await window.utils.resolveACFromID(AC)
          await window.utils.getACData("id", AC)

          await this.setState({ ACname: window.assetClassName });
        }

        else {
          acDoesExist = await window.utils.checkForAC("name", AC);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.open('https://www.pruf.io')
          }

          this.setState({ ACname: AC });
          await window.utils.resolveAC(AC);
          await this.setState({ assetClass: window.assetClass });
        }

        return this.setState({ assetClassSelected: true, acData: window.tempACData })
      }
    }

    this.sendPacket = (obj, menu, link) => {
      window.sentPacket = obj
      window.menuChange = menu
      window.location.href = '/#/' + link
    }

    this.newRecord = async () => {
      await window.utils.determineTokenBalance()
      console.log("IDholderBool", window.IDHolderBool)
      if (window.IDHolderBool === false && window.confirm("You are not authorized to mint asset tokens. If you are interested in getting authorized, click ok to route to our website for more information."))
      {
        window.open('https://www.pruf.io')
        return
      }
      else if (window.IDHolderBool === true)
      {
      window.menuChange = "NC"
      window.location.href = '/#/new-record-NC'
    }
    }

    this.refresh = () => {
      window.resetInfo = true;
      window.recount = true;
      this.setState({ moreInfo: false, assets: { descriptions: [], ids: [], assetClasses: [], statuses: [], names: [] } })
    }

    this.state = {
      addr: undefined,
      web3: null,
      APP: "",
      NP: "",
      STOR: "",
      AC_MGR: "",
      ECR_NC: "",
      ECR_MGR: "",
      AC_TKN: "",
      A_TKN: "",
      APP_NC: "",
      NP_NC: "",
      ECR2: "",
      authLevel: "",
      PIP: "",
      RCLR: "",
      showDescription: false,
      descriptionElements: undefined,
      assets: { descriptions: [], ids: [], assetClasses: [], statuses: [], names: [] },
      contractArray: [],
      hasLoadedAssets: false,
    };
  }

  componentDidMount() {
    this.setState({
      addr: window.addr,
      runWatchDog: true,
      assetTokenInfo: {}
    })
  }

  componentDidUpdate() {

    if (this.componentRef !== window.componentRef) {
      window.componentRef = this.componentRef
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {

    const generateAssetInfo = (obj) => {
      let images = Object.values(obj.photo)
      let text = Object.values(obj.text)
      let textNames = Object.keys(obj.text)

      const showImage = (e) => {
        console.log(this.state.selectedImage)
        console.log(e)
        this.setState({ selectedImage: e })
      }

      const _printQR = async () => {
        if (this.state.printQR === undefined) {
          this.setState({ printQR: true })
        }
        else {
          this.setState({ printQR: undefined })
        }
      }

      // const _printQRFile = async (obj) => {

      // }

      const generateThumbs = () => {
        let component = [];

        for (let i = 0; i < images.length; i++) {
          component.push(
            <button key={"thumb" + String(i)} value={images[i]} className="assetImageSelectorButton" onClick={() => { showImage(images[i]) }}>
              <img title="View Image" src={images[i]} className="imageSelectorImage" alt =""/>
            </button>
          )
        }

        return component
      }

      const generateTextList = () => {
        let component = [];
        
        for (let i = 0; i < text.length; i++) {
          if(textNames[i] !== "Description"){
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
          else{
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
                        onClick={() => { _printQR() }}
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
                            <QRCode
                              value={obj.idxHash}
                              size="150"
                              fgColor="#002a40"
                              logoWidth="35"
                              logoHeight="46"
                              logoImage="https://pruf.io/assets/images/pruf-u-logo-with-border-323x429.png"
                            />
                          </div>
                        </div>
                        <div className="displayFooterQR">
                          <div className="mediaLinkQRDisplay">
                            {/* <a className="mediaLinkQRDisplayContent" ><Save onClick={() => { _printQR()  }} /></a> */}
                            <Printer />
                            <a className="mediaLinkQRDisplayContent" ><X onClick={() => { _printQR() }} /></a>
                          </div>
                        </div>
                      </div>
                    )}

                    <button className="assetImageButtonSelected">
                      {this.state.selectedImage !== "" ?
                        (<img title="View Image" src={this.state.selectedImage} className="assetImageSelected" alt =""/>)
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
                    <div className="cardSelectedIdxForm">
                      <h4 className="cardIdxSelected">IDX: {obj.idxHash}</h4>
                    </div>
                    <div className="cardDescriptionFormSelected">
                      {generateTextList()}
                    </div>
                  </div>
                  {this.state.moreInfo && (
                    <div className="cardButton2">
                      <div className="cardButton2Content">
                        <CornerUpLeft
                          size={35}
                          onClick={() => { this.moreInfo("back") }}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div >
            </div >
          </div>
          <div
            className="assetSelectedRouter"
          >
            <Nav className="headerSelected">
              <li>
                <Button variant="selectedImage" onClick={() => { this.sendPacket(obj, "NC", "transfer-asset-NC") }}>Transfer</Button>
              </li>
              <li>
                <Button variant="selectedImage" onClick={() => { this.sendPacket(obj, "NC", "import-asset-NC") }}>Import</Button>
              </li>
              <li>
                <DropdownButton title="Export" drop="up" variant="selectedImage">
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "export-asset-NC") }}>Export</Dropdown.Item>
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "discard-asset-NC") }}>Discard</Dropdown.Item>
                </DropdownButton>
              </li>
              <li>
                <Button variant="selectedImage" onClick={() => { this.sendPacket(obj, "NC", "manage-escrow-NC") }}>Escrow</Button>
              </li>
              <li>
                <DropdownButton title="Modify" drop="up" variant="selectedImage">
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "modify-record-status-NC") }}>Modify Status</Dropdown.Item>
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "decrement-counter-NC") }}>Decrement Counter</Dropdown.Item>
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "modify-asset-information-NC") }}>Modify Asset Info</Dropdown.Item>
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "add-note-NC") }}>Add Note</Dropdown.Item>
                  <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "NC", "force-modify-record-NC") }}>Modify Rightsholder</Dropdown.Item>
                </DropdownButton>
              </li>
            </Nav>
          </div>
        </div>


      )
    }

    const generateAssetDash = (obj) => {
      if (obj.names.length > 0) {
        let component = [];

        for (let i = 0; i < obj.ids.length; i++) {
          console.log()
          //console.log(i, "Adding: ", window.assets.descriptions[i], "and ", window.assets.ids[i])
          component.push(
            <div key={"asset" + String(i)}>
              <style type="text/css"> {`
  
              .card {
                width: 100%;
                max-width: 100%;
                height: 12rem;
                max-height: 100%;
                background-color: #005480;
                margin-top: 0.3rem;
                color: white;
                word-break: break-all;
              }
  
             `}
              </style>
              <div className="card" >
                <div className="row no-gutters">
                  <div className="col-auto">
                    <button
                      className="assetImageButton"
                      // value={
                      //   JSON.stringify()}
                      onClick={() => {
                        this.moreInfo({
                          countPair: obj.countPairs[i],
                          idxHash: obj.ids[i],
                          descriptionObj: obj.descriptions[i],
                          DisplayImage: obj.displayImages[i],
                          name: obj.names[i],
                          assetClass: obj.assetClasses[i],
                          assetClassName: obj.assetClassNames[i],
                          status: obj.statuses[i],
                          statusNum: obj.statusNums[i],
                          Description: obj.descriptions[i].text.Description,
                          note: obj.notes[i],
                          text: obj.descriptions[i].text,
                          photo: obj.descriptions[i].photo,
                          identicon: obj.identiconsLG[i]
                        })
                      }}
                    >
                      {obj.displayImages[i] !== "" && (
                        <img title="View Asset" src={obj.displayImages[i]} className="assetImage" alt =""/>
                      )}
                      {obj.displayImages[i] === "" && (
                        <>{obj.identicons[i]}</>
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="cardName">Name: {obj.names[i]}</p>
                    <p className="cardAc">Asset Class: {obj.assetClassNames[i]}</p>
                    <p className="cardStatus">Status: {obj.statuses[i]}</p>
                    <h4 className="cardIdx">IDX: {obj.ids[i]}</h4>
                    <br></br>
                    <div className="cardDescriptionForm"><h4 className="cardDescriptionForm">Description : 
                    {obj.descriptions[i].text.Description !== undefined && (
                        obj.descriptions[i].text.Description.replace(/111APOST111/gi, "'").replace(/111QUOTE111/gi, '"')
                      )}
                    </h4></div>
                  </div>
                  <div className="cardButton">
                    <div className="cardButtonContent">
                      <ChevronRight
                        onClick={() => {
                          this.moreInfo({
                            countPair: obj.countPairs[i],
                            idxHash: obj.ids[i],
                            descriptionObj: obj.descriptions[i],
                            DisplayImage: obj.displayImages[i],
                            name: obj.names[i],
                            assetClass: obj.assetClasses[i],
                            assetClassName: obj.assetClassNames[i],
                            status: obj.statuses[i],
                            statusNum: obj.statusNums[i],
                            description: obj.descriptions[i].text.Description,
                            note: obj.notes[i],
                            text: obj.descriptions[i].text,
                            photo: obj.descriptions[i].photo,
                            identicon: obj.identiconsLG[i]
                          })
                        }}
                        size={35}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          );
        }

        return component
      }

      else { return <></> }

    }

    return (

      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="assetDashboardHeader">Your Assets</h2>
          <div className="mediaLinkADRefresh">
            <a className="mediaLinkContentADRefresh" ><RefreshCw onClick={() => { this.refresh() }} /></a>
          </div>
          <div className="mediaLinkADAddAsset">
            <a className="mediaLinkContentADAddAsset" ><Plus size={35} onClick={() => { this.newRecord() }} /></a>
          </div>
        </div>
        <div className="assetDashboard">
          {!this.state.hasNoAssets && this.state.hasLoadedAssets && !this.state.moreInfo && (<>{generateAssetDash(this.state.assets)}</>)}
          {!this.state.hasNoAssets && this.state.hasLoadedAssets && this.state.moreInfo && (<>{generateAssetInfo(this.state.assetObj)}</>)}
          {!this.state.hasNoAssets && !this.state.hasLoadedAssets && (<div className="text"><h2 className="loading">Loading Assets</h2></div>)}
          {this.state.hasNoAssets && (<div className="text"><h2>No Assets Held by User</h2></div>)}
        </div>
        <div className="assetDashboardFooter">
        </div>
      </div >

    );
  }
}

export default AssetDashboard;
