import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Home, XSquare, CheckCircle, HelpCircle } from "react-feather";

class IncreaseACShare extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................
    this.updateAssets = setInterval(() => {
      if (this.state.assetClasses !== window.assetsClasses && this.state.runWatchDog === true) {
        this.setState({ assetClasses: window.assetClasses })
      }

      if (window.balances !== undefined) {
        if (
          Object.values(window.balances) !==
          Object.values({ assetClass: this.state.assetClassBalance, asset: this.state.assetBalance, ID: this.state.IDTokenBalance })) {
          this.setState({
            assetClassBalance: window.balances.assetClassBalance,
            assetBalance: window.balances.assetBalance,
            IDTokenBalance: window.balances.IDTokenBalance,
            prufBalance: window.balances.prufTokenBalance,
            assetHolderBool: window.assetHolderBool,
            assetClassHolderBool: window.assetClassHolderBool,
            IDHolderBool: window.IDHolderBool,
            custodyType: window.custodyType,
            hasFetchedBalances: window.hasFetchedBalances
          })
        }
      }

      if (this.state.hasLoadedAssetClasses !== window.hasLoadedAssetClasses && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssetClasses: window.hasLoadedAssetClasses })
      }
    }, 100)

    this.state = {
      addr: "",
      authAddr: "",
      userType: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      authAddress: "",
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
      assetClass: "",
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    this.setState({ runWatchDog: true })
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    //console.log("unmounting component")
  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = () => {
      document.getElementById("MainForm").reset();
      this.setState({ assetClass: undefined, assetClassSelected: false, help: false, transaction: false })
    }

    const _setAC = (_e) => {
      const e = JSON.parse(_e);
      console.log("In setAC", e);
      return this.setState({ acArr: e, assetClass: e.id, assetClassSelected: true, custodyType: e.custodyType, ACName: e.name, root: e.root });
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const increaseACShare = async () => {
      await console.log("Pruf Bal", this.state.prufBalance)
      const amount = window.web3.utils.toWei(String(this.state.amount))
      if(Number(this.state.prufBalance) < this.state.amount) {
        alert("Sender has insuficceint PRuF token balance")
        return clearForm()
      }
      if(Number(this.state.amount) < "200") {
        alert("The amount of PRuF sent is below 200. To increase shares, you must send at least 200 PRuF.")
        return clearForm()
      }
      else {
        self.setState({ transaction: true })
        console.log(amount)
        console.log(this.state.assetClass)
        window.contracts.AC_MGR.methods
          .increaseShare(
            this.state.assetClass,
            amount
          )
          .send({ from: window.addr })
          .on("error", function (_error) {
            self.setState({ transaction: false })
            self.setState({ error: _error });
            self.setState({ result: _error.transactionHash });
            return clearForm();
          })
          .on("receipt", (receipt) => {
            console.log("tx receipt: ", receipt);
            self.setState({ transaction: false })
            return clearForm();
          });

        console.log(this.state.txHash);
      }
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Increase Share</h2>
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
                    as="select"
                    size="lg"
                    onChange={(e) => { _setAC(e.target.value) }}

                  >
                    {this.state.hasLoadedAssetClasses && (
                      <optgroup className="optgroup">
                        {window.utils.generateAssetClasses()}
                      </optgroup>)}
                    {!this.state.hasLoadedAssetClasses && (
                      <optgroup>
                        <option value="null">
                          Loading Held Asset Classes...
                           </option>
                      </optgroup>)}
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </>
          )}
          {window.addr > 0 && this.state.assetClassSelected && (
            <div>
              <>
                <div>
                  <Form.Group as={Col} controlId="formGridShareIncrease">
                    <Form.Label className="formFont">Share Increase Amount :</Form.Label>
                    {this.state.transaction === false && (
                      <Form.Control
                        placeholder="Share Increase"
                        required
                        type="text"
                        onChange={(e) => this.setState({ amount: e.target.value })}
                        size="lg"
                      />
                    )}
                    {this.state.transaction === true && (
                      <Form.Control
                        placeholder={this.state.amount}
                        disabled
                        size="lg"
                      />
                    )}
                  </Form.Group>
                </div>
                {this.state.transaction === false && (
                  <>
                    <Form.Row>
                      <div>
                        <div className="submitButton">
                          <div className="submitButtonContent">
                            <CheckCircle
                              onClick={() => { increaseACShare() }}
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
                        Increase Share allows an asset class admin to upgrade the percentage of each transaction they recieve.
                        The standard ratio is 30%(AC Admin) 70%(PRuF). For each 1,000 PRuF utility tokens put towards an asset class's share increase,
                        is a 10% increase on their holder's share. The minimum sent PRuF allotment is 200.
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          )}
        </Form>
        {
          this.state.transaction === false && this.state.txHash === "" && !this.state.assetClassSelected && (
            <div className="assetSelectedResults">
            </div>
          )
        }
        {
          this.state.transaction === false && this.state.txHash === "" && this.state.assetClassSelected && (
            <div className="assetSelectedResults">
              <div className="assetSelectedContentHead">Configuring Asset Class: <span className="assetSelectedContent">{this.state.assetClass}</span> </div>
            </div>
          )
        }
        {
          this.state.transaction === true && (
            <div className="results">
              <h1 className="loadingh1">Transaction In Progress</h1>
            </div>)
        }
        {
          this.state.txHash > 0 && ( //conditional rendering
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
          )
        }
      </div >
    );
  }
}

export default IncreaseACShare;
