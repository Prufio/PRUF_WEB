import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { Home, XSquare, CheckCircle, HelpCircle } from 'react-feather'
import { ClickAwayListener } from '@material-ui/core';


class ModifyRecordStatusNC extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.clearForm = async () => {
      const self = this;
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, transaction: false, txStatus: false, txHash: "", wasSentPacket: false, help: false })
    }

    this.modifyStatus = async () => {
      const self = this;
      var idxHash = this.state.idxHash;
      if (idxHash === undefined || idxHash === "null" || idxHash === "") { return this.setState({ alertBanner: "Please select an asset from the dropdown" }) }

      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);
      var NewStatusString = await window.utils.getStatusString(this.state.newStatus)
      console.log("new stat string", NewStatusString);
      console.log("old stat: ", this.state.status);

      var doesExist = await window.utils.checkAssetExistsBare(idxHash);

      if (!doesExist) {
        this.clearForm()
        return this.setState({ alertBanner: "Asset doesnt exist! Ensure data fields are correct before submission." })

      }

      if (NewStatusString === this.state.status) {
        this.clearForm()
        return this.setState({ alertBanner: "Asset already in selected Status! Ensure data fields are correct before submission." })
      }

      this.setState({ help: false })
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true })


      if (
        this.state.newStatus !== "53" &&
        this.state.newStatus !== "54" &&
        this.state.newStatus !== "57" &&
        this.state.newStatus !== "58" &&
        Number(this.state.newStatus) < 100 &&
        Number(this.state.newStatus) > 49) {

        await window.contracts.NP_NC.methods
          ._modStatus(idxHash, this.state.newStatus)
          .send({ from: window.addr })
          .on("error", function (_error) {
            // self.setState({ NRerror: _error });
            self.setState({ alertBanner: "Something went wrong!" })
            self.setState({ txHash: Object.values(_error)[0].transactionHash });
            self.setState({ txStatus: false });
            self.setState({ transaction: false, wasSentPacket: false });
            self.clearForm();
            console.log(Object.values(_error)[0].transactionHash);
          })
          .on("receipt", (receipt) => {
            self.setState({ transaction: false });
            self.setState({ txHash: receipt.transactionHash });
            self.setState({ txStatus: receipt.status });
            console.log(receipt.status);
            window.resetInfo = true;
            if (self.state.wasSentPacket) {
              return window.location.href = '/#/asset-dashboard'
            }
            //Stuff to do when tx confirms
          });
      }

      else if (this.state.newStatus === "53" || this.state.newStatus === "54") {
        await window.contracts.NP_NC.methods
          ._setLostOrStolen(idxHash, this.state.newStatus)
          .send({ from: window.addr })
          .on("error", function (_error) {
            // self.setState({ NRerror: _error });
            self.setState({ alertBanner: "Something went wrong!" })
            self.setState({ transaction: false })
            self.setState({ txHash: Object.values(_error)[0].transactionHash });
            self.setState({ txStatus: false, wasSentPacket: false });
            self.clearForm();
            console.log(Object.values(_error)[0].transactionHash);
          })
          .on("receipt", (receipt) => {
            self.setState({ transaction: false })
            self.setState({ txHash: receipt.transactionHash });
            self.setState({ txStatus: receipt.status });
            console.log(receipt.status);
            window.resetInfo = true;
            if (self.state.wasSentPacket === true) {
              return window.location.href = '/#/asset-dashboard'
            }
            //Stuff to do when tx confirms
          });
      }

      else { this.setState({ alertBanner: "Invalid status input" }) }

      console.log(this.state.txHash);
      this.setState({
        idxHash: undefined
      });
    };

    this.updateAssets = setInterval(() => {
      if (this.state.assets !== window.assets && this.state.runWatchDog === true) {
        this.setState({ assets: window.assets })
      }

      if (this.state.hasLoadedAssets !== window.hasLoadedAssets && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssets: window.hasLoadedAssets })
      }
    }, 150)

    this.state = {
      addr: "",
      error: undefined,
      NRerror: undefined,
      result1: "",
      result2: "",
      assetClass: undefined,
      ipfs1: "",
      newStatus: "0",
      txHash: "",
      txStatus: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      isNFA: false,
      status: "",
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {
      if (Number(window.sentPacket.statusNum) === 50 || Number(window.sentPacket.statusNum) === 56) {
        alert("Cannot edit asset in escrow! Please wait until asset has met escrow conditions");
        window.sentPacket = undefined;
        return window.location.href = "/#/asset-dashboard"
      }
      this.setState({ name: window.sentPacket.name })
      this.setState({ idxHash: window.sentPacket.idxHash })
      this.setState({ assetClass: window.sentPacket.assetClass })
      this.setState({ status: window.sentPacket.status })

      window.sentPacket = undefined
      this.setState({ wasSentPacket: true })
    }

    this.setState({ runWatchDog: true })
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    clearInterval(this.updateAssets);
    this.setState({ runWatchDog: false });
  }

  render() {//render continuously produces an up-to-date stateful document  


    const help = async () => {

      if (this.state.help === false) { this.setState({ help: true }) }

      else { this.setState({ help: false }) }
    }

    const submitHandler = (e) => {
      e.preventDefault();
    }

    const _checkIn = async (e) => {
      this.setState({ help: false, txHash: "", txStatus: false })
      if (e === "null" || e === undefined) {
        return this.clearForm()
      }
      else if (e === "reset") {
        return window.resetInfo = true;
      }
      else if (e === "assetDash") {
        return window.location.href = "/#/asset-dashboard"
      }

      let resArray = await window.utils.checkStats(window.assets.ids[e], [0, 2])

      console.log(resArray)

      if (Number(resArray[1]) === 0) {
        this.setState({ alertBanner: "Asset does not exist at given IDX" });
      }

      if (Number(resArray[0]) === 50 || Number(resArray[0]) === 56) {
        this.setState({ alertBanner: "Cannot edit asset in escrow! Please wait until asset has met escrow conditions" }); return this.clearForm()
      }

      this.setState({ selectedAsset: e })
      console.log("Changed component idx to: ", window.assets.ids[e])

      this.setState({
        assetClass: window.assets.assetClasses[e],
        idxHash: window.assets.ids[e],
        name: window.assets.descriptions[e].name,
        photos: window.assets.descriptions[e].photo,
        text: window.assets.descriptions[e].text,
        description: window.assets.descriptions[e],
        status: window.assets.statuses[e],
        note: window.assets.notes[e]
      })
    }

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Modify Asset Status</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { this.clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm' onSubmit={submitHandler}>
          {window.addr === undefined && (
            <div className="results">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
            </div>
          )}
          {window.addr > 0 && (
            <div>
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
                            <option>Modifying "{this.state.name}"</option>
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
                          Modifying "{this.state.name}" Clear Form to Select Different Asset
                           </option>
                      </optgroup>
                    </Form.Control>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridFormat">
                  <Form.Label className="formFont">New Status:</Form.Label>
                  {this.state.transaction === false && (
                    <Form.Control as="select" size="lg" onChange={(e) => this.setState({ newStatus: e.target.value })}>
                      <optgroup className="optgroup">
                        <option value="0">Choose a status</option>
                        <option value="51">Transferrable/Exportable</option>
                        <option value="52">Non-Transferrable</option>
                        <option value="53">Stolen</option>
                        <option value="54">Lost</option>
                        <option value="59">Discardable</option>
                      </optgroup>
                    </Form.Control>
                  )}
                  {this.state.transaction === true && (
                    <Form.Control as="select" size="lg" disabled>
                      <optgroup className="optgroup">
                        {this.state.newStatus === "51" && (
                          <option> Changing Status to Transferable </option>
                        )}
                        {this.state.newStatus === "52" && (
                          <option> Changing Status to Non-transferrable </option>
                        )}
                        {this.state.newStatus === "53" && (
                          <option> Changing Status to Stolen </option>
                        )}
                        {this.state.newStatus === "54" && (
                          <option> Changing Status to Lost </option>
                        )}
                        {this.state.newStatus === "59" && (
                          <option> Changing Status to Discardable </option>
                        )}
                      </optgroup>
                    </Form.Control>
                  )}
                </Form.Group>
              </Form.Row>
              {this.state.transaction === false && (
                <>
                  <Form.Row>
                    <div className="submitButton">
                      <div className="submitButtonContent">
                        <CheckCircle
                          onClick={() => { this.modifyStatus() }}
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
                  </Form.Row>
                  {this.state.help === true && this.state.newStatus === "0" && (
                    <div className="explainerTextBox2">
                      Modifying Asset Status allows the user to manipulate an assets accessablility to certain features, and even set their assets to lost or stolen, making them
                      unmodifyable by anybody attempting to manipulate them. Setting an asset to lost or stolen also attatches a red flag to the asset for anybody attempting to buy it.
                    </div>
                  )}
                  {this.state.help === true && this.state.newStatus === "51" && (
                    <div className="explainerTextBox2">
                      Modifying an assets status to Transferable allows it to be transfered to a different user using Transfer Asset, and allows it to be exported out
                      of its current asset class using Export Asset.
                    </div>
                  )}
                  {this.state.help === true && this.state.newStatus === "52" && (
                    <div className="explainerTextBox2">
                      Modifying an assets status to Non-Transferable locks it from being able to be transfered or modified in most ways throughout the app.
                    </div>
                  )}
                  {this.state.help === true && this.state.newStatus === "53" && (
                    <div className="explainerTextBox2">
                      Modifying an assets status to Stolen locks it from being able to be transfered or modified throughout the app. The owner of the asset token
                      must manually remove it from Stolen status once the asset is found.
                    </div>
                  )}
                  {this.state.help === true && this.state.newStatus === "54" && (
                    <div className="explainerTextBox2">
                      Modifying an assets status to Lost locks it from being able to be transfered or modified throughout the app. The owner of the asset token
                      must manually remove it from Lost status once the asset is found.
                    </div>
                  )}
                  {this.state.help === true && this.state.newStatus === "59" && (
                    <div className="explainerTextBox2">
                      Modifying an assets status to Discardable allows it to be discarded for recycling using Discard Asset.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Form>
        {this.state.transaction === false && this.state.txHash === "" && (
          <div className="assetSelectedResults">
            {this.state.alertBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                <Alert className="alertBanner" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                  {this.state.alertBanner}
                </Alert>
              </ClickAwayListener>
            )}
            <Form.Row>
              {this.state.idxHash !== undefined && (
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContent">{this.state.idxHash}</span> </div>
                  <div className="assetSelectedContentHead">Asset Name: <span className="assetSelectedContent">{this.state.name}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContent">{this.state.assetClass}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContent">{this.state.status}</span> </div>
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
              <div className="transactionErrorText">
                !ERROR! :
                <a
                  className="transactionErrorText"
                  href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TX Hash:{this.state.txHash}
                </a>
              </div>
            )}
            {this.state.txStatus === true && (
              <div className="transactionErrorText">
                {" "}
                No Errors Reported :
                <a
                  className="transactionErrorText"
                  href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TX Hash:{this.state.txHash}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ModifyRecordStatusNC;
