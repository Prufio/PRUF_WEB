import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { Home, XSquare, CheckCircle, HelpCircle } from 'react-feather'

class GetACData extends Component {
  constructor(props) {
    super(props);

    //State declaration.....................................................................................................

    this.state = {
      hashPath: "",
      lookupIPFS1: "",
      lookupIPFS2: "",
      addr: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: [],
      result1: "",
      result2: "",
      assetClass: undefined,
      ipfs1: "",
      txHash: "",
      txStatus: false,
      type: "",
      status: "",
      manufacturer: "",
      model: "",
      serial: "",
      to: "",
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
      help: false,
      newACName: "",
      hasLoadedAssetClasses: false,
      acData: undefined
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window

  }

  componentDidUpdate() {//stuff to do when state updates

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {//render continuously produces an up-to-date stateful document  

    const clearForm = () => {
      document.getElementById("MainForm").reset();
      this.setState({ assetClass: undefined, assetClassSelected: false, help: false, transaction: false, acData: undefined })
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const getAC_data = async () => {
      if(this.state.assetClass === undefined) {return}
      let ref;

      if (
        this.state.assetClass.charAt(0) === "0" ||
        this.state.assetClass.charAt(0) === "1" ||
        this.state.assetClass.charAt(0) === "2" ||
        this.state.assetClass.charAt(0) === "3" ||
        this.state.assetClass.charAt(0) === "4" ||
        this.state.assetClass.charAt(0) === "5" ||
        this.state.assetClass.charAt(0) === "6" ||
        this.state.assetClass.charAt(0) === "7" ||
        this.state.assetClass.charAt(0) === "8" ||
        this.state.assetClass.charAt(0) === "9"
      ) {
        ref = "id"
      }
      else {
        ref = "name"
      }

      let acDoesExist = await window.utils.checkForAC(ref, this.state.assetClass);
      if (acDoesExist) {
        let tempData = await window.utils.getACData(ref, this.state.assetClass)
        await this.setState({
          ACData: tempData
        });
        console.log(tempData);
      }
      else { alert("Asset class does not exist!") }
    };

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Search AC Data</h2>
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
              <Form.Row as={Col} controlId="formGridType">
                <Form.Label className="formFont">Asset Class:</Form.Label>
                <Form.Control
                  placeholder="Asset Class"
                  required
                  onChange={(e) => this.setState({ assetClass: e.target.value })}
                  size="lg"
                />
              </Form.Row>
            </div>
          )}
          <>
            <Form.Row>
              <div className="submitButton">
                <div className="submitButtonContent">
                  <CheckCircle
                    onClick={() => { getAC_data() }}
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
            {this.state.help === true && (
              <div className="explainerTextBox3">
                Search AC Data is a function that allows you to search up basuc information regarding any existing asset class. This data includes the asset class's
                index, the asset class's base catergory, the custody type of the asset class, the asset class's price share information, and any extended data related
                to the asset class.
              </div>
            )}
          </>
        </Form>

        <div className="resultsAC">
          {this.state.ACData !== undefined && (
            <div>
              Asset Class Found!
              <br></br>
            AC : {this.state.ACData.AC}
              <br></br>
            Root AC : {this.state.ACData.root}
              <br></br>
            Custody Type : {this.state.ACData.custodyType}
              <br></br>
            Price Share : {Number(this.state.ACData.discount) / 100}%
              <br></br>
            Extended Data : {this.state.ACData.exData}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default GetACData;
