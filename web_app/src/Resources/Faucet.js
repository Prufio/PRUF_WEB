import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, CheckCircle, HelpCircle, ArrowRightCircle, CornerUpLeft } from 'react-feather'
import { isMobile } from "react-device-detect";

class Faucet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addr: "",
            lookupIPFS1: "",
            lookupIPFS2: "",
            error: undefined,
            NRerror: undefined,
            result: null,
            assetClass: undefined,
            countDownStart: "",
            ipfs1: "",
            txHash: "",
            assetName: "",
            type: "",
            manufacturer: "",
            model: "",
            serial: "",
            first: "",
            middle: "",
            surname: "",
            id: "",
            secret: "",
            catergory: "null",
            amount: "",
            ACname: "",
            txStatus: null,
            nameTag: "",
            rawIPFSHash: "",
            idxSubmitted: false,
            transaction: false,
            help: false,
            ACmenu: false,
            PRUFmenu: false,
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

    }

    componentWillUnmount() {//stuff do do when component unmounts from the window

    }
    componentDidUpdate() {//stuff to do on a re-render

    }

    render() {//render continuously produces an up-to-date stateful document  
        const self = this;

        const clearForm = async () => {
            if (document.getElementById("MainForm") === null) { return }
            document.getElementById("MainForm").reset()
            this.setState({
                txStatus: null,
                help: false,
                assetClassSelected: false,
                idxSubmitted: false,
            })
        }

        const help = async () => {
            if (this.state.help === false) {
                this.setState({ help: true })
            }
            else {
                this.setState({ help: false })
            }
        }

        const ACmenu = async () => {
            let temp;
            const self = this;
            await window.contracts.AC_MGR.methods.currentACpricingInfo().call(
                function (_error, _result) {
                    if (_error) {
                      return (console.log("IN ERROR IN ERROR IN ERROR"))
                    } 
                    else {
                      self.setState({currentACPrice: window.web3.utils.fromWei(Object.values(_result)[1])})
                      return temp = window.web3.utils.fromWei(Object.values(_result)[1])
                    }
            
                  }
            );

            console.log(temp)

            if (this.state.ACmenu === false) {
                this.setState({ ACmenu: true })
            }
            else {
                this.setState({ ACmenu: false })
            }

            await window.contracts.AC_TKN.methods.totalSupply().call(
                function (_error, _result) {
                    if (_error) {
                      return (console.log("IN ERROR IN ERROR IN ERROR"))
                    } 
                    else {
                      self.setState({totalSupply: _result})
                    }
            
                  }
            );
        }

        const PRUFmenu = async () => {
            if (this.state.PRUFmenu === false) {
                this.setState({ PRUFmenu: true })
            }
            else {
                this.setState({ PRUFmenu: false })
            }
        }

        const mintPRUF = async () => {
            
            let amount;
            if (isNaN(this.state.amount)){return alert("Please input a valid whole number")}
            if (this.state.amount < 10000) {
                alert("The minimum amount of PRUF the faucet can provide is 10000. Please submit an amount greater than or equal to 10000."); return clearForm()
            }

            else {
                amount = window.web3.utils.toWei(String(this.state.amount))
            }

            this.setState({
                help: false,
                txStatus: false,
                txHash: "",
                error: undefined,
                result: "",
                transaction: true
            })


            await window.web3.eth
            .sendTransaction({ from: window.addr, to: "0xA837a86dB071c8531AFf1D301C8Fd0f30c2c1E9A",value: amount/100000})
                .on("error", function (_error) {
                    // self.setState({ NRerror: _error });
                    self.setState({ transaction: false })
                    self.setState({ txHash: Object.values(_error)[0].transactionHash });
                    self.setState({ txStatus: false });
                    alert("Something went wrong!")
                    clearForm();
                    self.setState({ assetClassSelected: false, idxSubmitted: false })
                })
                .on("receipt", (receipt) => {
                    self.setState({ transaction: false })
                    this.setState({ txHash: receipt.transactionHash });
                    this.setState({ txStatus: receipt.status });
                    window.resetInfo = true;
                    window.recount = true;
                });
            // console.log(Object.values(window.web3.eth.getPendingTransactions()))

            this.setState({ assetClassSelected: false, idxSubmitted: false }) //clear form inputs
        }

        const mintAC = async () => {//create a new asset class record
            if(this.state.ACname === undefined || this.state.ACname === "") {return alert("Please name the asset class node prior to submission")}

            let root;

            if (this.state.catergory === "null") {
                alert("Please select AC catergory before submitting"); return clearForm()
            }

            if (this.state.catergory === "Electronics") {
                root = "101"
            }

            if (this.state.catergory === "Collectables") {
                root = "102"
            }

            if (this.state.catergory === "Transportation") {
                root = "103"
            }

            if (this.state.catergory === "Virtual") {
                root = "104"
            }

            if (this.state.catergory === "Other") {
                root = "105"
            }

            this.setState({
                help: false,
                txStatus: false,
                txHash: "",
                error: undefined,
                result: "",
                transaction: true
            })

            await window.contracts.AC_MGR.methods
                .purchaseACnode(
                    this.state.ACname,
                    root,
                    "2",
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                )
                .send({ from: window.addr })
                .on("error", function (_error) {
                    // self.setState({ NRerror: _error });
                    self.setState({ transaction: false })
                    self.setState({ txHash: Object.values(_error)[0].transactionHash });
                    self.setState({ txStatus: false });
                    alert("Something went wrong!")
                    clearForm();
                    self.setState({ assetClassSelected: false, idxSubmitted: false })

                })
                .on("receipt", (receipt) => {
                    self.setState({ transaction: false })
                    this.setState({ txHash: receipt.transactionHash });
                    this.setState({ txStatus: receipt.status });
                    window.resetInfo = true;
                    window.recount = true;
                });
            // console.log(Object.values(window.web3.eth.getPendingTransactions()))

            this.setState({ assetClassSelected: false, idxSubmitted: false }) //clear form inputs
        }

        if(isMobile){//Mobile render
            return(
                    <div>
                        <div>
                            <div className="mediaLinkADHome">
                                <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                            </div>
                            {this.state.ACmenu === false && this.state.PRUFmenu === false && (
                                <h2 className="formHeaderMobile">Faucet</h2>
                            )}
                            {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                                <h2 className="formHeaderMobile">Mint AC</h2>
                            )}
                            {this.state.PRUFmenu === true && this.state.ACmenu === false && (
                                <h2 className="formHeaderMobile">PRUF Faucet</h2>
                            )}
                            {this.state.PRUFmenu === false && this.state.ACmenu === false && (
                                <div className="mediaLinkClearForm">
                                    <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
                                </div>
                            )}
                            {this.state.PRUFmenu === true && this.state.ACmenu === false && (
                                <div className="mediaLinkClearForm2">
                                    <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
                                </div>
                            )}
                            {this.state.PRUFmenu === false && this.state.ACmenu === true && (
                                <div className="mediaLinkClearForm2">
                                    <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
                                </div>
                            )}
                            {this.state.PRUFmenu === true && this.state.ACmenu === false && (
                                <div className="mediaLinkBack">
                                    <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { this.setState({ PRUFmenu: false }) }} /></a>
                                </div>
                            )}
                            {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                                <div className="mediaLinkBack">
                                    <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { this.setState({ ACmenu: false }) }} /></a>
                                </div>
                            )}
                        </div>
                        <Form className="formMobile" id='MainForm'>
                            {window.addr === undefined && (
                                <div className="resultsMobile">
                                    <h2>User address unreachable</h2>
                                    <h3>Please connect web3 provider.</h3>
                                </div>
                            )}
        
                            {window.addr > 0 && (
                                <>
                                    {this.state.ACmenu === false && this.state.PRUFmenu === false && (
                                        <div>
                                            {/* <div className="submitButtonRRMobile">
                                                <div className="submitButtonContentMobile">
                                                    <ArrowRightCircle
                                                        onClick={() => { ACmenu() }}
                                                    />
                                                </div>
                                            </div>
                                            <Form.Label className="formFontFaucetMobile">Purchase AC</Form.Label>
                                            <br></br> */}
                                            <br></br>
                                            <div>
                                                <div className="submitButtonRRMobile">
                                                    <div className="submitButtonContentMobile">
                                                        <ArrowRightCircle
                                                            onClick={() => { PRUFmenu() }}
                                                        />
                                                    </div>
                                                </div>
        
                                                <Form.Label className="formFontFaucetMobile">Get PRUF</Form.Label>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                                        <div>
                                            <Form.Row>
                                                <Form.Group as={Col} controlId="formGridMiddleName">
                                                    <Form.Label className="formFont">Asset Class Name:</Form.Label>
                                                    {this.state.transaction === false && (
                                                        <Form.Control
                                                            placeholder="Asset Class Name"
                                                            required
                                                            onChange={(e) => this.setState({ ACname: e.target.value.trim() })}
                                                            size="lg"
                                                        />
                                                    )}
                                                    {this.state.transaction === true && (
                                                        <Form.Control
                                                            placeholder={this.state.ACname}
                                                            disabled
                                                            size="lg"
                                                        />
                                                    )}
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Group as={Col} controlId="formGridMiddleName">
                                                    <Form.Label className="formFont">Asset Class Catergory:</Form.Label>
                                                    {this.state.transaction === false && (
                                                        <Form.Control as="select" size="lg" onChange={(e) => this.setState({ catergory: e.target.value })}>
                                                            <optgroup className="optgroup">
                                                                <option value="null">Please Select Catergory</option>
                                                                <option value="Electronics">Electronics</option>
                                                                <option value="Collectables">Collectables</option>
                                                                <option value="Transportation">Transportation</option>
                                                                <option value="Virtual">Virtual</option>
                                                                <option value="Other">Other</option>
                                                            </optgroup>
                                                        </Form.Control>
                                                    )}
                                                    {this.state.transaction === true && (
                                                        <Form.Control as="select" size="lg" disabled>
                                                            <optgroup className="optgroup">
                                                                <option value="null">{this.state.catergory}</option>
                                                            </optgroup>
                                                        </Form.Control>
                                                    )}
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <div>
                                                    <Form.Label className="costText"> Cost of AC :
                                                    ü{this.state.currentACPrice}
                                                    </Form.Label>
                                                    <div className="submitButtonRRMobile">
                                                        <div className="submitButtonContentMobile">
                                                            <CheckCircle
                                                                onClick={() => { mintAC() }}
                                                                /* onClick={() => { alert("This function has been disabled until Alpha testing begins") }} */
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mediaLinkHelp">
                                                    <div className="mediaLinkHelpContentMobile">
                                                        <HelpCircle
                                                            onClick={() => { help() }}
                                                        />
                                                    </div>
                                                </div>
                                            </Form.Row>
                                            {this.state.help === true && this.state.catergory === "null" && (
                                                <div className="explainerTextBoxMobile">
                                                    An asset class's catergory will determine the class of assets that will be managed by the asset class token holder's node.
                                                </div>
                                            )}
                                            {this.state.help === true && this.state.catergory === "Electronics" && (
                                                <div className="explainerTextBoxMobile">
                                                    The Electronics catergory consists of laptops, computers, mobile devices, etc.
                                                </div>
                                            )}
                                            {this.state.help === true && this.state.catergory === "Collectables" && (
                                                <div className="explainerTextBoxMobile">
                                                    The Collectables catergory consists of any items valued and sought out by collectors such as playing cards, trinkets and valued nik naks.
                                                </div>
                                            )}
                                            {this.state.help === true && this.state.catergory === "Transportation" && (
                                                <div className="explainerTextBoxMobile">
                                                    The Transportation catergory consists of bicycles, cars, or any other system or means of transporting people or goods.
                                                </div>
                                            )}
                                            {this.state.help === true && this.state.catergory === "Virtual" && (
                                                <div className="explainerTextBoxMobile">
                                                    The Virtual catergory consists of any virtual collectables or assets. This includes any non-fungable tokens.
                                                </div>
                                            )}
                                            {this.state.help === true && this.state.catergory === "Other" && (
                                                <div className="explainerTextBoxMobile">
                                                    The Other catergory covers any unspecified item not included in the catergories above.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {this.state.ACmenu === false && this.state.PRUFmenu === true && (
                                        <div>
                                            <Form.Row>
                                                <Form.Group as={Col} controlId="formGridMiddleName">
                                                    <Form.Label className="formFont">Amount of PRUF (ü100000/Ξ1)</Form.Label>
                                                    {this.state.transaction === false && (
                                                        <Form.Control
                                                            placeholder="Amount of PRUF"
                                                            required
                                                            onChange={(e) => this.setState({ amount: e.target.value.trim() })}
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
                                                    <Form.Label className="formFont">(minimum = ü10000)</Form.Label>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <div className="submitButtonRRMobile">
                                                    <div className="submitButtonContentMobile">
                                                        <CheckCircle
                                                            onClick={() => { mintPRUF() }}
                                                            // onClick={() => { alert("This function has been disabled until Alpha testing begins") }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mediaLinkHelp">
                                                    <div className="mediaLinkHelpContentMobile">
                                                        <HelpCircle
                                                            onClick={() => { help() }}
                                                        />
                                                    </div>
                                                </div>
                                            </Form.Row>
                                            {this.state.help === true && (
                                                <div className="explainerTextBoxMobile">
                                                    The (fungible) PRüF utility token (PRUF) is used primarily as “gas” for tokenizing, modifying, and transferring assets. In addition to operating functions
                                                    of the network,it serves as an incentive mechanism for PRüF node operators and network users, as well as the medium for acquiring and upgrading PRüF nodes.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                        {this.state.transaction === true && (
                            <div className="resultsMobile">
                                <h1 className="loadingh1">Transaction In Progress</h1>
                            </div>)}
                        {this.state.transaction === false && (
                            <div className="resultsMobile">
                                {this.state.txHash > 0 && ( //conditional rendering
                                    <div>
                                        {this.state.txStatus === false && (
                                            <div>
                                                !ERROR! :
                                                <a
                                                    href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    TX Hash:{this.state.txHash}
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
                                                    TX Hash:{this.state.txHash}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
            )
        }

        return (//default render
            <div>
                <div>
                    <div className="mediaLinkADHome">
                        <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                    </div>
                    {this.state.ACmenu === false && this.state.PRUFmenu === false && (
                        <h2 className="formHeader">Faucet</h2>
                    )}
                    {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                        <h2 className="formHeader">Mint AC</h2>
                    )}
                    {this.state.PRUFmenu === true && this.state.ACmenu === false && (
                        <h2 className="formHeader">PRUF Faucet</h2>
                    )}
                    {this.state.PRUFmenu === false && this.state.ACmenu === false && (
                        <div className="mediaLinkClearForm">
                            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
                        </div>
                    )}
                    {this.state.PRUFmenu === true && this.state.ACmenu === false && (
                        <div className="mediaLinkClearForm2">
                            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
                        </div>
                    )}
                    {this.state.PRUFmenu === false && this.state.ACmenu === true && (
                        <div className="mediaLinkClearForm2">
                            <a className="mediaLinkContentClearForm" ><XSquare onClick={() => { clearForm() }} /></a>
                        </div>
                    )}
                    {this.state.PRUFmenu === true && this.state.ACmenu === false && (
                        <div className="mediaLinkBack">
                            <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { this.setState({ PRUFmenu: false }) }} /></a>
                        </div>
                    )}
                    {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                        <div className="mediaLinkBack">
                            <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { this.setState({ ACmenu: false }) }} /></a>
                        </div>
                    )}
                </div>
                <Form className="form" id='MainForm'>
                    {window.addr === undefined && (
                        <div className="errorResults">
                            <h2>User address unreachable</h2>
                            <h3>Please connect web3 provider.</h3>
                        </div>
                    )}

                    {window.addr > 0 && (
                        <>
                            {this.state.ACmenu === false && this.state.PRUFmenu === false && (
                                <div>
                                    <div className="submitButtonFaucet">
                                        <div className="submitButtonContent">
                                            <ArrowRightCircle
                                                onClick={() => { ACmenu() }}
                                            />
                                        </div>
                                    </div>
                                    <Form.Label className="formFontFaucet">Purchase AC</Form.Label>
                                    <br></br>
                                    <br></br>
                                    <div>
                                        <div className="submitButtonFaucet">
                                            <div className="submitButtonContent">
                                                <ArrowRightCircle
                                                    onClick={() => { PRUFmenu() }}
                                                />
                                            </div>
                                        </div>

                                        <Form.Label className="formFontFaucet">Get PRUF</Form.Label>
                                    </div>
                                </div>
                            )}
                            {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                                <div>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridMiddleName">
                                            <Form.Label className="formFont">Asset Class Name:</Form.Label>
                                            {this.state.transaction === false && (
                                                <Form.Control
                                                    placeholder="Asset Class Name"
                                                    required
                                                    onChange={(e) => this.setState({ ACname: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            )}
                                            {this.state.transaction === true && (
                                                <Form.Control
                                                    placeholder={this.state.ACname}
                                                    disabled
                                                    size="lg"
                                                />
                                            )}
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridMiddleName">
                                            <Form.Label className="formFont">Asset Class Catergory:</Form.Label>
                                            {this.state.transaction === false && (
                                                <Form.Control as="select" size="lg" onChange={(e) => this.setState({ catergory: e.target.value })}>
                                                    <optgroup className="optgroup">
                                                        <option value="null">Please Select Catergory</option>
                                                        <option value="Electronics">Electronics</option>
                                                        <option value="Collectables">Collectables</option>
                                                        <option value="Transportation">Transportation</option>
                                                        <option value="Virtual">Virtual</option>
                                                        <option value="Other">Other</option>
                                                    </optgroup>
                                                </Form.Control>
                                            )}
                                            {this.state.transaction === true && (
                                                <Form.Control as="select" size="lg" disabled>
                                                    <optgroup className="optgroup">
                                                        <option value="null">{this.state.catergory}</option>
                                                    </optgroup>
                                                </Form.Control>
                                            )}
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <div>
                                            <Form.Label className="costText"> Cost of AC :
                                            ü{this.state.currentACPrice}
                                            </Form.Label>
                                            <div className="submitButton">
                                                <div className="submitButtonContent">
                                                    <CheckCircle
                                                        onClick={() => { mintAC() }}
                                                        //onClick={() => { alert("This function has been disabled until Alpha testing begins") }}
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
                                    {this.state.help === true && this.state.catergory === "null" && (
                                        <div className="explainerTextBox2">
                                            An asset class's catergory will determine the class of assets that will be managed by the asset class token holder's node.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Electronics" && (
                                        <div className="explainerTextBox2">
                                            The Electronics catergory consists of laptops, computers, mobile devices, etc.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Collectables" && (
                                        <div className="explainerTextBox2">
                                            The Collectables catergory consists of any items valued and sought out by collectors such as playing cards, trinkets and valued nik naks.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Transportation" && (
                                        <div className="explainerTextBox2">
                                            The Transportation catergory consists of bicycles, cars, or any other system or means of transporting people or goods.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Virtual" && (
                                        <div className="explainerTextBox2">
                                            The Virtual catergory consists of any virtual collectables or assets. This includes any non-fungable tokens.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Other" && (
                                        <div className="explainerTextBox2">
                                            The Other catergory covers any unspecified item not included in the catergories above.
                                        </div>
                                    )}
                                </div>
                            )}
                            {this.state.ACmenu === false && this.state.PRUFmenu === true && (
                                <div>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridMiddleName">
                                            <Form.Label className="formFont">Amount of PRUF (ü100000/Ξ1)</Form.Label>
                                            {this.state.transaction === false && (
                                                <Form.Control
                                                    placeholder="Amount of PRUF"
                                                    required
                                                    onChange={(e) => this.setState({ amount: e.target.value.trim() })}
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
                                        <Form.Label className="formFont">(minimum = ü10000)</Form.Label>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="submitButton">
                                            <div className="submitButtonContent">
                                                <CheckCircle
                                                    onClick={() => { mintPRUF() }}
                                                    // onClick={() => { alert("This function has been disabled until Alpha testing begins") }}
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
                                        <div className="explainerTextBox2">
                                            The (fungible) PRüF utility token (PRUF) is used primarily as “gas” for tokenizing, modifying, and transferring assets. In addition to operating functions
                                            of the network,it serves as an incentive mechanism for PRüF node operators and network users, as well as the medium for acquiring and upgrading PRüF nodes.
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </Form>
                {this.state.transaction === true && (
                    <div className="results">
                        <h1 className="loadingh1">Transaction In Progress</h1>
                    </div>)}
                {this.state.transaction === false && (
                    <div className="results">
                        {this.state.txHash > 0 && ( //conditional rendering
                            <div>
                                {this.state.txStatus === false && (
                                    <div>
                                        !ERROR! :
                                        <a
                                            href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            TX Hash:{this.state.txHash}
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
                                            TX Hash:{this.state.txHash}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}

export default Faucet;
