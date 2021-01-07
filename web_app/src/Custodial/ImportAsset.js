import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { Home, XSquare, ArrowRightCircle, CheckCircle, HelpCircle } from "react-feather";
import { ClickAwayListener } from '@material-ui/core';


class ImportAsset extends Component {
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
            return this.setState({alertBanner: "Asset class does not currently exist."})
          }

          this.setState({ ACname: this.state.selectedAssetClass });
          await window.utils.resolveAC(this.state.selectedAssetClass);
          await this.setState({ assetClass: destinationACData.AC });
        }

        else {
          acDoesExist = await window.utils.checkForAC("id", this.state.selectedAssetClass);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist) {
            return this.setState({alertBanner: "Asset class does not currently exist."})
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
          }

          console.log(destinationACData.root)

          if (resArray[1] !== destinationACData.root) {
            this.setState({ alertBanner: "Import destination AC must have same root as origin!" });
            window.sentPacket = undefined;
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

    const submitHandler = (e) => {
      e.preventDefault();
    }

    const _importAsset = async () => {
      let idxHash = this.state.idxHash;
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

      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);

      await window.contracts.APP.methods
        .$importAsset(idxHash, this.state.assetClass)
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false, wasSentPacket: false });
          self.setState({ alertBanner: "Something went wrong!" })
          clearForm();
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          window.resetInfo = true;
          
          //Stuff to do when tx confirms
        });
      console.log(this.state.txHash);

      await this.setState({
        idxHash: "",
        accessPermitted: false
      })

      return this.setState({ idxHash: undefined, wasSentPacket: false, assetClassSelected: false, help: false })
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
        <Form className="form" id='MainForm' onSubmit={submitHandler}>
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
                    onChange={(e) => this.setState({ selectedAssetClass: e.target.value.trim() })}
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
                    {this.state.wasSentPacket && (
                      <Form.Control
                        as="select"
                        size="lg"
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
                          Cost to import into AC {this.state.selectedAssetClass}: ü{Number(window.costs.newAsset) / 1000000000000000000}
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
              <Alert
              className="alertFooter"
              variant = "success">
                Transaction failed!
                  <Alert.Link
                  className="alertLink"
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
                className="alertFooter"
                variant = "success">
                  Transaction success!
                    <Alert.Link
                    className="alertLink"
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

export default ImportAsset;
