import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ArrowRightCircle} from 'react-feather'


class AddUser extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.updateAssets = setInterval(() => {
      if (this.state.assetClasses !== window.assetsClasses && this.state.runWatchDog === true) {
        this.setState({ assetClasses: window.assetClasses })
      }

      if (this.state.hasLoadedAssetClasses !== window.hasLoadedAssetClasses && this.state.runWatchDog === true) {
        this.setState({ hasLoadedAssetClasses: window.hasLoadedAssetClasses })
      }
    }, 100)

    this.state = {
      addr: "",
      error: undefined,
      result: "",
      authAddr: "",
      userType: "",
      assetClass: "",
      transaction: false,
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    this.setState({runWatchDog: true})
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

    const _setAC = async (e) => {
        return this.setState({ assetClass: e, assetClassSelected: true });
      }

    const addUser = () => {
      if(Number(this.state.userType) < 1){return alert("Please select a user type from the dropdown")}
      window.contracts.AC_MGR.methods
        .OO_addUser(
          this.state.authAddr,
          this.state.userType,
          this.state.assetClass
        )
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({ error: _error });
          self.setState({ result: _error.transactionHash });
          return clearForm();
        })
        .on("receipt", (receipt) => {
          console.log(
            "user added succesfully under asset class",
            self.state.assetClass
          );
          console.log("tx receipt: ", receipt);
          return clearForm();
        });
      this.setState({transaction: true})
      console.log(this.state.txHash);
    };

    return (
      <div>
        <Form id="MainForm" className="form">
          {window.addr === undefined && (
            <div className="errorResults">
              <h2>User address unreachable</h2>
              Please connect web3 provider.
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
              <h2 className="headerText">Add User</h2>
              <br></br>

              <Form.Group as={Col} controlId="formGridContractName">
                <Form.Label className="formFont">
                  User Address :
                </Form.Label>
                <Form.Control
                  placeholder="Authorized Address"
                  required
                  onChange={(e) => this.setState({ authAddr: e.target.value })}
                  size="lg"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridACClass">
                <Form.Label className="formFont">User Type :</Form.Label>
                <Form.Control
                          as="select"
                          size="lg"
                          onChange={(e) => this.setState({ userType: e.target.value })} 
                          >
                            <optgroup className="optgroup">
                              <option value="0000"> Select a User Type </option>
                              <option value="1"> Custodian </option>
                              <option value="2"> NFM Custodian </option>
                              <option value="9"> Automation </option>
                            </optgroup>

                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Button className="buttonDisplay"
                  variant="primary"
                  type="button"
                  size="lg"
                  onClick={addUser}
                >
                  Submit
                </Button>
              </Form.Group>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

export default AddUser;
