import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Home, XSquare, CheckCircle, UploadCloud, Trash2, AlertTriangle } from 'react-feather'


class ModifyDescription extends Component {
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

      if (this.state.hasUploaded && this.state.hashPath !== "" && this.state.runWatchDog === true && window.isInTx !== true) {
        if(document.getElementById("MainForm") !== null){
          this.updateDescription()
        }
      }

    }, 100)

    this.clearForm = async () => {
      if(document.getElementById("MainForm") === null){return}
      document.getElementById("MainForm").reset();
      this.setState({
        idxHash: undefined,
        txStatus: false,
        txHash: "",
        wasSentPacket: false,
        count: 1,
        remCount: 0,
        removedElements: {
          images: [],
          text: [],
        },
        addedElements: {
          images: [],
          text: [],
          name: ""
        },
        help: false
      })
    }

    this.updateDescription = async () => {
      this.setState({help: false})
      console.log(this.state.hashPath, this.state.runWatchDog, window.isInTx)

      if(this.state.hashPath === "" || this.state.idxHash === undefined){
        this.setState({hashPath: "", idxHash: undefined}); 
        return this.clearForm()
      } 
      
      const idxHash = this.state.idxHash;
      const self = this
      

      this.setState({ txStatus: false });
      this.setState({ txHash: "" });
      this.setState({ error: undefined })
      this.setState({ result: "" })
      this.setState({ transaction: true })
      window.isInTx = true;

      const _ipfs1 = this.state.hashPath;
      this.setState({ hashPath: "", count: 1, textCount: 1, imageCount: 1, hasUploaded: false });
      console.log("idxHash", this.state.idxHash);
      console.log("addr: ", window.addr);

      await window.contracts.NP_NC.methods
        ._modIpfs1(idxHash, _ipfs1)
        .send({ from: window.addr })
        .on("error", function (_error) {
          // self.setState({ NRerror: _error });
          self.setState({ txHash: Object.values(_error)[0].transactionHash });
          self.setState({ txStatus: false });
          self.setState({ transaction: false });
          
          alert("Something went wrong!")
          self.clearForm();
          console.log(Object.values(_error)[0].transactionHash);
          window.isInTx = false
        })
        .on("receipt", (receipt) => {
          self.setState({ txHash: receipt.transactionHash });
          self.setState({ txStatus: receipt.status });
          self.setState({ transaction: false });
          console.log(receipt.status);
          window.resetInfo = true;
          window.isInTx = false
          if (self.state.wasSentPacket) {
            return window.location.href = '/#/asset-dashboard'
          }
          //Stuff to do when tx confirms
        });

      console.log(this.state.txHash);
      window.additionalElementArrays.photo = [];
      window.additionalElementArrays.text = [];
      window.additionalElementArrays.name = "";
      //self.setState({ accessPermitted: false });
      //self.setState({ oldDescription: undefined });
      self.setState({idxHash: undefined, txStatus: undefined, txHash: "", elementType: 0, removedElements: {
        images: [],
        text: [],
      },
      addedElements: {
        images: [],
        text: [],
        name: ""
      }
    });
    };

    this.state = {
      addr: "",
      lookupIPFS1: "",
      lookupIPFS2: "",
      IPFS: require("ipfs-mini"),
      hashPath: "",
      error: undefined,
      NRerror: undefined,
      result1: "",
      result2: "",
      assetClass: undefined,
      ipfs1: "",
      txHash: "",
      txStatus: false,
      accessPermitted: true,
      idxHash: undefined,
      elementType: 0,
      elementName: "",
      elementValue: "",
      nameTag: "",
      hasLoadedAssets: false,
      assets: { descriptions: [0], ids: [0], assetClasses: [0], statuses: [0], names: [0] },
      imageCount: 1,
      textCount: 1,
      remCount: 1,
      count: 1,
      transaction: false,
      hasUploaded: false,
      removePhotoElement: "",
      removeTextElement: "",
      imageArray: [],
      textArray: [],
      removedElements: {
        images: [],
        text: [],
      },
      addedElements: {
        images: [],
        text: [],
        name: ""
      },
      additionalElementArrays: {
        photo: [],
        text: [],
      },
      help: false
    };
  }

  //component state-change events......................................................................................................

  componentDidMount() {//stuff to do when component mounts in window
    if (window.sentPacket !== undefined) {

      let tempImageArray = [];
      let tempTextArray = [];

      if (Number(window.sentPacket.statusNum) === 3 || Number(window.sentPacket.statusNum) === 4 || Number(window.sentPacket.statusNum) === 53 || Number(window.sentPacket.statusNum) === 54) {
        alert("Cannot edit asset in lost or stolen status");
        window.sentPacket = undefined;
        return window.location.href = "/#/asset-dashboard"
      }

      if (Number(window.sentPacket.statusNum) === 50 || Number(window.sentPacket.statusNum) === 56) {
        alert("Cannot edit asset in escrow! Please wait until asset has met escrow conditions");
        window.sentPacket = undefined;
        return window.location.href = "/#/asset-dashboard"
      }

      for (let i = 0; i < Object.values(window.sentPacket.descriptionObj.photo).length; i++) {
        tempImageArray.push({ val: Object.values(window.sentPacket.descriptionObj.photo)[i], key: Object.keys(window.sentPacket.descriptionObj.photo)[i] })
      }

      for (let i = 0; i < Object.values(window.sentPacket.descriptionObj.text).length; i++) {
        tempTextArray.push({ val: Object.values(window.sentPacket.descriptionObj.text)[i], key: Object.keys(window.sentPacket.descriptionObj.text)[i] })
      }

      this.setState({
        name: window.sentPacket.name,
        idxHash: window.sentPacket.idxHash,
        assetClass: window.sentPacket.assetClass,
        status: window.sentPacket.status,
        oldDescription: window.sentPacket.descriptionObj,
        wasSentPacket: true,
        textArray: tempTextArray,
        imageArray: tempImageArray,
      })

      window.sentPacket = undefined
    }


    this.setState({ runWatchDog: true })
  }

  componentDidUpdate() {//stuff to do when state updates

  }

  componentWillUnmount() {//stuff do do when component unmounts from the window

    this.clearForm()

  }

  render() {//render continuously produces an up-to-date stateful document  
    const self = this;

    const clearForm = async () => {
      if(document.getElementById("MainForm") === null){return}
      document.getElementById("MainForm").reset();
      this.setState({ idxHash: undefined, txStatus: undefined, txHash: "", elementType: 0, wasSentPacket: false, help: false })
    }

    const help = async () => {
      if (this.state.help === false) {
        this.setState({ help: true })
      }
      else {
        this.setState({ help: false })
      }
    }

    const _addToMiscArray = async (type) => {
      this.setState({help: false})
      let element, text = this.state.addedElements.text, images = this.state.addedElements.images;
      let elementName = this.state.elementName;
      let elementValue = this.state.elementValue;

      elementValue = await elementValue.replace(/'/gi, "111APOST111");
      elementValue = await elementValue.replace(/"/g, "111QUOTE111");
      elementName = await elementName.replace(/'/gi, " ");
      elementName = await elementName.replace(/"/g, " ");

      if (type === "description") {
        element = ('"Description": ' + '"' + elementValue + '",')
        text.push('"Description": ' + '"' + elementValue + '",')
        this.setState({ textCount: this.state.textCount + 1, count: this.state.count + 1 })
      }

      else if (type === "displayImage") {
        element = ('"DisplayImage": ' + '"' + elementValue + '",')
        this.setState({ imageCount: this.state.imageCount + 1, count: this.state.count + 1 })
      }

      else if (elementName === "" && type === "photo") {
        element = ('"Image' + (String(Object.values(this.state.oldDescription.photo).length + this.state.count)) + '"' + ':' + '"' + elementValue + '",')
        this.setState({ imageCount: this.state.imageCount + 1, count: this.state.count + 1 })
      }

      else if (elementName === "" && type === "text") {
        element = ('"Text' + (String(Object.values(this.state.oldDescription.text).length + this.state.count)) + '"' + ':' + '"' + elementValue + '",')
        this.setState({ textCount: this.state.textCount + 1, count: this.state.count + 1 })
      }

      else {
        element = '"' + elementName + '": ' + '"' + elementValue + '",';
      }


      if (this.state.elementValue === "" && this.state.elementName === "" && this.state.nameTag === "") {
        return alert("All fields are required for submission")
      }
      if (type === "photo" || type === "displayImage") {
        console.log("Pushing photo element: ", element)
        window.additionalElementArrays.photo.push(element)
        images.push('"' + elementName + '": ' + '"' + this.state.elementValue + '",')
        this.setState({ count: this.state.count + 1 })
      }
      else if (type === "text" || type === "description") {
        console.log("Pushing text element: ", element)
        window.additionalElementArrays.text.push(element)
        if (type !== "description") {text.push('"' + elementName + '": ' + '"' + this.state.elementValue + '",')
        this.setState({ count: this.state.count + 1 })
        }
      }

      else if (type === "nameTag") {
        window.additionalElementArrays.name = this.state.nameTag
        this.setState({ count: this.state.count + 1 })
      }

      else { return alert("Please use the dropdown menu to select an element type") }

      console.log("Added", element, "to element array")
      console.log("Which now looks like: ", window.additionalElementArrays)
      this.setState({ elementType: "0", hashPath: "", addedElements: { text: text, images: images, name: this.state.nameTag } })
      return document.getElementById("MainForm").reset();
    }

    const _removeElement = (type) => {
      this.setState({help: false})
      console.log("Existing description before edits: ", this.state.oldDescription)
      let text = this.state.removedElements.text;
      let images = this.state.removedElements.images;
      let element = (this.state.removeElement)
      let oldDescription = this.state.oldDescription;

      if (this.state.element === "" && this.state.nameTag === "") {
        return alert("All fields are required for submission")
      }

      if (type === "removePhoto") {
        if (oldDescription.photo[element]) {
          delete oldDescription.photo[element]
          console.log("Removed", element, "from photo object")
          console.log("oldDescription after edits: ", oldDescription)
          images.push(element)
          //this.setState({ remCount: this.state.remCount + 1 })
        }
        //else { alert("Element does not exist in existing photo object") }
      }

      else if (type === "removeText") {
        if (oldDescription.text[element]) {
          delete oldDescription.text[element]
          console.log("Removed", element, "from text object")
          console.log("oldDescription after edits: ", oldDescription)
          text.push(element)
          //this.setState({ remCount: this.state.remCount + 1 })
        }
        else { alert("Element does not exist in existing text object") }
      }

      else { return alert("Please use the dropdown menu to select an element type") }


      this.setState({
        oldDescription: oldDescription,
        hashPath: "",
        removedElements: {
          images: images,
          text: text
        },
        remCount: this.state.remCount + 1,
      })
      this.setState({ elementType: "0" })
      return document.getElementById("MainForm").reset();

    }

    const publishIPFS1 = async () => {
      this.setState({help: false})
      console.log(this.state.oldDescription)
      let newDescription;

      let newDescriptionName;

      console.log("Checking payload...")

      let newDescriptionPhoto = '"photo": {';

      for (let i = 0; i < window.additionalElementArrays.photo.length; i++) {
        newDescriptionPhoto += (window.additionalElementArrays.photo[i])
      }

      if (newDescriptionPhoto.charAt(newDescriptionPhoto.length - 1) === ",") { newDescriptionPhoto = newDescriptionPhoto.substring(0, newDescriptionPhoto.length - 1); }
      newDescriptionPhoto += '}}'

      let newDescriptionText = '"text": {';

      for (let i = 0; i < window.additionalElementArrays.text.length; i++) {
        newDescriptionText += (window.additionalElementArrays.text[i])
      }

      if (newDescriptionText.charAt(newDescriptionText.length - 1) === ",") { newDescriptionText = newDescriptionText.substring(0, newDescriptionText.length - 1); }
      newDescriptionText += "}}"

      console.log("Text...Should look like JSON", newDescriptionText)
      console.log("Photo...Should look like JSON", newDescriptionPhoto, newDescriptionPhoto.charAt(8))

      newDescriptionPhoto = JSON.parse('{' + newDescriptionPhoto);
      newDescriptionText = JSON.parse('{' + newDescriptionText);

      if (window.additionalElementArrays.name === "") {
        newDescriptionName = {}
      }

      else {
        newDescriptionName = { name: window.additionalElementArrays.name }
      }

      console.log("Now they should be objects: ", newDescriptionPhoto, newDescriptionText, newDescriptionName)

      console.log("comparing to old description elements")

      if (this.state.oldDescription !== undefined && this.state.oldDescription !== "0") {
        let oldDescription = this.state.oldDescription;
        console.log("Found old description: ", oldDescription.photo, oldDescription.text);
        console.log("New description: ", newDescriptionPhoto, newDescriptionText)
        console.log("Old nameTag: ", oldDescription.name)
        if (oldDescription.name === undefined) { oldDescription.name = {} }
        let tempDescription = Object.assign({}, newDescriptionPhoto, newDescriptionText, newDescriptionName)
        console.log(tempDescription)
        let newPhoto = { photo: Object.assign({}, oldDescription.photo, tempDescription.photo) }
        console.log(newPhoto)
        let newText = { text: Object.assign({}, oldDescription.text, tempDescription.text) }
        console.log(newText)
        let test = Object.assign({}, oldDescription, tempDescription)
        console.log(test)
        let newName = Object.assign({}, { name: oldDescription.name }, newDescriptionName)

        console.log(newName)
        newDescription = Object.assign({}, newPhoto, newText, newName)
        console.log("Payload", newDescription);
      }

      else if (Number(newDescriptionPhoto + newDescriptionText) === 0) {
        return alert("No new data added to payload! Add some data before submission.")
      }

      else {
        console.log("No existing description to compare.");
        newDescription = Object.assign({}, newDescriptionPhoto, newDescriptionText, newDescriptionName)
        console.log("payload: ", newDescription)
      }

      console.log("Uploading file to IPFS...");
      await window.ipfs.add(JSON.stringify(newDescription), (error, hash) => {
        if (error) {
          console.log("Something went wrong. Unable to upload to ipfs");
        } else {
          console.log("uploaded at hash: ", hash);
        }
        self.setState({
          hashPath: window.utils.getBytes32FromIPFSHash(hash),
          oldDescription: newDescription,
          hasUploaded: true
        });
      });
    }

    const _checkIn = async (e) => {
      this.setState({help: false})
      this.setState({
        txStatus: false,
        txHash: ""
      })

      if (e === "null" || e === undefined) {
        return clearForm()
      }
      else if (e === "reset") {
        return window.resetInfo = true;
      }
      else if (e === "assetDash") {
        return window.location.href = "/#/asset-dashboard"
      }

      let resArray = await window.utils.checkStats(window.assets.ids[e], [0, 2])
      let tempImageArray = [];
      let tempTextArray = [];

      console.log(resArray)

      if (Number(resArray[1]) === 0) {
        alert("Asset does not exist at given IDX");
      }

      if (Number(resArray[0]) === 54 || Number(resArray[0]) === 53) {
        alert("Cannot edit asset in lost or stolen status"); return clearForm()
      }

      if (Number(resArray[0]) === 50 || Number(resArray[0]) === 56) {
        alert("Cannot edit asset in escrow! Please wait until asset has met escrow conditions"); return clearForm()
      }

      this.setState({ selectedAsset: e })
      console.log("Changed component idx to: ", window.assets.ids[e])
      console.log("About to edit: ", window.assets.descriptions[e])


      for (let i = 0; i < Object.values(window.assets.descriptions[e].photo).length; i++) {
        tempImageArray.push({ val: Object.values(window.assets.descriptions[e].photo)[i], key: Object.keys(window.assets.descriptions[e].photo)[i] })
      }

      for (let i = 0; i < Object.values(window.assets.descriptions[e].text).length; i++) {
        tempTextArray.push({ val: Object.values(window.assets.descriptions[e].text)[i], key: Object.keys(window.assets.descriptions[e].text)[i] })
      }

      this.setState({
        assetClass: window.assets.assetClasses[e],
        idxHash: window.assets.ids[e],
        name: window.assets.descriptions[e].name,
        photos: window.assets.descriptions[e].photo,
        text: window.assets.descriptions[e].text,
        oldDescription: window.assets.descriptions[e],
        status: window.assets.statuses[e],
        note: window.assets.notes[e],
        textArray: tempTextArray,
        imageArray: tempImageArray,
      })
    }

    return (
      <div>
        <div>
          <div className="mediaLinkADHome">
            <a className="mediaLinkContentADHome" ><Home onClick={() => { window.location.href = '/#/' }} /></a>
          </div>
          <h2 className="formHeader">Modify Asset Information</h2>
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
              {this.state.accessPermitted && (
                <div>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridAsset">
                      <Form.Label className="formFont"> Select an Asset to Modify :</Form.Label>
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
                            </Form.Control>)}
                          {this.state.transaction === true && (
                            <Form.Control
                              as="select"
                              size="lg"
                              disabled
                            >
                              <optgroup className="optgroup">
                                <option>Modifying: {this.state.name}</option>
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
                              "{this.state.name}" Please Clear Form to Select Different Asset
                                                           </option>
                          </optgroup>
                        </Form.Control>
                      )}
                    </Form.Group>
                  </Form.Row>
                  {this.state.transaction === false && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridMiscType">
                        <Form.Label className="formFont">
                          Element:
                        </Form.Label>
                        <Form.Control
                          as="select"
                          size="lg"
                          onChange={(e) => this.setState({ elementType: e.target.value })}
                        >
                          <optgroup className="optgroup">
                            <option value="0">Select Element Type</option>
                            <option value="nameTag"> Edit Name Tag</option>
                            <option value="description">Edit Description</option>
                            <option value="displayImage">Edit Profile Image</option>
                            <option value="text">Add Custom Text</option>
                            <option value="photo">Add Custom Image URL</option>
                            <option value="removeText">Remove Existing Text Element</option>
                            <option value="removePhoto">Remove Existing Image Element</option>
                          </optgroup>

                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  )}
                  {this.state.transaction === true && (
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridMiscType">
                        <Form.Label className="formFont">
                          Element Type:
                        </Form.Label>
                        <Form.Control
                          as="select"
                          size="lg"
                          onChange={(e) => this.setState({ elementType: e.target.value })}
                          disabled
                        >
                          <optgroup className="optgroup">
                            <option>Updating Asset Details</option>
                          </optgroup>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  )}
                  {this.state.elementType === "0" && (
                    <></>
                  )}
                  {this.state.elementType === "text" && (
                    <>
                      <Form.Group as={Col} controlId="formGridMiscName">
                        <Form.Label className="formFont">
                          Submission Title:
                      </Form.Label>
                        <Form.Control
                          placeholder="Name This Text Submission (No Spaces)"
                          onChange={(e) => this.setState({ elementName: e.target.value })}
                          size="lg"
                          maxLength={32}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridMiscValue">
                        <Form.Label className="formFont">
                          Text to Submit:
                      </Form.Label>
                        <Form.Control
                          placeholder="Text Submission Goes Here"
                          onChange={(e) => this.setState({ elementValue: e.target.value })}
                          size="lg"
                        />
                      </Form.Group>
                    </>
                  )}

                  {this.state.elementType === "description" && (
                    <>
                      <Form.Group as={Col} controlId="formGridMiscValue">
                        <Form.Label className="formFont">
                          Description Text:
                      </Form.Label>
                        <Form.Control
                          placeholder="Text Submission Goes Here"
                          onChange={(e) => this.setState({ elementValue: e.target.value })}
                          size="lg"
                        />
                      </Form.Group>
                    </>
                  )}

                  {this.state.elementType === "nameTag" && (
                    <>
                      <Form.Group as={Col} controlId="formGridNameTag">
                        <Form.Label className="formFont">
                          New Name Tag:
                      </Form.Label>
                        <Form.Control
                          placeholder="Type a New NameTag"
                          onChange={(e) => this.setState({ nameTag: e.target.value })}
                          size="lg"
                          maxLength={32}
                        />
                      </Form.Group>
                    </>
                  )}

                  {this.state.elementType === "removeText" && (
                    <>
                      <Form.Group as={Col} controlId="formGridMiscType">
                        <Form.Label className="formFont">
                          Text Elements:
                        </Form.Label>
                        <Form.Control
                          as="select"
                          size="lg"
                          onChange={(e) => this.setState({ removeElement: e.target.value })}
                        >
                          <optgroup className="optgroup">
                            {window.utils.generateRemoveElements(this.state.textArray)}
                          </optgroup>

                        </Form.Control>
                      </Form.Group>

                      <Form.Row>
                        <div className="submitButton">
                          <div className="submitButtonContent">
                            <Trash2
                              onClick={() => { _removeElement(this.state.elementType) }}
                            />
                          </div>
                        </div>
                      </Form.Row>
                    </>
                  )}

                  {this.state.elementType === "removePhoto" && (
                    <>
                      <Form.Group as={Col} controlId="formGridMiscType">
                        <Form.Label className="formFont">
                          Image Elements:
                      </Form.Label>
                        <Form.Control
                          as="select"
                          size="lg"
                          onChange={(e) => this.setState({ removeElement: e.target.value })}
                        >
                          <optgroup className="optgroup">
                            {window.utils.generateRemoveElements(this.state.imageArray)}
                          </optgroup>

                        </Form.Control>
                      </Form.Group>

                      <Form.Row>
                        <div className="submitButton">
                          <div className="submitButtonContent">
                            <Trash2
                              onClick={() => { _removeElement(this.state.elementType) }}
                            />
                          </div>
                        </div>
                      </Form.Row>
                    </>
                  )}

                  {this.state.elementType === "photo" && (
                    <>
                      <Form.Group as={Col} controlId="formGridMiscName">
                        <Form.Label className="formFont">
                          Image Title:
                      </Form.Label>
                        <Form.Control
                          placeholder="Name This Image (No Spaces)"
                          onChange={(e) => this.setState({ elementName: e.target.value })}
                          size="lg"
                          maxLength={32}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridMiscValue">
                        <Form.Label className="formFont">
                          Source URL:
                      </Form.Label>
                        <Form.Control
                          placeholder="Image URL"
                          onChange={(e) => this.setState({ elementValue: e.target.value })}
                          size="lg"
                        />
                      </Form.Group>
                    </>
                  )}

                  {this.state.elementType === "displayImage" && (
                    <>
                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridMiscValue">
                          <Form.Label className="formFont">
                            Image Source URL:
                        </Form.Label>
                          <Form.Control
                            placeholder="Image URL"
                            onChange={(e) => this.setState({ elementValue: e.target.value })}
                            size="lg"
                          />
                        </Form.Group>
                      </Form.Row>
                    </>
                  )}

                </div>
              )}

              {this.state.elementType === "text" && (
                <div className="submitButton">
                  <div className="submitButtonContent">
                    <UploadCloud
                      onClick={() => { _addToMiscArray(this.state.elementType) }}
                    />
                  </div>
                </div>
              )}

              {this.state.elementType === "photo" && (
                <div className="submitButton">
                  <div className="submitButtonContent">
                    <UploadCloud
                      onClick={() => { _addToMiscArray(this.state.elementType) }}
                    />
                  </div>
                </div>
              )}

              {this.state.elementType === "displayImage" && (
                <div className="submitButton">
                  <div className="submitButtonContent">
                    <UploadCloud
                      onClick={() => { _addToMiscArray(this.state.elementType) }}
                    />
                  </div>
                </div>
              )}

              {this.state.elementType === "description" && (
                <div className="submitButton">
                  <div className="submitButtonContent">
                    <UploadCloud
                      onClick={() => { _addToMiscArray(this.state.elementType) }}
                    />
                  </div>
                </div>
              )}

              {this.state.elementType === "nameTag" && (
                <div className="submitButton">
                  <div className="submitButtonContent">
                    <UploadCloud
                      onClick={() => { _addToMiscArray(this.state.elementType) }}
                    />
                  </div>
                </div>
              )}

              {this.state.hashPath === "" && this.state.accessPermitted && this.state.transaction === false && (
                <>
                <Form.Row>
                  <div className="submitButton">
                    <div className="submitButtonContent">
                      <CheckCircle
                        onClick={() => { publishIPFS1() }}
                      />
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
                    Modifing Asset Information allows users to customize a selected assets profile. Information given within this version
                    of the web application may be visible to third parties if unencrypted. These data fields should not include sensitive or personally
                    identifying data unless it is the intention of the user to make this data public.
                  </div>
                )}
              </>
              )}
            </div>
          )}
        </Form>
        {this.state.transaction === false && this.state.txHash === "" && (
          <div className="assetSelectedResults">
            <Form.Row>
              {this.state.idxHash !== undefined &&(
                <Form.Group>
                  <div className="assetSelectedContentHead">Asset IDX: <span className="assetSelectedContent">{this.state.idxHash}</span> </div>
                  <div className="assetSelectedContentHead">Asset Name: <span className="assetSelectedContent">{this.state.name}</span> </div>
                  <div className="assetSelectedContentHead">Asset Class: <span className="assetSelectedContent">{this.state.assetClass}</span> </div>
                  <div className="assetSelectedContentHead">Asset Status: <span className="assetSelectedContent">{this.state.status}</span> </div>
                  {this.state.count > 1 && (
                    <div>
                      {window.utils.generateNewElementsPreview(this.state.addedElements)}
                    </div>
                  )}
                  {this.state.remCount > 1 && (
                    <div>
                      {window.utils.generateRemElementsPreview(this.state.removedElements)}
                    </div>
                  )}
                </Form.Group>
              )}
            </Form.Row>
          </div>
        )}
        {this.state.transaction === true && (
          <div className="results">
            <h1 className="loadingh1">Transaction In Progress</h1>
          </div>
        )}
        {this.state.txHash > 0 && ( //conditional rendering
          <div className="results">
            <Form.Row>
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
            </Form.Row>
          </div>
        )}

      </div>
    );
  }
}

export default ModifyDescription;
