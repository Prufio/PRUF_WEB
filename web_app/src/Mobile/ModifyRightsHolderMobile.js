import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, HelpCircle, CheckCircle } from "react-feather";

class ModifyRightsHolderMobile extends Component {
    constructor(props) {
        super(props);

        this.updateAssets = setInterval(() => {
            if (this.state.assets !== window.assets && this.state.runWatchDog === true) {
                this.setState({ assets: window.assets })
            }

            if (this.state.hasLoadedAssets !== window.hasLoadedAssets && this.state.runWatchDog === true) {
                this.setState({ hasLoadedAssets: window.hasLoadedAssets })
            }
        }, 50)

        //State declaration.....................................................................................................

        this.state = {
            addr: "",
            costArray: [0],
            error: undefined,
            NRerror: undefined,
            result1: "",
            result2: "",
            assetClass: undefined,
            ipfs1: "",
            txHash: "",
            txStatus: false,
            type: "",
            manufacturer: "",
            model: "",
            idxHash: "",
            serial: "",
            to: "",
            hasLoadedAssets: false,
            assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
            transaction: false,
            help: false
        };
    }

    //component state-change events......................................................................................................

    componentDidMount() {//stuff to do when component mounts in window
        if (window.sentPacket !== undefined) {
            console.log(window.sentPacket.status)
            if (Number(window.sentPacket.statusNum) === 3 || Number(window.sentPacket.statusNum) === 4 || Number(window.sentPacket.statusNum) === 53 || Number(window.sentPacket.statusNum) === 54) {
                alert("Cannot edit asset in lost or stolen status! Please change to transferable status");
                window.sentPacket = undefined;
                return window.location.href = "/#/asset-dashboard-mobile"
            }

            if (Number(window.sentPacket.statusNum) === 50 || Number(window.sentPacket.statusNum) === 56) {
                alert("Cannot edit asset in escrow! Please wait until asset has met escrow conditions");
                window.sentPacket = undefined;
                return window.location.href = "/#/asset-dashboard-mobile"
            }

            if (Number(window.sentPacket.statusNum) === 58) {
                alert("Cannot edit asset in imported status! please change to transferable status");
                window.sentPacket = undefined;
                return window.location.href = "/#/asset-dashboard-mobile"
            }

            if (Number(window.sentPacket.statusNum) === 70) {
                alert("Cannot edit asset in exported status! please import asset and change to transferable status");
                window.sentPacket = undefined;
                return window.location.href = "/#/asset-dashboard-mobile"
            }

            if (Number(window.sentPacket.statusNum) !== 51) {
                alert("Cannot edit asset in a status other than transferable! please change asset to transferable status");
                window.sentPacket = undefined;
                return window.location.href = "/#/asset-dashboard-mobile"
            }

            this.setState({ name: window.sentPacket.name })
            this.setState({ idxHash: window.sentPacket.idxHash })
            this.setState({ assetClass: window.sentPacket.assetClass })
            this.setState({ status: window.sentPacket.status })


            window.sentPacket = undefined
            this.setState({ wasSentPacket: true })
        }

        this.setState({ runWatchDog: true })
    }

    componentWillUnmount() {//stuff do do when component unmounts from the window
        clearInterval(this.updateAssets);
        this.setState({ runWatchDog: false });
    }

    componentDidUpdate() {//stuff to do when state updates

    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }


    handleScan = async (data) => {
        if (data) {
            let tempBool = await window.utils.checkAssetExistsBare(data)
            if (tempBool === true) {
                this.setState({
                    result: data,
                    QRRR: true,
                    assetFound: "Asset Found!"
                })
                console.log(data)
                this.accessAsset()
            }
            else {
                this.setState({
                    assetFound: "Asset Not Found",
                })
            }
        }
    }

    handleError = err => {
        console.error(err)
    }


    render() {//render continuously produces an up-to-date stateful document  
        const self = this;

        const _checkIn = async (e) => {
            this.setState({ help: false })
            console.log("Checking in with id: ", e)
            if (e === "null" || e === undefined) {
                return clearForm()
            }
            else if (e === "reset") {
                return window.resetInfo = true;
            }
            else if (e === "assetDash") {
                console.log("heading over to dashboard")
                return window.location.href = "/#/asset-dashboard-mobile-mobile"
            }

            let resArray = await window.utils.checkStats(window.assets.ids[e], [0, 2])

            console.log(resArray)


            if (Number(resArray[1]) === 0) {
                alert("Asset does not exist at given IDX"); return clearForm()
            }

            if (Number(resArray[0]) !== 51) {
                alert("Asset not in editRgtHashrable status"); return clearForm()
            }

            this.setState({ selectedAsset: e })
            console.log("Changed component idx to: ", window.assets.ids[e])

            return this.setState({
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

        const editRgtHash = async () => {
            this.setState({ help: false })
            this.setState({ txStatus: false });
            this.setState({ txHash: "" });
            this.setState({ error: undefined })
            this.setState({ result: "" })
            this.setState({ transaction: true })
            var idxHash = this.state.idxHash;
            var newRgtRaw;
            if(idxHash === undefined || idxHash === "null" || idxHash === ""){return alert("Please select an asset from the dropdown")}
            newRgtRaw = window.web3.utils.soliditySha3(
                String(this.state.first).replace(/\s/g, ''),
                String(this.state.middle).replace(/\s/g, ''),
                String(this.state.surname).replace(/\s/g, ''),
                String(this.state.id).replace(/\s/g, ''),
                String(this.state.secret).replace(/\s/g, '')
            );

            var newRgtHash = window.web3.utils.soliditySha3(idxHash, newRgtRaw);

            console.log("idxHash", idxHash);
            console.log("New rgtHash", newRgtHash);
            console.log("addr: ", window.addr);

            await window.contracts.NP_NC.methods
                ._changeRgt(idxHash, newRgtHash)
                .send({ from: window.addr })
                .on("error", function (_error) {
                    // self.setState({ NRerror: _error });
                    self.setState({ transaction: false })
                    self.setState({ txHash: Object.values(_error)[0].transactionHash });
                    self.setState({ txStatus: false });
                    alert("Something went wrong!")
                    clearForm();
                    console.log(Object.values(_error)[0].transactionHash);
                })
                .on("receipt", (receipt) => {
                    self.setState({ transaction: false })
                    this.setState({ txHash: receipt.transactionHash });
                    this.setState({ txStatus: receipt.status });
                    console.log(receipt.status);
                    if (self.state.wasSentPacket) {
                        return window.location.href = '/#/asset-dashboard-mobile'
                    }
                    //Stuff to do when tx confirms
                });

            console.log(this.state.txHash);
            return this.setState({ idxHash: undefined, wasSentPacket: false });
        };

        return (
            <div>
                <div>
                    <div className="mediaLinkADHome">
                        <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
                    </div>
                    <h2 className="formHeaderMobile">Modify Rights Holder</h2>
                    <div className="mediaLinkClearForm">
                        <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
                    </div>
                </div>
                <Form className="formMobile" id='MainForm' onSubmit={submitHandler}>
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
                                    <Form.Label className="formFont"> Select an Asset to Modify:</Form.Label>
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
                                                        <option>Modifying "{this.state.name}"</option>
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
                                                    Modifying "{this.state.name}" Clear Form to Select Different Asset
                                                </option>
                                            </optgroup>
                                        </Form.Control>
                                    )}
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridTo">
                                    {this.state.transaction === false && (
                                        <>
                                            <Form.Row>
                                                <Form.Label className="formFont">New First Name:</Form.Label>
                                                <Form.Control
                                                    placeholder="First Name"
                                                    required
                                                    onChange={(e) => this.setState({ first: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label className="formFont">New Middle Name:</Form.Label>
                                                <Form.Control
                                                    placeholder="Middle Name"
                                                    required
                                                    onChange={(e) => this.setState({ middle: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label className="formFont">New Last Name:</Form.Label>
                                                <Form.Control
                                                    placeholder="Last Name"
                                                    required
                                                    onChange={(e) => this.setState({ surname: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>

                                            <Form.Row>
                                                <Form.Label className="formFont">New ID Number:</Form.Label>
                                                <Form.Control
                                                    placeholder="ID Number"
                                                    required
                                                    onChange={(e) => this.setState({ id: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label className="formFont">New Password:</Form.Label>
                                                <Form.Control
                                                    placeholder="Password"
                                                    className="key"
                                                    type="text"
                                                    required
                                                    onChange={(e) => this.setState({ secret: e.target.value.trim() })}
                                                    size="lg"
                                                    autoComplete="off"
                                                />
                                            </Form.Row>
                                        </>
                                    )}
                                    {this.state.transaction === true && (
                                        <>
                                            <Form.Row>
                                                <Form.Label className="formFont">New First Name:</Form.Label>
                                                <Form.Control
                                                    placeholder={this.state.first}
                                                    required
                                                    disabled
                                                    onChange={(e) => this.setState({ first: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label className="formFont">New Middle Name:</Form.Label>
                                                <Form.Control
                                                    placeholder={this.state.middle}
                                                    required
                                                    disabled
                                                    onChange={(e) => this.setState({ middle: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label className="formFont">New Last Name:</Form.Label>
                                                <Form.Control
                                                    placeholder={this.state.surname}
                                                    required
                                                    disabled
                                                    onChange={(e) => this.setState({ surname: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>

                                            <Form.Row>
                                                <Form.Label className="formFont">New ID Number:</Form.Label>
                                                <Form.Control
                                                    placeholder={this.state.id}
                                                    required
                                                    disabled
                                                    onChange={(e) => this.setState({ id: e.target.value.trim() })}
                                                    size="lg"
                                                />
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label className="formFont">New Password:</Form.Label>
                                                <Form.Control
                                                    placeholder="*******"
                                                    className="key"
                                                    type="text"
                                                    required
                                                    disabled
                                                    onChange={(e) => this.setState({ secret: e.target.value.trim() })}
                                                    size="lg"
                                                    autoComplete="off"
                                                />
                                            </Form.Row>
                                        </>
                                    )}
                                </Form.Group>
                            </Form.Row>
                            {this.state.transaction === false && (
                                <>
                                    <Form.Row>
                                        <div className="submitButtonRRMobile">
                                            <div className="submitButtonContentMobile">
                                                <CheckCircle
                                                    onClick={() => { editRgtHash() }}
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
                                            Modify Rightsholder allows the owner of an asset token to modify the ownership of an item. This does not editRgtHash the asset
                                            token. Pruf never stores your personal data. The information you provide here will be irreversibly hashed into a unique pattern
                                            that does not contain the data that you provide.
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
export default ModifyRightsHolderMobile;
