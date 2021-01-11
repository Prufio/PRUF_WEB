import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import bs58 from "bs58";
import Alert from "react-bootstrap/Alert";
import { CheckCircle, Home, XSquare, AlertTriangle } from 'react-feather'
import { ClickAwayListener } from '@material-ui/core';


class AddNote extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: false, txHash: "", wasSentPacket: false, help: false })
    }

    this.setInscription = async () => {
      this.setState({ help: false })
      if (this.state.hashPath === "" || this.state.idxHash === undefined) {
        this.setState({ hashPath: "", idxHash: undefined });
        return this.clearForm()
      }
      const self = this;
      window.isInTx = true;

      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      const idxHash = this.state.idxHash;
      const ipfs2 = this.state.hashPath;

      this.setState({ hashPath: "" })

      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);

      await window.contracts.APP.methods
        .$addIpfs2Note(idxHash, ipfs2)
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          this.setState({ alertBanner: "Something went wrong!" })
          self.clearForm();
          console.log(Object.values(_error)[0].transactionHash);
          window.isInTx = false;
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          window.resetInfo = true;
          window.isInTx = false;
          
          //Stuff to do when tx confirms
        });

      console.log(this.state.txHash);
    }

    this.updateAssets = setInterval(() => {
      if (this.state.assets !== window.assets && this.state.runWatchDog === true) {
        this.setState({ assets: window.assets })
      }

      if (this.state.hasLoadedAssets !== window.hasLoadedAssets && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssets: window.hasLoadedAssets })
      }

      if (this.state.hashPath !== "" && this.state.runWatchDog === true && window.isInTx !== true) {
        this.setInscription()
      }
    }, 150)

    this.setAC = async (AC) => {
      let acDoesExist;

      if (AC === "0" || AC === undefined) { return this.setState({ alertBanner: "Selected AC Cannot be Zero" }) }
      else {
        if (
          isNaN(AC)
        ) {
          acDoesExist = await window.utils.checkForAC("name", AC);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist) {
            return this.setState({alertBanner: "Asset class does not currently exist."})
          }

          this.setState({ ACname: AC });
          await window.utils.resolveAC(AC);
          await this.setState({ assetClass: window.assetClass });

        }

        else {
          acDoesExist = await window.utils.checkForAC("id", AC);
          await console.log("Exists?", acDoesExist)

          if (!acDoesExist) {
            return this.setState({alertBanner: "Asset class does not currently exist."})
          }

          this.setState({ assetClass: AC });
          await window.utils.resolveACFromID(AC)
          await window.utils.getACData("id", AC)

          await this.setState({ ACname: window.assetClassName });
        }

        return this.setState({ assetClassSelected: true, acData: window.tempACData })
      }
    }

    this.state = {
      addr: "",
      lookup: "",
      hashPath: "",
      ipfsID: "",
      costArray: [0],
      error: undefined,
      result: "",
      assetClass: undefined,
      ipfs1: "",
      ipfs2: "",
      txHash: "",
      txStatus: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      first: "",
      middle: "",
      surname: "",
      id: "",
      secret: "",
      isNFA: false,
      hashUrl: "",
      hasError: false,
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {

      if (Number(window.sentPacket.statusNum) === 3 || Number(window.sentPacket.statusNum) === 4 || Number(window.sentPacket.statusNum) === 53 || Number(window.sentPacket.statusNum) === 54) {
        alert("Cannot edit asset in lost or stolen status");
        window.sentPacket = undefined;
        
      }

      if (Number(window.sentPacket.statusNum) === 50 || Number(window.sentPacket.statusNum) === 56 || Number(window.sentPacket.statusNum) === 6) {
        alert("Cannot edit asset in escrow! Please wait until asset has met escrow conditions");
        window.sentPacket = undefined;
        
      }

      let resArray = window.utils.checkStats(window.sentPacket.idxHash, [6])

      console.log(resArray)

      if (window.sentPacket.note !== "0") {
        alert("Note already enscribed on this asset! Cannot overwrite existing note.")
        window.sentPacket = undefined;
        
      }

      this.setState({ name: window.sentPacket.name })
      this.setState({ idxHash: window.sentPacket.idxHash })
      this.setState({ assetClass: window.sentPacket.assetClass })
      this.setState({ status: window.sentPacket.status })
      this.setAC(window.sentPacket.assetClass)
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

    const clearForm = async () => {
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: false, txHash: "", wasSentPacket: false, assetClass: undefined, help: false })
    }

    const getBytes32FromIpfsHash = (ipfsListing) => {
      return "0x" + bs58.decode(ipfsListing).slice(2).toString("hex");
    };

    const accessAsset = async () => {
      const self = this;

      let idxHash = this.state.idxHash;

      let rgtRaw = window.web3.utils.soliditySha3(
        this.state.first,
        this.state.middle,
        this.state.surname,
        this.state.id,
        this.state.secret
      );

      var rgtHash = window.web3.utils.soliditySha3(idxHash, rgtRaw);
      var infoMatches = await window.utils.checkMatch(idxHash, rgtHash);
      var hasNote = await window.utils.checkNoteExists(idxHash)

      if (!infoMatches) {
        return this.setState({alertBanner: "Supplied info does not match record credentials. Please Check forms and try again."})
      }

      if (hasNote) {
        return this.setState({alertBanner: "Asset already has a permanent insription."})
      }

      return this.setState({ 
        rgtHash: rgtHash,
        accessPermitted: true,
        successBanner: "Credentials successfully matched to record"
       })

    }

    const publishIPFS2Photo = async () => {
      this.setState({ help: false })

      this.setState({ transaction: true })
      if (document.getElementById("ipfs2File").files[0] !== undefined && this.state.idxHash !== undefined) {
        const self = this;
        const reader = new FileReader();
        reader.readAsArrayBuffer(document.getElementById("ipfs2File").files[0])
        reader.onloadend = async (event) => {
          const buffer = Buffer(event.target.result);
          console.log("Uploading file to IPFS...", buffer);
          await window.ipfs.add(buffer, (error, hash) => {
            if (error) {
              console.log("Something went wrong. Unable to upload to ipfs");
            } else {
              console.log("uploaded at hash: ", hash);
            }
            let _hashUrl = "https://ipfs.io/ipfs/";
            self.setState({ hashPath: getBytes32FromIpfsHash(hash) });
            console.log(_hashUrl + hash)
            self.setState({ hashUrl: _hashUrl + hash })
          });
        }
      }
      else {
        if (document.getElementById("ipfs2File").files[0] === undefined) {
          this.setState({ alertBanner: "No file chosen for upload!" });
        }
        else {
          this.setState({ alertBanner: "Select an asset to modify!" })
        }
      }
    };

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }


    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Add Note</h2>
          <div className="mediaLinkClearForm">
            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
          </div>
        </div>
        <Form className="form" id='MainForm'>
          {window.addr === undefined && (
            <div className="results">
              <h2>User address unreachable</h2>
              <h3>Please connect web3 provider.</h3>
            </div>
          )}
          {window.addr > 0 && (
            <div>
              {!this.state.accessPermitted &&(
                <>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridFirstName">
                  <Form.Label className="formFont">First Name:</Form.Label>
                  <Form.Control
                    placeholder="First Name"
                    required
                    onChange={(e) => this.setState({ first: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMiddleName">
                  <Form.Label className="formFont">Middle Name:</Form.Label>
                  <Form.Control
                    placeholder="Middle Name"
                    required
                    onChange={(e) => this.setState({ middle: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridLastName">
                  <Form.Label className="formFont">Last Name:</Form.Label>
                  <Form.Control
                    placeholder="Last Name"
                    required
                    onChange={(e) => this.setState({ surname: e.target.value })}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridIdNumber">
                  <Form.Label className="formFont">ID Number:</Form.Label>
                  <Form.Control
                    placeholder="ID Number"
                    required
                    onChange={(e) => this.setState({ id: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label className="formFont">Password:</Form.Label>
                  <Form.Control
                    placeholder="Password"
                    type="password"
                    required
                    onChange={(e) => this.setState({ secret: e.target.value })}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>
                <Form.Row>
                <div className="submitButton">
                      <div className="submitButtonContent">
                        <CheckCircle
                          onClick={() => { accessAsset() }}
                        />
                      </div>
                    </div>
                </Form.Row>
                </>
              )}
              <Form.Row>
                <Form.Group as={Col} controlId="formGridIpfs2File">
                  {this.state.transaction === false && (
                    <Form.File onChange={(e) => this.setState({ hashPath: "" })} size="lg" className="btn2" id="ipfs2File" />
                  )}
                  {this.state.transaction === true && (
                    <Form.File disabled size="lg" className="btn2" id="ipfs2File" />
                  )}
                </Form.Group>
              </Form.Row>

              {this.state.hashPath === "" && this.state.transaction === false && (
                <>
                  <Form.Row>
                    <div>
                      {this.state.assetClass !== undefined && (
                        <Form.Label className="costText"> Cost To Add Note in AC {this.state.assetClass}: {Number(window.costs.createNote) / 1000000000000000000} PRüF</Form.Label >
                      )}
                      <div className="submitButton">
                        <div className="submitButtonContent">
                          <CheckCircle
                            onClick={() => { publishIPFS2Photo() }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mediaLinkHelp">
                      <div className="mediaLinkHelpContent2">
                        <AlertTriangle
                          onClick={() => { help() }}
                        />
                      </div>
                    </div>
                  </Form.Row>
                  {this.state.help === true && (
                    <div className="explainerTextBox2">
                      Add Note allows users to permanently pair a file to an asset. Information given within this versionof the web
                      application may be visible to third parties if unencrypted. These data fields should not include sensitive or personally
                      identifying data unless it is the intention of the user to make this data public.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Form>
        {this.state.transaction === false && (
          <div className="assetSelectedResults">
            {this.state.alertBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                <Alert className="alertBanner" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                  {this.state.alertBanner}
                </Alert>
              </ClickAwayListener>
            )}
            {this.state.successBanner !== undefined && (
              <ClickAwayListener onClickAway={() => { this.setState({ successBanner: undefined }) }}>
                <Alert className="alertBanner" key={1} variant="success" onClose={() => this.setState({ successBanner: undefined })} dismissible>
                  {this.state.successBanner}
                </Alert>
              </ClickAwayListener>
            )}
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

export default AddNote;
