import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, ArrowRightCircle, CheckCircle, HelpCircle } from "react-feather";


class ImportAssetNC extends Component {
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
    }, 50)

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
        return window.location.href = "/#/asset-dashboard"
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

  }

  componentDidUpdate() {//stuff to do when state updates

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const _setAC = async () => {
      let acDoesExist;
      let destinationACData;

      if (this.state.selectedAssetClass === "0" || this.state.selectedAssetClass === undefined) { return alert("Selected AC Cannot be Zero") }
      else {
        if (
          this.state.selectedAssetClass.charAt(0) === "0" ||
          this.state.selectedAssetClass.charAt(0) === "1" ||
          this.state.selectedAssetClass.charAt(0) === "2" ||
          this.state.selectedAssetClass.charAt(0) === "3" ||
          this.state.selectedAssetClass.charAt(0) === "4" ||
          this.state.selectedAssetClass.charAt(0) === "5" ||
          this.state.selectedAssetClass.charAt(0) === "6" ||
          this.state.selectedAssetClass.charAt(0) === "7" ||
          this.state.selectedAssetClass.charAt(0) === "8" ||
          this.state.selectedAssetClass.charAt(0) === "9"
        ) {
          acDoesExist = await window.utils.checkForAC("id", this.state.selectedAssetClass);
          destinationACData = await window.utils.getACData("id", this.state.selectedAssetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.open('https://www.pruf.io')
          }

          this.setState({ assetClass: this.state.selectedAssetClass });
          await window.utils.resolveACFromID(this.state.selectedAssetClass)
          await window.utils.getACData("id", this.state.selectedAssetClass)
          await this.setState({ ACname: window.assetClassName });
        }

        else {
          acDoesExist = await window.utils.checkForAC("name", this.state.selectedAssetClass);
          destinationACData = await window.utils.getACData("name", this.state.selectedAssetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist && window.confirm("Asset class does not currently exist. Consider minting it yourself! Click ok to route to our website for more information.")) {
            window.open('https://www.pruf.io')
          }

          this.setState({ ACname: this.state.selectedAssetClass });
          await window.utils.resolveAC(this.state.selectedAssetClass);
          await this.setState({ assetClass: window.assetClass });
        }
        if (this.state.wasSentPacket) {
          let resArray = await window.utils.checkStats(this.state.idxHash, [0, 2])
          console.log(resArray)

          if (Number(resArray[0]) !== 70) {
            alert("Asset is not exported! Owner must export the assset in order to import.");
            window.sentPacket = undefined;
            return window.location.href = "/#/asset-dashboard"
          }

          console.log(destinationACData.root)

          if (resArray[1] !== destinationACData.root) {
            alert("Import destination AC must have same root as origin!");
            window.sentPacket = undefined;
            return window.location.href = "/#/asset-dashboard"
          }
        }
        this.setState({ assetClassSelected: true, acData: window.tempACData, txHash: "" });
        return window.assetClass = undefined;
      }
    }

    const clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: undefined, txHash: "", wasSentPacket: false, assetClassSelected: false, help: false })
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const _checkIn = async (e) => {
      this.setState({help: false})
      console.log("Checking in with id: ", e)
      if (e === "null" || e === undefined) {
        alert("Please select an asset before submission.") 
        return clearForm()
      }
      else if (e === "reset") {
        return window.resetInfo = true;
      }
      else if (e === "assetDash") {
        console.log("heading over to dashboard")
        return window.location.href = "/#/asset-dashboard"
      }

      let resArray = await window.utils.checkStats(window.assets.ids[e], [0, 2])
      console.log(resArray)

      if (Number(resArray[1]) === 0) {
        this.setState({
          QRreader: false,
        })
        alert("Asset does not exist! Ensure data fields are correct before submission."); 
        return clearForm()
      }

      if (Number(resArray[0]) !== 70) {
        this.setState({
          QRreader: false,
        })
        alert("Asset is not exported! Owner must export the assset in order to import.");
        return clearForm()
      }

      let destinationACData = await window.utils.getACData("id", this.state.assetClass);
      let originACRoot = window.assets.assetClasses[e]

      console.log(destinationACData.root)
      if (originACRoot !== destinationACData.root) {
        this.setState({
          QRreader: false,
        })
        return alert("Import destination AC must have same root as origin!")
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
      this.setState({help: false})
      if (this.state.selectedAsset === undefined && !this.state.wasSentPacket) {
        alert("Please select an asset before submission."); 
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
        .$importAsset(idxHash, this.state.selectedAssetClass)
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false, wasSentPacket: false });
          alert("Something went wrong!")
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
            return window.location.href = '/#/asset-dashboard'
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
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Import Asset</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm'>
          {window.addr === undefined && (
            <div className="errorResults">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
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
                    onChange={(e) => this.setState({ selectedAssetClass: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <div className="submitButtonNRAC">
                  <div className="submitButtonNRContent">
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
                              <option>Importing: {this.state.idxHash}</option>
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
                            "{this.state.name}" Please Clear Form to Select Different Asset
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
                          Cost to import into AC {this.state.selectedAssetClass}: {Number(window.costs.newRecordCost) / 1000000000000000000} PRüF
                          </Form.Label>
                        <div className="submitButton">
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
                      <div className="explainerTextBox2">
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
          <div className="assetSelectedResults">
            <Form.Row>
              {this.state.idxHash !== undefined && (
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContent">{this.state.idxHash}</span> </div>
                  <div className="assetSelectedContentHead">Asset Name: <span className="assetSelectedContent">{this.state.name}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContent">{this.state.currentAssetClass}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContent">{this.state.status}</span> </div>
                  {this.state.assetClassSelected === true && (
                    <div className="assetSelectedContentHead">Importing Asset Class: <span className="assetSelectedContent">{this.state.selectedAssetClass}</span> </div>
                  )}
                </Form.Group>
              )}
            </Form.Row>
          </div>
        )}
        {this.state.transaction === true && (

          <div className="results">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>)}
        {this.state.txHash > 0 && ( //conditional rendering
          <div className="results">
            {this.state.txStatus === false && (
              <div>
                !ERROR! :
                <a
                  href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KOVAN Etherscan:{this.state.txHash}
                </a>
              </div>
            )}
            {this.state.txStatus === true && (
              <div>
                {" "}
                No Errors Reported :
                <a
                  href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KOVAN Etherscan:{this.state.txHash}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ImportAssetNC;
