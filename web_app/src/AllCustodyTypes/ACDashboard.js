import React from "react";
import Button from "react-bootstrap/Button";
import "./../index.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton';
import { RefreshCw, X, ChevronRight, CornerUpLeft, Home, Plus, Copy } from "react-feather";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { QRCode } from 'react-qrcode-logo';
import { isMobile } from "react-device-detect";
import Printer from '../Resources/Print'


class ACDashboard extends React.Component {
  constructor(props) {
    super(props);

    //watchdog to keep ACNs up-to-date
    this.updateAssetClasses = setInterval(() => {
        if (this.state.assetClasses !== window.assetClasses && this.state.runWatchDog === true) {
          console.log("RESETTING ACS")
          this.setState({ assetClasses: window.assetClasses })
        }
  
        if (this.state.hasLoadedAssetClasses !== window.hasLoadedAssetClasses && this.state.runWatchDog === true) {
          this.setState({ hasLoadedAssetClasses: window.hasLoadedAssetClasses })
        }
  
        if (this.state.hasNoAssetClasses !== window.hasNoAssetClasses && this.state.runWatchDog === true) {
          this.setState({ hasNoAssetClasses: window.hasNoAssetClasses })
        }
      
    }, 150)

    this.moreInfo = (e) => {
      if (e === "back") { return this.setState({ assetClassObj: {}, moreInfo: false, printQR: undefined }) }

      if (e.DisplayImage !== undefined && e.DisplayImage !== "") {
        this.setState({ selectedImage: e.DisplayImage })
      }
      else {
        this.setState({ selectedImage: "" })
      }
      this.setState({ assetClassObj: e, moreInfo: true, identicon: e.identicon })
      window.printObj = e;
      //this.setAC(e.assetClass)
    }

    this.setAC = async (AC) => {
      let acDoesExist;

      if (AC === "0" || AC === undefined) {
        this.refresh() 
        return alert("Selected AC Cannot be Zero")
        }
      else {
        if (
          isNaN(AC)
        ) {
          acDoesExist = await window.utils.checkForAC("name", AC);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.open('https://www.pruf.io')
          }

          this.setState({ ACname: AC });
          await window.utils.resolveAC(AC);
          await this.setState({ assetClass: window.assetClass });

        }

        else {
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
        
        return this.setState({ assetClassSelected: true, acData: window.tempACData })
      }
    }

    this.sendPacket = (obj, menu, link) => {
      window.sentPacket = obj
      window.menuChange = menu
      window.location.href = '/#/' + link
    }

    this.refresh = () => {
      window.resetInfo = true;
      window.recount = true;
      this.setState({ hasLoadedAssetClasses: false, moreInfo: false, assetClasses: { ids: [], names: [], discounts: [], custodyTypes: [], roots: [], identicons: [], identiconsLG: [], exData: []} })
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
      assetClasses: { ids: [], names: [], exData: [], discounts: [], roots: [], identicons: [], identiconsLG: [], custodyTypes: []},
      contractArray: [],
      hasLoadedAssets: false,
      hasNoAssets: false,
      runWatchDog: false
    };
  }

  componentDidMount() {
    window.jdenticon_config = {
      hues: [250],
      lightness: {
          color: [0.51, 0.66],
          grayscale: [0.36, 0.50]
      },
      saturation: {
          color: 1.00,
          grayscale: 1.00
      },
      backColor: "#fff"
  };
    this.setState({
      addr: window.addr,
      runWatchDog: true,
      assetTokenInfo: {},
      hasLoadedAssetClasses: false,
      hasNoAssetClasses: true
    })
  }

  componentDidUpdate() {

    if (this.componentRef !== window.componentRef) {
      window.componentRef = this.componentRef
    }
  }

  componentWillUnmount() {
    clearInterval(this.updateAssetClasses)
    this.setState({ runWatchDog: false });
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {

     const generateAssetClassInfo = (obj) => {

        return (
          <div key="selectedAsset">
            <div>
              <div className="assetClassDashboardSelected">
                <style type="text/css"> {`
  
              .card {
                width: 100%;
                max-width: 100%;
                height: 30rem;
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
                margin-top: -27rem;
                margin-left: -0.8rem;
                font-weight: bold;
                font-size: 1.46rem;
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

                      <button className="assetImageButtonSelected">
                        <>{obj.identicon}</>
                      </button>
                      <p className="cardNameSelected">Name: {obj.assetClassName}</p>
                      <p className="cardAcSelected">Node ID: {obj.id}</p>
                      <p className="cardStatusSelected">Node Root: {obj.root}</p>
                      <p className="cardStatusSelected">Custody Type: {obj.custodyType}</p>
                      <ProgressBar className ="ACProgressBar">
                        <ProgressBar variant="success" label={"Price Share: " + String(Number(obj.discount)/100) + "%"} now={obj.discount/100} key={1} />
                        {/* <ProgressBar variant="successs" label={obj.discount.substring(0,2)+"%"} now={Number(obj.discount)/100-51} key={2} /> */}
                      </ProgressBar>
                      <div className="cardDescriptionFormSelectedAC">
                      </div>
                    </div>
                    {this.state.moreInfo && (
                      <div className="cardButton3">
                        <div className="cardButton3Content">
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
              className="ACSelectedRouter"
            >
              <Nav className="headerSelected">
                <li>
                    <Button variant="selectedImage" onClick={() => { this.sendPacket(obj, "ACAdmin", "add-user ") }}>Authorize User</Button>
                </li>
                <li>
                  <Button variant="selectedImage" onClick={() => { this.sendPacket(obj, "ACAdmin", "enable-contract") }}>Enable Contract</Button>
                </li>
                <li>
                  <Button variant="selectedImage" onClick={() => { this.sendPacket(obj, "ACAdmin", "transfer-ac") }}>Transfer</Button>
                </li>
                <li>
                  <DropdownButton title="Modify" drop="up" variant="selectedImage">
                    <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "ACAdmin", "update-ac-name") }}>Update Name</Dropdown.Item>
                    <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "ACAdmin", "set-costs") }}>Set Costs</Dropdown.Item>
                    <Dropdown.Item id="header-dropdown" as={Button} variant="selectedAsset" onClick={() => { this.sendPacket(obj, "ACAdmin", "increase-ac-share") }}>Increase Share</Dropdown.Item>
                  </DropdownButton>
                </li>
              </Nav>
            </div>
          </div>
        )
      }

    const generateAssetClassDash = (obj) => {
      if (obj.ids.length > 0) {
        //console.log(obj)
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
                      onClick={() => {
                        this.moreInfo({
                          assetClassName: obj.names[i],
                          id: obj.ids[i],
                          discount: obj.discounts[i],
                          root: obj.roots[i],
                          identicon: obj.identiconsLG[i],
                          custodyType: obj.custodyTypes[i]
                        })
                      }}
                    >
                        <>{obj.identicons[i]}</>
                    </button>
                  </div>
                  <div>
                    <p className="cardName">Name: {obj.names[i]}</p>
                    <p className="cardAc">Node ID: {obj.ids[i]}</p>
                    <p className="cardStatus">Node Root: {obj.roots[i]}</p>
                    <p className="cardStatus">Custody Type: {obj.custodyTypes[i]}</p>
                    <h4 className="cardIdx">Share Percentage: {obj.discounts[i].substring(0,2)}%</h4>
                    <div className="cardDescriptionForm"></div>
                  </div>
                  <div className="cardButton">
                    <div className="cardButtonContent">
                      <ChevronRight
                        onClick={() => {
                          this.moreInfo({
                            assetClassName: obj.names[i],
                            id: obj.ids[i],
                            discount: obj.discounts[i],
                            root: obj.roots[i],
                            identicon: obj.identiconsLG[i],
                            custodyType: obj.custodyTypes[i]
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
          <h2 className="assetDashboardHeader">Your AC Nodes</h2>
          <div className="mediaLinkADRefresh">
            <a className="mediaLinkContentADRefresh" ><RefreshCw onClick={() => { this.refresh() }} /></a>
          </div>
{/*           <div className="mediaLinkADAddAsset">
            <a className="mediaLinkContentADAddAsset" ><Plus size={35}
              onClick={() => { this.newACNode() }} 
              // onClick={() => { alert("This functionality has been disabled until Alpha-Testing begins") }} 
              />
            </a>
          </div> */}
        </div>
        <div className="ACDashboard">
          {!this.state.hasNoAssetClasses && this.state.hasLoadedAssetClasses && !this.state.moreInfo && (<>{generateAssetClassDash(this.state.assetClasses)}</>)}
          {!this.state.hasNoAssetClasses && this.state.hasLoadedAssetClasses && this.state.moreInfo && (<>{generateAssetClassInfo(this.state.assetClassObj)}</>)}
          {!this.state.hasNoAssetClasses && !this.state.hasLoadedAssetClasses && (<h2 className="loadingAD">Loading AC NodeKeys</h2>)}
          {this.state.hasNoAssetClasses && (<h2 className="textAD">No NodeKeys Held by User</h2>)}
        </div>
        <div className="assetDashboardFooter">
        </div>
      </div >

    );
  }
}

export default ACDashboard;
