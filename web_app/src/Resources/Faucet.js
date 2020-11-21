import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, CheckCircle, HelpCircle, ArrowRightCircle, CornerUpLeft } from 'react-feather'

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
            if (this.state.ACmenu === false) {
                this.setState({ ACmenu: true })
            }
            else {
                this.setState({ ACmenu: false })
            }
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
            this.setState({
                help: false,
                txStatus: false,
                txHash: "",
                error: undefined,
                result: "",
                transaction: true
            })

            let amount;

            if (this.state.amount < "1000") {
                alert("The minimum amount of PRUF the faucet can provide is 1000. Please input an amount greater than 1000."); return this.clearForm()
            }

            else {
                amount = window.web3.utils.toWei(String(this.state.amount))
            }

            await window.contracts.FAUCET.methods
                .PRUFfaucet(
                    amount,
                    window.addr
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

        const mintAC = async () => {//create a new asset record
            this.setState({
                help: false,
                txStatus: false,
                txHash: "",
                error: undefined,
                result: "",
                transaction: true
            })

            let root;

            if (this.state.catergory === "null") {
                alert("Please select AC catergory before submitting"); return this.clearForm()
            }

            if (this.state.catergory === "Electronics") {
                root = "1"
            }

            if (this.state.catergory === "Collectables") {
                root = "2"
            }

            if (this.state.catergory === "Transportation") {
                root = "3"
            }

            if (this.state.catergory === "Virtual") {
                root = "4"
            }

            if (this.state.catergory === "Other") {
                root = "5"
            }

            await window.contracts.AC_MGR.methods
                .purchaseACtoken(
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
                            <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { this.setState({PRUFmenu: false}) }} /></a>
                        </div>
                    )}
                    {this.state.ACmenu === true && this.state.PRUFmenu === false && (
                        <div className="mediaLinkBack">
                            <a className="mediaLinkContentBack" ><CornerUpLeft onClick={() => { this.setState({ACmenu: false}) }} /></a>
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
                                                    onChange={(e) => this.setState({ ACname: e.target.value })}
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
                                            {/* {window.web3.utils.fromWei(String(window.costs.newRecordCost))}  */}
                                            PRüF</Form.Label>
                                            <div className="submitButton">
                                                <div className="submitButtonContent">
                                                    <CheckCircle
                                                        onClick={() => { mintAC() }}
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
                                            The Electronics catergory consists of laptops, computers, mobile devices, and any circuits or devices using transistors, or microchips.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Collectables" && (
                                        <div className="explainerTextBox2">
                                            The Collecctables catergory consists of any items valued and sought out by collectors such as playing cards, trinkets and valued nik naks.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Transportation" && (
                                        <div className="explainerTextBox2">
                                            The Transportation catergory consists of bicicles, cars, or any other system or means of transporting people or goods.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Virtual" && (
                                        <div className="explainerTextBox2">
                                            The Virtual catergory consists of any virtual collectables or assets. This includes any non-fungable tokens.
                                        </div>
                                    )}
                                    {this.state.help === true && this.state.catergory === "Other" && (
                                        <div className="explainerTextBox2">
                                            The Other catergory covers any unspeccified item not included in the catergories above. Anything.
                                        </div>
                                    )}
                                </div>
                            )}
                            {this.state.ACmenu === false && this.state.PRUFmenu === true && (
                                <div>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridMiddleName">
                                            <Form.Label className="formFont">Amount of PRUF (1000/0.1KETH)</Form.Label>
                                            {this.state.transaction === false && (
                                                <Form.Control
                                                    placeholder="Amount of PRUF"
                                                    required
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
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="submitButton">
                                            <div className="submitButtonContent">
                                                <CheckCircle
                                                    onClick={() => { mintPRUF() }}
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
                )}
            </div>
        )
    }
}

export default Faucet;