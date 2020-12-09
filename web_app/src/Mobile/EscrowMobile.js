import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { ArrowRightCircle, Home, XSquare, CheckCircle, HelpCircle, Camera, CameraOff, UploadCloud } from 'react-feather'
import QrReader from 'react-qr-reader'

class EscrowMobile extends Component {
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
    }, 100)



    this.checkIn = async (e) => {
      let resArray;

      this.setState({ help: false })
      if (e === "null" || e === undefined) {
        this.setState({ idxHash: "", transaction: false, txStatus: false, txHash: "", isSettingEscrowAble: undefined, accessPermitted: false, wasSentPacket: false, isSettingEscrow: "0", help: false, input: false })
      }
      else if (e === "reset") {
        return window.resetInfo = true;
      }
      else if (e === "assetDash") {
        return window.location.href = "/#/asset-dashboard-mobile"
      }

      if (this.state.idxHashRaw === "" && this.state.result === "") {
        resArray = await window.utils.checkStats(window.assets.ids[e], [0])
      }

      if (this.state.idxHashRaw !== "") {
        this.setState({ idxHash: e })
        resArray = await window.utils.checkStats(e, [0])
      }

      if (this.state.result !== "") {
        this.setState({ idxHash: e })
        resArray = await window.utils.checkStats(e, [0])
      }

      console.log("resArray", resArray)

      if (Number(resArray[0]) === 3 || Number(resArray[0]) === 4 || Number(resArray[0]) === 53 || Number(resArray[0]) === 54) {
        alert("Cannot edit asset in lost or stolen status"); return this.setState({ idxHash: "", transaction: false, txStatus: false, txHash: "", isSettingEscrowAble: undefined, accessPermitted: false, wasSentPacket: false, isSettingEscrow: "0", help: false, input: false })
      }

      if (Number(resArray[0]) === 56 || Number(resArray[0]) === 50) {
        this.setState({ isSettingEscrowAble: false })
        console.log("isSettingEscrowAble: false")
      }

      if (Number(resArray[0]) !== 50 && Number(resArray[0]) !== 56) {
        this.setState({ isSettingEscrowAble: true })
        console.log("isSettingEscrowAble: true")
      }

      this.setState({ selectedAsset: e, Checkbox: false, QRreader: false })
      console.log("Changed component idx to: ", window.assets.ids[e])
      console.log(this.state.isSettingEscrow)

      if (this.state.idxHashRaw === "" && this.state.result === "") {
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
    }

    this.state = {
      addr: "",
      costArray: [0],
      error: undefined,
      NRerror: undefined,
      result: "",
      result1: "",
      result2: "",
      assetClass: undefined,
      txHash: "",
      txStatus: false,
      type: "",
      manufacturer: "",
      model: "",
      serial: "",
      newStatus: "",
      agent: "",
      timeFormat: "",
      isSettingEscrow: "0",
      isSettingEscrowAble: undefined,
      escrowData: [],
      hasLoadedAssets: false,
      assets: { descriptions: [0], notes: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      transaction: false,
      help: false,
      input: false,
      Checkbox: false,
      legacyMode: false,
      idxHash: "",
      idxHashRaw: "",
      QRreader: false,
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {

      if (Number(window.sentPacket.statusNum) === 56 || Number(window.sentPacket.statusNum) === 50) {
        this.setState({ isSettingEscrowAble: false })
        console.log("isSettingEscrowAble: false")
      }

      else if (Number(window.sentPacket.statusNum) !== 50 && Number(window.sentPacket.statusNum) !== 56) {
        this.setState({ isSettingEscrowAble: true })
        console.log("isSettingEscrowAble: true")
      }

      if (Number(window.sentPacket.statusNum) === 3 || Number(window.sentPacket.statusNum) === 4 || Number(window.sentPacket.statusNum) === 53 || Number(window.sentPacket.statusNum) === 54) {
        alert("Cannot edit asset in lost or stolen status");
        window.sentpacket = undefined;
        return window.location.href = "/#/asset-dashboard-mobile"
      }
      this.setState({
        name: window.sentPacket.name,
        idxHash: window.sentPacket.idxHash,
        assetClass: window.sentPacket.assetClass,
        status: window.sentPacket.status,
        wasSentPacket: true
      })
      window.sentPacket = undefined
    }

    this.setState({ runWatchDog: true })

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window
    this.setState({ runWatchDog: false });
  }

  componentDidUpdate() {//stuff to do when state updates

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
        this.checkIn(data)
      }
      else {
        this.setState({
          assetFound: "Asset Not Found",
        })
      }
    }
  }
  handleError = (err) => {
    console.error(err)
    this.setState({ legacyMode: true })
  }
  openImageDialog() {
    this.refs.qrReader1.openImageDialog()
  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const _accessAsset = async () => {
      this.setState({ help: false })
      if (this.state.idxHash === "") {
        return alert("Please Select an Asset From the Dropdown")
      }
      if (this.state.isSettingEscrow === "0" || this.state.isSettingEscrowAble === undefined) {
        return alert("Please Select an Action From the Dropdown")
      }
      else {
        let tempArray = []
        tempArray = await window.utils.getEscrowData(this.state.idxHash)
        console.log("tempArray", tempArray)
        this.setState({
          accessPermitted: true,
          escrowData: tempArray,
        })
        console.log("escrowData", this.state.escrowData[1])
      }

    }

    const QRReader = async () => {
      if (this.state.QRreader === false) {
        await this.setState({ QRreader: true, assetFound: "" })
        console.log("TEST", this.state.QRreader)
      }
      else {
        await this.setState({ QRreader: false, DVresult: "" })
        console.log("TEST2", this.state.QRreader)
      }
    }


    const previewStyle = {
      height: 240,
      width: 320,
    }

    const Checkbox = async () => {
      if (this.state.input === false) {
        this.setState({ input: true })
      }
      else {
        this.setState({ input: false })
      }
    }

    const clearForm = async () => {
      if (document.getElementById("MainForm") === null) { return }
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: "", transaction: false, txStatus: false, txHash: "", isSettingEscrowAble: undefined, accessPermitted: false, wasSentPacket: false, isSettingEscrow: "0", help: false, input: false })
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

    const _setEscrow = async () => {
      this.setState({ help: false })
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true })

      var idxHash = this.state.idxHash;

      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);
      console.log("time: ", this.state.escrowTime, "format: ", this.state.timeFormat);

      if (this.state.newStatus <= 49) { this.setState({ transaction: false }); alert("Cannot set status under 50 in non-custodial AC"); return clearForm() }
      if (this.state.agent.substring(0, 2) !== "0x") { this.setState({ transaction: false }); alert("Agent address invalid"); return clearForm() }


      await window.contracts.ECR_NC.methods
        .setEscrow(idxHash, window.web3.utils.soliditySha3(this.state.agent), window.utils.convertTimeTo(this.state.escrowTime, this.state.timeFormat), this.state.newStatus)
        .send({ from: window.addr })
        .on("error", function (_error) {
          self.setState({ transaction: false })
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false, wasSentPacket: false });
          alert("Something went wrong!")
          clearForm();
          console.log(Object.values(_error)[0].transactionHash);
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false })
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
          console.log(receipt.status);
          window.resetInfo = true;
          if (self.state.wasSentPacket) {
            return window.location.href = '/#/asset-dashboard-mobile'
          }
          //Stuff to do when tx confirms
        });
      console.log(this.state.txHash);
      return clearForm();
    };

    const _endEscrow = async () => {
      this.setState({ help: false })
      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true })

      var idxHash = this.state.idxHash;

      console.log("idxHash", idxHash);
      console.log("addr: ", window.addr);

      await window.contracts.ECR_NC.methods
        .endEscrow(idxHash)
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ transaction: false, txHash: Object.values(_error)[0].transactionHash, xStatus: false, wasSentPacket: false })
          console.log(Object.values(_error)[0].transactionHash);
          alert("Something went wrong!")
          clearForm();
        })
        .on("receipt", (receipt) => {
          self.setState({ transaction: false, txStatus: receipt.status, txHash: receipt.transactionHash })
          console.log(receipt.status);
          window.resetInfo = true;
          if (this.state.wasSentPacket) {
            return window.location.href = '/#/asset-dashboard-mobile'
          }
          //Stuff to do when tx confirms
        });
      console.log(this.state.txHash);

      await this.setState({
        accessPermitted: false,
        isSettingEscrow: "0",
        agent: "",
        newStatus: "",
        escrowTime: "",
        timeFormat: ""
      })

      return clearForm();
    };

    return (
      <div>
        {this.state.QRreader === false && (
          <div>
            <div className="mediaLinkADHome">
              <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
            </div>
            <h2 className="formHeaderMobile">Manage Escrow</h2>
            <div className="mediaLinkClearForm">
              <a className="mediaLinkContentClearFormMobile" ><XSquare onClick={() => { clearForm() }} /></a>
            </div>
          </div>
        )}
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

              { !this.state.accessPermitted && this.state.QRreader === false && (
                <>
                  <div>
                    <Form.Check
                      type="checkbox"
                      className="checkBoxMobile"
                      id="inlineFormCheck"
                      onChange={() => { Checkbox() }}
                    />
                    <Form.Label className="checkBoxFormFontMobile">Manual Input</Form.Label>
                    {this.state.input === true && (
                      <>
                        <Form.Row>
                          <Form.Label className="formFont">Idx Hash:</Form.Label>
                          <Form.Control
                            placeholder="Idx Hash"
                            onChange={(e) => this.setState({ idxHashRaw: e.target.value })}
                            size="lg"
                            required
                          />
                        </Form.Row>
                        <Form.Row>
                          <div className="mediaLinkCameraMobile">
                            <div className="submitButtonContentMobile">
                              <ArrowRightCircle
                                onClick={() => { this.checkIn(this.state.idxHashRaw) }}
                              />
                            </div>
                          </div>
                        </Form.Row>
                        <Form.Row>
                          <div className="mediaLinkCameraMobile">
                            <div className="submitButtonContentMobile">
                              <Camera
                                onClick={() => { QRReader() }}
                              />
                            </div>
                          </div>
                        </Form.Row>
                      </>
                    )}
                  </div>
                </>
              )}
              {this.state.QRreader === true && (
                <div>
                  <style type="text/css">
                    {`
                              .formMobile {
                              background: none !important;
                              padding: 0rem !important;
                              }
                            `}
                  </style>
                  <div>
                    <div className="mediaLinkADHome">
                      <a className="mediaLinkContentADHomeMobile" ><Home onClick={() => { window.location.href = '/' }} /></a>
                    </div>
                    <h2 className="formHeaderMobileVL">Scan QR</h2>
                    <div className="mediaLinkBackMobile">
                      <a className="mediaLinkContentBack" ><CameraOff onClick={() => { QRReader() }} /></a>
                    </div>
                  </div>
                  <div className="QRreaderMobile">
                    <QrReader
                      ref="qrReader1"
                      delay={300}
                      previewStyle={previewStyle}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      style={{ width: '100%' }}
                      legacyMode={this.state.legacyMode}
                    />
                    {this.state.legacyMode === true && (
                      <div className="uploadImageQR">
                        <div className="uploadImageQRContent">
                          <UploadCloud size={60} onClick={() => { this.openImageDialog() }} />
                        </div>
                      </div>
                    )}
                    {this.state.result !== undefined && (
                      <div className="resultsMobile">
                        {this.state.assetFound}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!this.state.accessPermitted && this.state.input === false && (
                <>
                  {this.state.idxHashRaw === "" && this.state.QRreader === false && this.state.result === "" && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridAsset">
                        <Form.Label className="formFont"> Select an Asset to Modify :</Form.Label>
                        {!this.state.wasSentPacket && (
                          <>
                            {this.state.transaction === false && (
                              <Form.Control
                                as="select"
                                size="lg"
                                onChange={(e) => { this.checkIn(e.target.value) }}

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
                              </Form.Control>)}
                            {this.state.transaction === true && (
                              <Form.Control
                                as="select"
                                size="lg"
                                disabled
                              >
                                <optgroup className="optgroup">
                                  <option>Modifying Escrow of "{this.state.name}"</option>
                                </optgroup>
                              </Form.Control>)}
                          </>
                        )}
                        {this.state.wasSentPacket && (
                          <Form.Control
                            as="select"
                            size="lg"
                            onChange={(e) => { this.checkIn(e.target.value) }}
                            disabled
                          >
                            <optgroup>
                              <option>
                                Modifying "{this.state.name}" Clear Form to Select Different Asset
                           </option>
                            </optgroup>
                          </Form.Control>
                        )}

                      </Form.Group>
                    </Form.Row>
                  )}
                  {this.state.idxHashRaw !== "" && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridTime">
                        <Form.Label className="formFont">Asset ID:</Form.Label>
                        <Form.Control
                          placeholder={this.state.idxHashRaw}
                          required
                          disabled
                          size="lg"
                        />
                      </Form.Group>
                    </Form.Row>
                  )}
                  {this.state.result !== "" && this.state.QRreader === false && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridTime">
                        <Form.Label className="formFont">Asset ID:</Form.Label>
                        <Form.Control
                          placeholder={this.state.result}
                          required
                          disabled
                          size="lg"
                        />
                      </Form.Group>
                    </Form.Row>
                  )}
                  {this.state.QRreader === false && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridFormatSetOrEnd">
                        <Form.Label className="formFont">Set or End?:</Form.Label>
                        <Form.Control as="select" size="lg" disabled onChange={(e) => this.setState({ isSettingEscrow: e.target.value })}>
                        {this.state.isSettingEscrowAble === undefined && (
                          <option value="0">Please Select an Asset</option>
                        )}
                          {this.state.isSettingEscrowAble === true && (
                            <option value="true">Set Escrow</option>
                          )}
                          {this.state.isSettingEscrowAble === false && (
                            <option value="false">End Escrow</option>
                          )}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  )}
                  {this.state.transaction === false && this.state.QRreader === false && (
                    <>
                      <Form.Row>
                        <div className="submitButtonRRMobile">
                          <div className="submitButtonContent">
                            <ArrowRightCircle
                              onClick={() => { _accessAsset() }}
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
                        <div className="explainerTextBoxMobile">
                          Manage Escrow gives you two options, to either end a current escrow, or to set an asset into escrow. Depending on the selected
                          asset's status, you will be given the appropriate option.
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {this.state.accessPermitted && this.state.isSettingEscrow === "true" && (
                <>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridAgent">
                      <Form.Label className="formFont">Agent Address:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="Agent Address"
                          required
                          onChange={(e) => this.setState({ agent: e.target.value })}
                          size="lg"
                        />)}
                      {this.state.transaction === true && (
                        <Form.Control
                          placeholder={this.state.agent}
                          required
                          size="lg"
                          disabled
                        />)}
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridStatus">
                      <Form.Label className="formFont">Escrow Status:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control as="select" size="lg" onChange={(e) => this.setState({ newStatus: e.target.value })}>
                          <option value="0">Select an Escrow Status</option>
                          <option value="56">Supervised Escrow</option>
                          <option value="50">Locked Escrow</option>
                        </Form.Control>)}
                      {this.state.transaction === true && (
                        <Form.Control as="select" size="lg" disabled >
                          {this.state.newStatus === "56" && (
                            <option>Supervised Escrow</option>
                          )}
                          {this.state.newStatus === "50" && (
                            <option>Locked Escrow</option>
                          )}
                        </Form.Control>)}
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridTime">
                      <Form.Label className="formFont">Duration:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control
                          placeholder="setEscrow duration"
                          required
                          onChange={(e) => this.setState({ escrowTime: e.target.value })}
                          size="lg"
                        />)}
                      {this.state.transaction === true && (
                        <Form.Control
                          placeholder={this.state.escrowTime}
                          required
                          disabled
                          size="lg"
                        />)}
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridFormat">
                      <Form.Label className="formFont">Time Unit:</Form.Label>
                      {this.state.transaction === false && (
                        <Form.Control as="select" size="lg" onChange={(e) => this.setState({ timeFormat: e.target.value })}>
                          <option value="0">Select a time unit</option>
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                        </Form.Control>)}
                      {this.state.transaction === true && (
                        <Form.Control as="select" size="lg" disabled>
                          {this.state.timeFormat === "seconds" && (
                            <option>Seconds</option>
                          )}
                          {this.state.timeFormat === "minutes" && (
                            <option>Minutes</option>
                          )}
                          {this.state.timeFormat === "hours" && (
                            <option>Hours</option>
                          )}
                          {this.state.timeFormat === "days" && (
                            <option>Days</option>
                          )}
                          {this.state.timeFormat === "weeks" && (
                            <option>Weeks</option>
                          )}
                        </Form.Control>)}
                    </Form.Group>
                  </Form.Row>
                  {this.state.transaction === false && (
                    <>
                      <Form.Row>
                        <div className="submitButtonRRMobile">
                          <div className="submitButtonContent">
                            <CheckCircle
                              onClick={() => { _setEscrow() }}
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
                        <div className="explainerTextBoxMobile">
                          Setting Escrow gives you two options. Supervised Escrow, which allows the owner of the asset to change the status to lost or stolen during the escrow period,
                          and Locked Escrow, which disables all modifications of the asset during the escrow period. Both types of escrow can be ended by the assigned agent at any time.
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {this.state.accessPermitted && this.state.isSettingEscrow === "false" && (
                <>
                  <Form.Row>
                    <h2 className="escrowDetailsMobile">Escrow Agent: {this.state.escrowData[1].substring(0, 18) + "..." + this.state.escrowData[1].substring(48, 66)}</h2>
                  </Form.Row>
                  <Form.Row>
                    <h2 className="escrowDetailsMobile"> Escrow TimeLock: {this.state.escrowData[2]}</h2>
                  </Form.Row>
                  {this.state.transaction === false && (
                    <>
                      <Form.Row>
                        <div className="submitButtonRRMobile">
                          <div className="submitButtonContent">
                            <CheckCircle
                              onClick={() => { _endEscrow() }}
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
                        <div className="explainerTextBoxMobile">
                          Ending Escrow during the set escrow period must be done by the assigned agent. If the asset's escrow period
                          has ended, the asset token holder is then permitted to end it themselves.
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </Form>
        {this.state.transaction === false && this.state.txStatus === false && this.state.QRreader === false && (
          <div className="assetSelectedResultsMobile">
            <Form.Row>
              {this.state.idxHash !== "" && this.state.txHash === "" && (
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContentMobile">{this.state.idxHash.substring(0, 18) + "..." + this.state.idxHash.substring(48, 66)}</span> </div>
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

export default EscrowMobile;
