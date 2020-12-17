import React from "react";
import "./../index.css";
import { RefreshCw, ChevronRight, CornerUpLeft, Home, Plus, Copy } from "react-feather";
import Card from "react-bootstrap/Card";
import Jdenticon from 'react-jdenticon';


class AssetDashboardMobile extends React.Component {
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

      if (e.DisplayImage !== undefined && e.DisplayImage !== "" && e.DisplayImage !== null) {
        this.setState({ selectedImage: e.DisplayImage })
      }
      else {
        this.setState({ selectedImage: "" })
      }
      this.setState({ assetObj: e, moreInfo: true, identicon: e.identicon })
      window.printObj = e;
    }

    this.setAC = async (AC) => {
      let acDoesExist;

      if (AC === "0" || AC === undefined) { 
        this.refresh() 
        return alert("Selected AC Cannot be Zero") 
      }
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
      if (window.IDHolderBool === false && window.confirm("You are not currently authorized to mint asset tokens. If you are interested in getting authorized, click ok to talk to one of our agents."))
      {
        window.open("https://t.me/prufteam", "_blank")
        return
      }
      else if (window.IDHolderBool === true)
      {
      window.menuChange = "mobile"
      window.location.href = '/#/new-record-mobile'
    }
    }

    this.refresh = () => {
      window.resetInfo = true;
      window.recount = true;
      this.setState({ hasLoadedAssets: false, moreInfo: false, assets: { descriptions: [], ids: [], assetClasses: [], statuses: [], names: [] } })
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
      hasNoAssets: false,
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

  componentWillUnmount() {
    this.setState({ runWatchDog: false });
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

      // const _printQR = async () => {
      //   if (this.state.printQR === undefined) {
      //     this.setState({ printQR: true })
      //   }
      //   else {
      //     this.setState({ printQR: undefined })
      //   }
      // }

      // const _printQRFile = async (obj) => {

      // }

      const renderIcon = () => {
        return <Jdenticon size="340px" value={obj.idxHash} />
      }

      const generateThumbs = () => {
        let component = [];

        for (let i = 0; i < images.length; i++) {
          component.push(
            <button key={"button" + String(i)} value={images[i]} className="assetImageSelectorButtonMobile" onClick={() => { showImage(images[i]) }}>
              <img src={images[i]} className="imageSelectorImageMobile" alt="imageSelectorImage" />
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
          <Card style={{ height: '370px', width: '340px', overflowY: "auto", overflowX: "hidden", backgroundColor: "#005480", color: "white" }}>
            {this.state.selectedImage !== "" ?
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
              <div className="cardCopyButtonMobile">
                  <div className="cardCopyButtonMobileContent">
                    <Copy
                      size={15}
                      onClick={() => { navigator.clipboard.writeText(obj.idxHash) }}
                    />
                  </div>
                </div>
              <h4 className="cardDescriptionSelectedContentMobile">
                {obj.idxHash}
              </h4>
              </Card.Title>
              <Card.Title>{generateTextList()}</Card.Title>
              <Card.Title><h4 className="cardDescriptionSelectedMobile">****End of Asset****</h4></Card.Title>
              {/* <Card.Title><h4 h4 className="cardDescriptionSelectedMobile">*********************</h4></Card.Title> */}
            </Card.Body>
          </Card>
          <div className="backButtonMobileAD">
            <div className="submitButtonRRQR3MobileContent">
              <CornerUpLeft
                color={"#028ed4"}
                size={35}
                onClick={() => { this.setState({ moreInfo: false, Checkbox: false, QRreader: false, ipfsObject: undefined, idxHash: undefined }) }}
              />
            </div>
          </div>
        </>
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
                width: 340px;
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
                        <img title="View Asset" src={obj.displayImages[i]} className="assetImage" alt="" />
                      )}
                      {obj.displayImages[i] === "" && (
                        <>{obj.identicons[i]}</>
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="cardNameMobile ">Name: {obj.names[i]}</p>
                    <p className="cardAcMobile ">Asset Class: {obj.assetClassNames[i]}</p>
                    <p className="cardStatusMobile ">Status: {obj.statuses[i]}</p>
                    <h4 className="cardIdxMobile ">IDX: {obj.ids[i].substring(0, 22) + "..." + obj.ids[i].substring(60, 66)}</h4>
                    <br></br>
                  </div>
                  <div className="cardButtonMobile">
                    <div className="submitButtonContentMobile">
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
          <h2 className="assetDashboardHeaderMobile">Your Assets</h2>
          <div className="mediaLinkADRefreshMobile">
            <a className="mediaLinkContentADRefreshMobile" ><RefreshCw onClick={() => { this.refresh() }} /></a>
          </div>
          <div className="mediaLinkADAddAssetMobile">
            <a className="mediaLinkContentADAddAsset" ><Plus size={35} 
            onClick={() => { this.newRecord() }} 
            // onClick={() => { alert("This functionality has been disabled until Alpha-Testing begins") }}
            />
            </a>
          </div>
          {window.addr === undefined && (
            <div className="resultsMobile">
              <h2>User address unreachable</h2>
              <h3>Please 
                <a
                    onClick={() => {
                    this.setState({ userMenu: undefined })
                    if (window.ethereum) { window.ethereum.enable() }
                    else { alert("You do not currently have a Web3 provider installed, we recommend MetaMask"); }
                    }
                    }
                    className="userDataLink">
                    Log In
                </a> 
                  to web3 provider.
                  </h3>
            </div>
          )}
        </div>
        <div className="assetDashboardMobile">
          {!this.state.hasNoAssets && this.state.hasLoadedAssets && !this.state.moreInfo && (<>{generateAssetDash(this.state.assets)}</>)}
          {!this.state.hasNoAssets && this.state.hasLoadedAssets && this.state.moreInfo && (<>{generateAssetInfo(this.state.assetObj)}</>)}
          {!this.state.hasNoAssets && !this.state.hasLoadedAssets && (<h2 className="loadingHome">Loading Assets</h2>)}
          {this.state.hasNoAssets && (<h2 className="textAD">No Assets Held by User</h2>)}
        </div>
        <div className="assetDashboardFooterMobile">
        </div>
      </div >

    );
  }
}

export default AssetDashboardMobile;
