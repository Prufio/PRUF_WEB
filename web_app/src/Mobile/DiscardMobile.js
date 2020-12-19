import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Trash2, Home, XSquare, AlertTriangle } from 'react-feather'

class DiscardMobile extends Component {
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
            txStatus: false,
            idxHash: "",
            transaction: false,
            hasLoadedAssets: false,
            assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
            help: false
        };
    }

    //component state-change events......................................................................................................

    componentDidMount() {//stuff to do when component mounts in window
        if (window.sentPacket !== undefined) {
            if (Number(window.sentPacket.statusNum) !== 59) {
                window.sentPacket = undefined;
                alert("Asset is not discardable! Owner must set status to discardable.");
                return window.location.href = "/#/asset-dashboard-mobile"
            }

            this.setState({ name: window.sentPacket.name })
            this.setState({ idxHash: window.sentPacket.idxHash })
            this.setState({ assetClass: window.sentPacket.assetClass })
            this.setState({ status: window.sentPacket.status })
            console.log("Stat", window.sentPacket.status)

            window.sentPacket = undefined
            this.setState({ wasSentPacket: true })
        }

        this.setState({ runWatchDog: true })

    }

    componentWillUnmount() {//stuff do do when component unmounts from the window
        this.setState({ runWatchDog: false });
    }
    componentDidUpdate() {//stuff to do on a re-render

    }

    render() {//render continuously produces an up-to-date stateful document  
        const self = this;

        const _checkIn = async (e) => {
            this.setState({ help: false })
            if (e === "null" || e === undefined) { return }
            else if (e === "reset") {
                return window.resetInfo = true;
            }
            else if (e === "assetDash") {
                return window.location.href = "/#/asset-dashboard-mobile-mobile"
            }

            let resArray = await window.utils.checkStats(window.assets.ids[e], [0])

            console.log(resArray)

            if (Number(resArray[0]) !== 59) {
                alert("Asset not in discardable status"); return clearForm()
            }

            this.setState({ selectedAsset: e })
            console.log("Changed component idx to: ", window.assets.ids[e])

            this.setState({
                assetClass: window.assets.assetClasses[e],
                idxHash: window.assets.ids[e],
                name: window.assets.descriptions[e].name,
                photos: window.assets.descriptions[e].photo,
                text: window.assets.descriptions[e].text,
                description: window.assets.descriptions[e],
                status: window.assets.statuses[e],
                note: window.assets.notes[e]
            })
        }

        const clearForm = async () => {
            if (document.getElementById("MainForm") === null) { return }
            document.getElementById("MainForm").reset();
            this.setState({ idxHash: "", txStatus: false, txHash: "", wasSentPacket: false, help: false })
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

        const _discardAsset = async () => {//create a new asset record
            this.setState({ help: false })
            this.setState({ txStatus: false });
            this.setState({ txHash: "" });
            this.setState({ error: undefined })
            this.setState({ result: "" })
            this.setState({ transaction: true })
            //reset state values before form resubmission
            var idxHash = this.state.idxHash;

            console.log("idxHash", idxHash);
            console.log("addr: ", this.state.agentAddress);

            await window.contracts.A_TKN.methods
                .discard(
                    idxHash
                )
                .send({ from: window.addr })
                .on("error", function (_error) {
                    // self.setState({ NRerror: _error });
                    self.setState({ transaction: false })
                    self.setState({ txHash: Object.values(_error)[0].transactionHash });
                    self.setState({ txStatus: false, wasSentPacket: false });
                    alert("Something went wrong!")
                    clearForm();
                    console.log(Object.values(_error)[0].transactionHash);
                })
                .on("receipt", (receipt) => {
                    self.setState({ transaction: false })
                    this.setState({ txHash: receipt.transactionHash });
                    this.setState({ txStatus: receipt.status });
                    window.resetInfo = true;
                    window.recount = true;
                    if (this.state.wasSentPacket) {
                        return window.location.href = '/#/asset-dashboard-mobile'
                    }
                });

            return clearForm(); //clear form inputs
        };

        return (//default render
            <div>
                <div>
                    <div className="mediaLinkADHome">
                        <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                    </div>
                    <h2 className="formHeaderMobile">Discard Asset</h2>
                    <div className="mediaLinkClearForm">
                        <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
                    </div>
                </div>
                <Form
                    className="formMobile"
                    id='MainForm'
                    onSubmit={submitHandler}
                >

                    {window.addr === undefined && (
                        <div className="resultsMobile">
                            <h2>User address unreachable</h2>
                            <h3>Please
                <a
                                    onClick={() => {
                                        this.setState({ userMenu: undefined })
                                        if (window.ethereum) { window.ethereum.enable() }
                                        else { alert("You do not currently have a Web3 provider installed, we recommend MetaMask"); }
                                    }
                                    }
                                    className="userDataLink">
                                    Log In
                </a>
                  to web3 provider.
                  </h3>
                        </div>
                    )}
                    {window.addr > 0 && (
                        <div>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridAsset">
                                    <Form.Label className="formFont"> Select an Asset to Discard:</Form.Label>
                                    {!this.state.wasSentPacket && (
                                        <>
                                            {this.state.transaction === false && (
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
                                            {this.state.transaction === true && (
                                                <Form.Control
                                                    as="select"
                                                    size="lg"
                                                    disabled
                                                >
                                                    <optgroup className="optgroup">
                                                        <option>Discarding "{this.state.name}"</option>
                                                    </optgroup>
                                                </Form.Control>)}
                                        </>
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
                                                    Discarding "{this.state.name}" Clear Form to Select Different Asset
                                        </option>
                                            </optgroup>
                                        </Form.Control>
                                    )}
                                </Form.Group>
                            </Form.Row>
                            {this.state.transaction === false && (
                                <>
                                    <Form.Row>
                                        <div className="submitButtonRRMobile">
                                            <div className="submitButtonContentMobile">
                                                <Trash2
                                                    onClick={() => { _discardAsset() }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mediaLinkHelp">
                                            <div className="mediaLinkHelpContentMobile">
                                                <AlertTriangle
                                                    onClick={() => { help() }}
                                                />
                                            </div>
                                        </div>
                                    </Form.Row>
                                    {this.state.help === true && (
                                        <div className="explainerTextBoxMobile">
                                            Discarding an asset requires that the asset is in discardable status. Discarding an asset will burn the asset token
                                            linked to the asset. The individual discarding the asset will recieve a bonus in PRuF tokens once the following user
                                            recycles the asset into their ownership using Recycle Asset.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </Form>
                {this.state.transaction === false && this.state.txStatus === false && (
                    <div className="assetSelectedResultsMobile">
                        <Form.Row>
                            {this.state.idxHash !== "" && this.state.txHash === "" && (
                                <Form.Group>
                                    <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContentMobile">{this.state.idxHash.substring(0, 18) + "..." + this.state.idxHash.substring(48, 66)}</span> </div>
                                    <div className="assetSelectedContentHead">Asset Name: <span className="assetSelectedContentMobile">{this.state.name}</span> </div>
                                    <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContentMobile">{this.state.assetClass}</span> </div>
                                    <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContentMobile">{this.state.status}</span> </div>
                                </Form.Group>
                            )}
                        </Form.Row>
                    </div>
                )}
                {this.state.transaction === true && (
                    <div className="resultsMobile">
                        <h1 className="loadingh1">Transaction In Progress</h1>
                    </div>)}
                {this.state.transaction === false && (
                    <div>
                        {this.state.txHash > 0 && ( //conditional rendering
                            <div className="resultsMobile">
                                {this.state.txStatus === false && (
                                    <div className="transactionErrorTextMobile">
                                        !ERROR! :
                                        <a
                                            className="transactionErrorTextMobile"
                                            href={"https://kovan.etherscan.io/tx/" + this.state.txHash}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            TX Hash:{this.state.txHash}
                                        </a>
                                    </div>
                                )}
                                {this.state.txStatus === true && (
                                    <div className="transactionErrorTextMobile">
                                        {" "}
        No Errors Reported :
                                        <a
                                            className="transactionErrorTextMobile"
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
        );
    }
}

export default DiscardMobile;
