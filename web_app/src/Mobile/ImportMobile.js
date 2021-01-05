import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, ArrowRightCircle, CheckCircle, HelpCircle } from "react-feather";
import { ClickAwayListener } from '@material-ui/core';
import Alert from "react-bootstrap/Alert";


class ImportMobile extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.updateAssets = setInterval(() => {
      if (this.state.assets !== window.assets && this.state.runWatchDog === true) {
        this.setState({ assets: window.assets })
      }

      if (this.state.hasLoadedAssets !== window.hasLoadedAssets && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssets: window.hasLoadedAssets })
      }
    }, 150)

    this.mounted = false;
    this.state = {
      addr: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
      resultIA: "",
      assetClass: undefined,
      CountDownStart: "",
      ipfs1: "",
      txHash: "",
      txStatus: false,
      isNFA: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      transaction: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      hasLoadedAssets: false,
      help: false
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
    if (window.sentPacket !== undefined) {

      if (Number(window.sentPacket.statusNum) !== 70) {
        console.log("SentPacketStatus :", window.sentPacket.status)
        alert("Asset is not exported! Owner must export the assset in order to import.");
        window.sentPacket = undefined;
        return window.location.href = "/#/asset-dashboard-mobile"
      }

      this.setState({ name: window.sentPacket.name })
      this.setState({ idxHash: window.sentPacket.idxHash })
      this.setState({ packetAssetClass: window.sentPacket.assetClass })
      this.setState({ status: window.sentPacket.status })



      window.sentPacket = undefined
      this.setState({ wasSentPacket: true })
    }

    this.setState({ runWatchDog: true })
  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    clearInterval(this.updateAssets);
    this.setState({ runWatchDog: false });
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const _setAC = async () => {
      let acDoesExist;
      let destinationACData;
      this.setState({ txHash: "" })

      if (this.state.selectedAssetClass === "0" || this.state.selectedAssetClass === undefined) { return this.setState({ alertBanner: "Selected AC Cannot be Zero" }) }
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

          if (Number(resArray[0]) !== 70) {
            this.setState({ alertBanner: "Asset is not exported! Owner must export the assset in order to import." });
            window.sentPacket = undefined;
            return window.location.href = "/#/asset-dashboard-mobile"
          }

          console.log(destinationACData.root)

          if (resArray[1] !== destinationACData.root) {
            this.setState({ alertBanner: "Import destination AC must have same root as origin!" });
            window.sentPacket = undefined;
            return window.location.href = "/#/asset-dashboard-mobile"
          }
        }
        this.setState({ assetClassSelected: true, acData: window.tempACData, txHash: "" });
        return window.assetClass = undefined;
      }
    }

    const clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: false, txHash: "", wasSentPacket: false, assetClassSelected: false, help: false })
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const submitHandler = (e) => {
      e.preventDefault();
    }

    const _checkIn = async (e) => {
      this.setState({ help: false, txHash: "", txStatus: false })
      console.log("Checking in with id: ", e)
      if (e === "null" || e === undefined) {
        this.setState({ alertBanner: "Please select an asset before submission." })
        return clearForm()
      }
      else if (e === "reset") {
        return window.resetInfo = true;
      }
      else if (e === "assetDash") {
        console.log("heading over to dashboard")
        return window.location.href = "/#/asset-dashboard-mobile"
      }

      let resArray = await window.utils.checkStats(window.assets.ids[e], [0, 2])
      console.log(resArray)

      if (Number(resArray[1]) === 0) {
        this.setState({
          QRreader: false,
        })
        this.setState({ alertBanner: "Asset does not exist! Ensure data fields are correct before submission." });
        return clearForm()
      }

      if (Number(resArray[0]) !== 70) {
        this.setState({
          QRreader: false,
        })
        this.setState({ alertBanner: "Asset is not exported! Owner must export the assset in order to import." });
        return clearForm()
      }

      let destinationACData = await window.utils.getACData("id", this.state.assetClass);

      let originACRoot = window.assets.assetClasses[e]
      console.log(originACRoot)

      console.log(destinationACData.root)
      if (originACRoot !== destinationACData.root) {
        this.setState({
          QRreader: false,
        })
        clearForm()
        return this.setState({ alertBanner: "Import destination AC must have same root as origin!" })
      }

      this.setState({ selectedAsset: e })
      console.log("Changed component idx to: ", window.assets.ids[e])

      return this.setState({
        currentAssetClass: window.assets.assetClasses[e],
        idxHash: window.assets.ids[e],
        name: window.assets.descriptions[e].name,
        photos: window.assets.descriptions[e].photo,
        text: window.assets.descriptions[e].text,
        description: window.assets.descriptions[e],
        status: window.assets.statuses[e],
        note: window.assets.notes[e]
      })
    }

    const _importAsset = async () => {

      this.setState({ help: false })
      if (this.state.selectedAsset === undefined && !this.state.wasSentPacket) {
        this.setState({ alertBanner: "Please select an asset before submission." });
        return clearForm()
      }
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ resultIA: "" })
      this.setState({ transaction: true })

      var idxHash = this.state.idxHash;

      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);

      await window.contracts.APP_NC.methods
        .$importAsset(idxHash, this.state.assetClass)
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false, wasSentPacket: false });
          this.setState({ alertBanner: "Something went wrong!" })
          clearForm();
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          window.resetInfo = true;
          if (self.state.wasSentPacket) {
            return window.location.href = '/#/asset-dashboard-mobile'
          }
          //Stuff to do when tx confirms
        });
      console.log(this.state.txHash);

      await this.setState({
        idxHash: "",
        accessPermitted: false
      })

      return clearForm();
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeaderMobile">Import Asset</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
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
          {window.addr > 0 && !this.state.assetClassSelected && (
            <>
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
            </>
          )}
          {window.addr > 0 && this.state.assetClassSelected && (
            <div>
              <>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridAsset">
                    <Form.Label className="formFont"> Select an Asset to Modify :</Form.Label>
                    {!this.state.wasSentPacket && (
                      <>
                        {this.state.transaction === false && (
                          <Form.Control
                            as="select"
                            size="lg"
                            onChange={(e) => { _checkIn(e.target.value) }}

                          >
                            {this.state.hasLoadedAssets && (
                              <optgroup className="optgroup">
                                {window.utils.generateAssets()}
                              </optgroup>)}
                            {!this.state.hasLoadedAssets && (
                              <optgroup>
                                <option value="null">
                                  Loading Assets...
                           </option>
                              </optgroup>)}
                          </Form.Control>)}
                        {this.state.transaction === true && (
                          <Form.Control
                            as="select"
                            size="lg"
                            disabled
                          >
                            <optgroup className="optgroup">
                              <option>Importing "{this.state.idxHash.substring(0, 18) + "..." + this.state.idxHash.substring(48, 66)}"</option>
                            </optgroup>
                          </Form.Control>)}
                      </>
                    )}
                    {this.state.wasSentPacket && (
                      <Form.Control
                        as="select"
                        size="lg"
                        onChange={(e) => { _checkIn(e.target.value) }}
                        disabled
                      >
                        <optgroup>
                          <option value="null">
                            Importing "{this.state.name}" Clear Form to Select Different Asset
                           </option>
                        </optgroup>
                      </Form.Control>
                    )}
                  </Form.Group>
                </Form.Row>
                {this.state.transaction === false && (
                  <>
                    <Form.Row>
                      <div>
                        <Form.Label className="costText">
                          Cost to import into AC {this.state.selectedAssetClass}: {Number(window.costs.newAsset) / 1000000000000000000} PRüF
                          </Form.Label>
                        <div className="submitButtonRRMobile">
                          <div className="submitButtonContent">
                            <CheckCircle
                              onClick={() => { _importAsset() }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mediaLinkHelp">
                        <div className="mediaLinkHelpContent">
                          <HelpCircle
                            onClick={() => { help() }}
                          />
                        </div>
                      </div>
                    </Form.Row>
                    {this.state.help === true && (
                      <div className="explainerTextBoxMobile">
                        Importing an asset requires that the asset has been exported from it's previous asset class, and is being imported into an asset class
                        within the same catergory. Functionally, importing an asset updates an asset's asset class to whichever is selected by the asset's owner.
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          )}
        </Form>
        {this.state.transaction === false && this.state.txHash === "" && (
          <div className="assetSelectedResultsMobile">
            {this.state.alertBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                <Alert className="alertBannerMobile" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                  {this.state.alertBanner}
                </Alert>
              </ClickAwayListener>
            )}
            <Form.Row>
              {this.state.idxHash !== undefined && (
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContentMobile">{this.state.idxHash.substring(0, 18) + "..." + this.state.idxHash.substring(48, 66)}</span> </div>
                  <div className="assetSelectedContentHead">Asset Name: <span className="assetSelectedContentMobile">{this.state.name}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContentMobile">{this.state.currentAssetClass}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContentMobile">{this.state.status}</span> </div>
                  {this.state.assetClassSelected === true && (
                    <div className="assetSelectedContentHead">Importing Asset Class: <span className="assetSelectedContentMobile">{this.state.selectedAssetClass}</span> </div>
                  )}
                </Form.Group>
              )}
            </Form.Row>
          </div>
        )}
        {this.state.transaction === true && (

          <div className="resultsMobile">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>)}
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
    );
  }
}

export default ImportMobile;
