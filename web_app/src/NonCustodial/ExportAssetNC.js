import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, CheckCircle } from 'react-feather'
import { connect } from 'react-redux';
import {
  setHasLoadedAssets,
  setHolderBools,
  setGlobalAddr, 
  setGlobalWeb3,
  setIPFS,
  setContracts,
  setIsAdmin,
  setBalances,
  setMenuInfo,
  setIsACAdmin,
  setCustodyType,
  setEthBalance,
  setAssets,
  setAssetsToDefault,
  setAssetTokenIds,
  setIPFSHashArray,
  setHasAssets,
  setHasFetchedBals,
  setGlobalAssetClass,
  setAssetTokenInfo,
  setIsAuthUser,
  setCosts
} from '../Actions'


class ExportAssetNC extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.updateAssets = setInterval(() => {
      if (this.state.assets !== this.props.assets && this.state.runWatchDog === true) {
        this.setState({ assets: this.props.assets })
      }

      if (this.state.hasLoadedAssets !== this.props.hasLoadedAssets && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssets: this.props.hasLoadedAssets })
      }
    }, 100)

    this.state = {
      addr: "",
      lookupIPFS1: "",
      lookupIPFS2: "",
      error: undefined,
      NRerror: undefined,
      result: null,
      assetClass: undefined,
      ipfs1: "",
      txHash: "",
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      importAgent: "",
      isNFA: false,
      txStatus: null,
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (this.props.sentPacket !== undefined) {
      this.setState({ name: this.props.sentPacket.name })
      this.setState({ idxHash: this.props.sentPacket.idxHash })
      this.setState({ assetClass: this.props.sentPacket.assetClass })
      this.setState({ status: this.props.sentPacket.status })
      console.log("stat", this.props.sentPacket.status)
      if (this.props.sentPacket.status !== "Transferrable") {
        alert("Asset is not set to transferrable! Owner must set the status to transferrable before export.");
        this.props.sentpacket = undefined;
        return window.location.href = "/#/asset-dashboard"
      }
      this.props.sentPacket = undefined
      this.setState({ wasSentPacket: true })
    }

    this.setState({ runWatchDog: true })

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

  }
  componentDidUpdate() {//stuff to do on a re-render

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const _checkIn = async (e) => {
      if (e === "null" || e === undefined) {
        return clearForm()
      }
      else if (e === "reset") {
        return window.resetInfo = true;
      }
      else if (e === "assetDash") {
        return window.location.href = "/#/asset-dashboard"
      }

      let resArray = await window.utils.checkStats(this.props.assets.ids[e], [0])

      console.log(resArray)

      if (Number(resArray[0]) !== 51) {
        alert("Cannot export asset in non-transferrable status"); return clearForm()
      }

      this.setState({ selectedAsset: e })
      console.log("Changed component idx to: ", this.props.assets.ids[e])

      this.setState({
        assetClass: this.props.assets.assetClasses[e],
        idxHash: this.props.assets.ids[e],
        name: this.props.assets.descriptions[e].name,
        photos: this.props.assets.descriptions[e].photo,
        text: this.props.assets.descriptions[e].text,
        description: this.props.assets.descriptions[e],
        status: this.props.assets.statuses[e],
        note: this.props.assets.notes[e]
      })
    }

    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: undefined, txHash: "", wasSentPacket: undefined })
    }

    const _exportAsset = async () => {//create a new asset record
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true })
      //reset state values before form resubmission
      var idxHash = this.state.idxHash;

      console.log("idxHash", idxHash);
      console.log("addr: ", this.state.agentAddress);

      this.props.contracts.NP_NC.methods
        ._exportNC(
          idxHash
        )
        .send({ from: this.props.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
          window.resetInfo = true;
          if (self.state.wasSentPacket) {
            return window.location.href = '/#/asset-dashboard'
          }
        });

      return clearForm(); //clear form inputs
    };

    return (//default render
      <div>
        <div>
          <div className="mediaLinkAD-home">
            <a className="mediaLinkContentAD-home" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="FormHeader">Export Asset</h2>
          <div className="mediaLink-clearForm">
            <a className="mediaLinkContent-clearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="Form" id='MainForm'>
          {this.props.addr === undefined && (
            <div className="Results">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
            </div>
          )}
          {this.props.addr > 0 && (
            <div>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridAsset">
                  <Form.Label className="formFont"> Select an Asset to Modify :</Form.Label>
                  {!this.state.wasSentPacket && (
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
                    </Form.Control>
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
                <Form.Row>
                  <Form.Group>
                    <div className="submitButton">
                      <div className="submitButton-content">
                        <CheckCircle
                          onClick={() => { _exportAsset() }}
                        />
                      </div>
                    </div>
                  </Form.Group>
                </Form.Row>
              )}

            </div>
          )}
        </Form>
        {this.state.transaction === false && this.state.txHash === "" && (
          <div className="assetSelectedResults">
            <Form.Row>
              {this.state.idxHash !== undefined && this.state.txHash === "" && (
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
          <div className="Results">
            <p className="loading">Transaction In Progress</p>
          </div>)}
        {this.state.txHash > 0 && ( //conditional rendering
          <div className="Results">
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


const mapStateToProps = (state) => {

  return{
    globalAddr: state.globalAddr,
    web3: state.web3,
    assetClass: state.globalAssetClass,
    assets: state.globalAssets,
    assetTokenIDs: state.globalAssetTokenIDs,
    assetTokenInfo: state.globalAssetTokenInfo,
    globalBalances: state.globalBalances,
    contracts: state.globalContracts,
    costs: state.globalCosts,
    custodyType: state.globalCustodyType,
    ETHBalance: state.globalETHBalance,
    hasFetchedBalances: state.hasFetchedBalances,
    ipfs: state.globalIPFS,
    ipfsHashArray: state.globalIPFSHashArray,
    isACAdmin: state.isACAdmin,
    isAuthUser: state.isAuthUser,
    menuInfo: state.menuInfo,
    holderBools: state.holderBools,
    sentPacket: state.globalSentPacket,
    hasLoadedAssets: state.hasLoadedAssets,
  }

}

const mapDispatchToProps = () => {
  return {
    setHasLoadedAssets,
    setHolderBools,
    setGlobalAddr,
    setGlobalWeb3,
    setIPFS,
    setContracts,
    setIsAdmin,
    setBalances,
    setMenuInfo,
    setIsACAdmin,
    setCustodyType,
    setEthBalance,
    setAssets,
    setAssetsToDefault,
    setAssetTokenIds,
    setIPFSHashArray,
    setHasAssets,
    setHasFetchedBals,
    setIPFS,
    setGlobalAssetClass,
    setAssetTokenInfo,
    setIsAuthUser,
    setCosts
  }
}



export default connect(mapStateToProps, mapDispatchToProps())(ExportAssetNC);
