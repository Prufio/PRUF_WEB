import React, { Component } from "react";
import returnContracts from "./Contracts";
import Web3 from "web3";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import returnManufacturers from "./Manufacturers";
import returnTypes from "./Types";

class ModifyRecordStatus extends Component {
  constructor(props) {
    super(props);

    this.getAssetClass = async () => {
      const self = this;
      //console.log("getting asset class");
      if (self.state.assetClass > 0 || self.state.PRUF_APP === "") {
      } else {
        self.state.PRUF_APP.methods
          .getUserExt(self.state.web3.utils.soliditySha3(self.state.addr))
          .call({ from: self.state.addr }, function (_error, _result) {
            if (_error) {console.log(_error)
            } else {
               console.log("_result: ", _result);  if (_result !== undefined ) {
                self.setState({ assetClass: Object.values(_result)[1] });
              }
            }
          });
    }
    };

    this.returnsContract = async () => {
      const self = this;
      var contracts = await returnContracts(self.state.web3);
      //console.log("RC NR: ", contractArray)

      if(this.state.storage < 1){self.setState({ storage: contracts.storage });}
      if(this.state.PRUF_NP < 1){self.setState({ PRUF_NP: contracts.nonPayable });}
      if(this.state.PRUF_APP < 1){self.setState({ PRUF_APP: contracts.payable });}
    };

    this.acctChanger = async () => {
      const ethereum = window.ethereum;
      const self = this;
      var _web3 = require("web3");
      _web3 = new Web3(_web3.givenProvider);
      ethereum.on("accountsChanged", function (accounts) {
        _web3.eth.getAccounts().then((e) => self.setState({ addr: e[0] }));
        self.setState({assetClass: undefined})
      });
    };

    //Component state declaration

    this.state = {
      addr: "",
      error: undefined,
      NRerror: undefined,
      result1: "",
      result2: "",
      assetClass: undefined,
      ipfs1: "",
      status: "0",
      txHash: "",
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
      web3: null,
      PRUF_APP: "",
      PRUF_NP: "",
      storage: "",
    };
  }

  componentDidMount() {
    //console.log("component mounted")
    var _web3 = require("web3");
    _web3 = new Web3(_web3.givenProvider);
    this.setState({ web3: _web3 });
    _web3.eth.getAccounts().then((e) => this.setState({ addr: e[0] }));

    document.addEventListener("accountListener", this.acctChanger());
  }

  componentDidUpdate(){

    if(this.state.web3 !== null && this.state.PRUF_APP < 1){
      this.returnsContract();
    }

    if (this.state.addr > 0 && this.state.assetClass === undefined) {
      this.getAssetClass();
  }
  }

  componentWillUnmount() {
    this.setState({assetClass: undefined})
    //console.log("unmounting component")
    document.removeEventListener("accountListener", this.acctChanger());
  }

  render() {
    const self = this;

    async function checkExists(idxHash) {
      await self.state.storage.methods
        .retrieveShortRecord(idxHash)
        .call({ from: self.state.addr }, function (_error, _result) {
          if (_error) {
            self.setState({ error: _error });
            self.setState({ result: 0 });
            alert(
              "WARNING: Record DOES NOT EXIST! Reject in metamask and review asset info fields."
            );
          } else {
            self.setState({ result1: _result });
          }
          console.log("check debug, _result, _error: ", _result, _error);
        });
    }

    async function checkMatch(idxHash, rgtHash) {
      await self.state.storage.methods
        ._verifyRightsHolder(idxHash, rgtHash)
        .call({ from: self.state.addr }, function (_error, _result) {
          if (_error) {
            self.setState({ error: _error });
          } else if (_result === "0") {
            self.setState({ result: 0 });
            alert(
              "WARNING: Record DOES NOT MATCH supplied owner info! Reject in metamask and review owner fields."
            );
          } else {
            self.setState({ result2: _result });
          }
          console.log("check debug, _result, _error: ", _result, _error);
        });
    }

    const handleCheckBox = () => {
      let setTo;
      if(this.state.isNFA === false){
        setTo = true;
      }
      else if(this.state.isNFA === true){
        setTo = false;
      }
      this.setState({isNFA: setTo});
      console.log("Setting to: ", setTo);
      this.setState({manufacturer: ""});
      this.setState({type: ""});
    }

    const _modifyStatus = () => {
      var idxHash;
      var rgtRaw;
      
      idxHash = this.state.web3.utils.soliditySha3(
        this.state.type,
        this.state.manufacturer,
        this.state.model,
        this.state.serial,
    );

      rgtRaw = this.state.web3.utils.soliditySha3(
        this.state.first,
        this.state.middle,
        this.state.surname,
        this.state.id,
        this.state.secret
      );
      var rgtHash = this.state.web3.utils.soliditySha3(idxHash, rgtRaw);

      console.log("idxHash", idxHash);
      console.log("New rgtRaw", rgtRaw);
      console.log("New rgtHash", rgtHash);
      console.log("addr: ", this.state.addr);

      checkExists(idxHash);
      checkMatch(idxHash, rgtHash);

      if (this.state.status !== "3" && this.state.status !== "4" && this.state.status !== "6" && this.state.status !== "9" && this.state.status !== "10" && this.state.status < 12){
      this.state.PRUF_NP.methods
        ._modStatus(idxHash, rgtHash, this.state.status)
        .send({ from: this.state.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          this.setState({ txHash: receipt.transactionHash });
          this.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          //Stuff to do when tx confirms
        });}

        else if (this.state.status === "3" || this.state.status === "4" || this.state.status === "10" || this.state.status === "10"){
          this.state.PRUF_NP.methods
        ._setLostOrStolen(idxHash, rgtHash, this.state.status)
        .send({ from: this.state.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          this.setState({ txHash: receipt.transactionHash });
          this.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          //Stuff to do when tx confirms
        });}

        else{alert("Invalid status input")}

      console.log(this.state.txHash);
    };

    return (
      <div>
        <Form className="MRform">
        {this.state.addr === undefined && (
            <div className="errorResults">
              <h2>WARNING!</h2>
              <h3>Injected web3 not connected to form!</h3>
            </div>
          )}{this.state.assetClass < 1 && (
            <div className="errorResults">
              <h2>No authorized asset class detected at user address.</h2>
              <h3>Unauthorized users do not have access to forms.</h3>
            </div>
          )}
          {this.state.addr > 0 && this.state.assetClass > 0 &&(
            <div>
                {this.state.assetClass === 3 &&(
                <Form.Group>
                <Form.Check
                className = 'checkBox'
                size = 'lg'
                onChange={handleCheckBox}
                id={`NFA Firearm`}
                label={`NFA Firearm`}
                />
                </Form.Group>
                )}
              <h2 className="Headertext">Change Asset Status</h2>
              <br></br>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridType">
                  <Form.Label className="formFont">Type:</Form.Label>

                  {returnTypes(this.state.assetClass, this.state.isNFA) !== '0' &&(<Form.Control as="select" size="lg" onChange={(e) => this.setState({ type: e.target.value })}>
                  {returnTypes(this.state.assetClass, this.state.isNFA)}
                  </Form.Control>
                  )}

                    {returnTypes(this.state.assetClass, this.state.isNFA) === '0' &&(
                    <Form.Control
                    placeholder="Type"
                    required
                    onChange={(e) => this.setState({ type: e.target.value })}
                    size="lg"
                  />)}
                </Form.Group>

                  <Form.Group as={Col} controlId="formGridManufacturer">
                    <Form.Label className="formFont">Manufacturer:</Form.Label>
                    {returnManufacturers(this.state.assetClass, this.state.isNFA) !== '0' &&(<Form.Control as="select" size="lg" onChange={(e) => this.setState({ manufacturer: e.target.value })}>
                  {returnManufacturers(this.state.assetClass, this.state.isNFA)}
                  </Form.Control>
                  )}

                      {returnManufacturers(this.state.assetClass, this.state.isNFA) === '0' &&(
                    <Form.Control
                    placeholder="Manufacturer"
                    required
                    onChange={(e) => this.setState({ manufacturer: e.target.value })}
                    size="lg"
                  />)}
                  </Form.Group>

              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridModel">
                  <Form.Label className="formFont">Model:</Form.Label>
                  <Form.Control
                    placeholder="Model"
                    required
                    onChange={(e) => this.setState({ model: e.target.value })}
                    size="lg"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridSerial">
                  <Form.Label className="formFont">Serial:</Form.Label>
                  <Form.Control
                    placeholder="Serial"
                    required
                    onChange={(e) => this.setState({ serial: e.target.value })}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>

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

                <Form.Group as={Col} controlId="formGridFormat">
                <Form.Label className="formFont">New Status:</Form.Label>
                  <Form.Control as="select" size="lg" onChange={(e) => this.setState({ status: e.target.value })}>
                    <option value="0">Choose a status</option>
                    <option value="1">Transferrable</option>
                    <option value="2">Non-transferrable</option>
                    <option value="3">Stolen</option>
                    <option value="4">Lost</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group className="buttonDisplay">
                  <Button
                    variant="primary"
                    type="button"
                    size="lg"
                    onClick={_modifyStatus}
                  >
                    Submit
                  </Button>
                </Form.Group>
              </Form.Row>
            </div>
          )}
        </Form>
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

export default ModifyRecordStatus;
