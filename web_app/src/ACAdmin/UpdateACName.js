import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ArrowRightCircle} from 'react-feather'

class UpdateACName extends Component {
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
      newACName: "",
      assetClass: "",
      hasLoadedAssetClasses: false
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
      this.setState({ assetClass: e.id, assetClassSelected: true, custodyType: e.custodyType, ACName: e.name, root: e.root });
      return console.log(e);
    }

    const updateName = async () => {
      var alreadyExists = await window.utils.checkACName(this.state.newACName)

      if (alreadyExists) {
        return (alert("AC name already exists! Choose a different name and try again"))
      }
      else {
        await window.contracts.AC_MGR.methods
          .updateACname(
            this.state.newACName,
            window.assetClass
          )
          .send({ from: window.addr })
          .on("error", function (_error) {
            self.setState({ error: _error });
            self.setState({ result: _error.transactionHash });
            return clearForm();
          })
          .on("receipt", (receipt) => {
            console.log(
              "updated name to ", self.state.newACName, " in AC ",
              window.assetClass
            );
            console.log("tx receipt: ", receipt);
            return clearForm();
          });

        console.log(this.state.txHash);
      };
    }


    return (
      <div>
        <Form className="form">
          {window.addr === undefined && (
            <div className="VRresults">
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
              <h2 className="headerText">Update AC Name</h2>
              <br></br>
              <Form.Group as={Col} controlId="formGridContractName">
                <Form.Label className="formFont">New AC Name :</Form.Label>
                <Form.Control
                  placeholder="AC Name"
                  required
                  onChange={(e) => this.setState({ newACName: e.target.value })}
                  size="lg"
                />
              </Form.Group>
              
              <Form.Group>
                <Button className="buttonDisplay"
                  variant="primary"
                  type="button"
                  size="lg"
                  onClick={updateName}
                >
                  Update
                </Button>
              </Form.Group>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

export default UpdateACName;
