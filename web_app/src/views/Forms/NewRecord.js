import React from "react";
import swal from 'sweetalert';
import base64 from 'base64-arraybuffer';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Jdenticon from 'react-jdenticon';

// @material-ui/icons
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { DashboardOutlined, Description } from "@material-ui/icons";
import { setConstantValue } from "typescript";

const useStyles = makeStyles(styles);

export default function NewRecord(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [ipfsActive, setIpfsActive] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [assetClass, setAssetClass] = React.useState("");
  const [assetClassName, setAssetClassName] = React.useState("");
  const [submittedIdxHash, setSubmittedIdxHash] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [NRCost, setNRCost] = React.useState("~")

  //const [ipfsObj, setIpfsObj] = React.useState("");

  const [assetName, setAssetName] = React.useState("");
  const [manufacturer, setManufacturer] = React.useState("");
  const [type, setType] = React.useState("");
  const [model, setModel] = React.useState("");
  const [serial, setSerial] = React.useState("");


  // const [descriptionName, setDescriptionName] = React.useState("");
  const [nameTag, setNameTag] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [displayImage, setDisplayImage] = React.useState("");
  const [displayImageUrl, setDisplayImageUrl] = React.useState("");


  const [loginManufacturer, setloginManufacturer] = React.useState("");
  const [loginType, setloginType] = React.useState("");
  const [loginModel, setloginModel] = React.useState("");
  const [loginSerial, setloginSerial] = React.useState("");

  // const [loginDescriptionName, setloginDescriptionName] = React.useState("");
  // const [loginDescription, setloginDescription] = React.useState("");

  const [loginManufacturerState, setloginManufacturerState] = React.useState("");
  const [loginTypeState, setloginTypeState] = React.useState("");
  const [loginModelState, setloginModelState] = React.useState("");
  const [loginSerialState, setloginSerialState] = React.useState("");

  const [first, setFirst] = React.useState("");
  const [middle, setMiddle] = React.useState("");
  const [last, setLast] = React.useState("");
  const [ID, setID] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginFirst, setloginFirst] = React.useState("");
  const [loginLast, setloginLast] = React.useState("");
  const [loginID, setloginID] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");

  const [loginFirstState, setloginFirstState] = React.useState("");
  const [loginLastState, setloginLastState] = React.useState("");
  const [loginIDState, setloginIDState] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");

  const [txHash, setTxHash] = React.useState("");

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const maxImageSize = 1000;

  const link = document.createElement('div');
  const resizeImg = require('resize-img');

  let fileInput = React.createRef();

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
  }, [])

  const ACLogin = event => {
    if (!props.IDHolder) {
      IDHolderPrompt()
    }
    else {
      setAssetClass(event.target.value);
      if (event.target.value === "1000003") {
        setAssetClassName("Trinkets")
      }
      if (event.target.value === "1000004") {
        setAssetClassName("Personal Computers")
      }
      window.utils.getCosts(6, event.target.value).then((e)=>{
        setNRCost(window.web3.utils.fromWei(e.newAsset))
      })
    }
  };

  const refreshBalances = async () => {
    if(!window.web3.eth) return

    let pruf, ether;
    
    console.log("Refreshing ether bal")
    await window.web3.eth.getBalance(props.addr, (err, result) => {
      if (err) { console.log(err) } 
      else { ether = window.web3.utils.fromWei(result, 'ether') }
      window.contracts.UTIL_TKN.methods.balanceOf(props.addr).call((err, result) => {
        if (err) { console.log(err) }
        else { pruf = window.web3.utils.fromWei(result, 'ether') }
        window.contracts.A_TKN.methods.balanceOf(props.addr).call((err, result) => {
          if (err) { console.log(err) }
          else { window.replaceAssetData = {assets: result, ether, pruf} }
        });
      });
    });
  }


  const IDHolderPrompt = () => {

    if (!props.addr) {
      return swal({
        title: "Could not get user address",
        icon: "warning",
        text: "Please connect to an Ethereum provider and try again.",
        buttons: {
          close: {
            text: "close",
            value: "close"
          }
        },
      })
    }
    let tempTxHash;

    swal({
      title: "In order to mint asset tokens, you must first have an ID token.",
      icon: "warning",
      text: "If you would like to mint an ID token, please select Yes",
      buttons: {
        yes: {
          text: "Yes",
          value: "yes"
        },
        no: {
          text: "No",
          value: "no"
        }
      },
    })
      .then((value) => {
        switch (value) {

          case "yes":
            setTransactionActive(true)
            window.contracts.PARTY.methods
              .GET_ID()
              .send({ from: props.addr })
              .on("error", function (_error) {
                setTransactionActive(false);
                setTxStatus(false);
                setTxHash(Object.values(_error)[0].transactionHash);
                tempTxHash = Object.values(_error)[0].transactionHash;
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
                let str2 = "' target='_blank'>here</a>";
                link.innerHTML = String(str1 + tempTxHash + str2);
                if (tempTxHash !== undefined) {
                  swal({
                    title: "Something went wrong!",
                    content: link,
                    icon: "warning",
                    button: "Close",
                  });
                }
                if (tempTxHash === undefined) {
                  swal({
                    title: "Something went wrong!",
                    icon: "warning",
                    button: "Close",
                  });
                }
              })
              .on("receipt", (receipt) => {
                setTransactionActive(false);
                setTxStatus(receipt.status);
                tempTxHash = receipt.transactionHash;
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
                let str2 = "' target='_blank'>here</a>";
                link.innerHTML = String(str1 + tempTxHash + str2);
                swal({
                  title: "ID Token Minted!",
                  content: link,
                  icon: "success",
                  button: "Close"
                }).then(()=>{
                  window.location.reload()
                })
              })

            break;

          case "no":
            break;

          default:
            break;
        }
      });


  }

  const handleClick = () => {
    fileInput.current.value = "";
    fileInput.current.click();
  }

  const clearForms = () => {
    setDisplayImage("");
    setDisplayImageUrl("");
    setManufacturer("");
    setType("");
    setModel("");
    setSerial("");
    setFirst("");
    setMiddle("");
    setLast("");
    setID("");
    setPassword("");

    setloginManufacturerState("");
    setloginTypeState("");
    setloginModelState("");
    setloginSerialState("");
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");

    setAssetClass("");
    console.log("clearing forms")
  };

  const addImage = async (prefix, buffer) => {
    if (!buffer) return;
    console.log("adding image...")
    let tempBuffer = buffer;
    let src = prefix + base64.encode(tempBuffer);

    var i = new Image();

    i.onload = function () {
      console.log(i.height, i.width);
      if (i.height > maxImageSize || i.width > maxImageSize) {
        let newH, newW, ar;
        if (i.width > i.height) {
          ar = i.height / i.width;
          newW = maxImageSize;
          newH = ar * newW;
        }
        else {
          ar = i.width / i.height;
          newH = maxImageSize;
          newW = ar * newH;
        }
        console.log("Resizing image... ");
        resizeImg(tempBuffer, { height: newH, width: newW, format: "jpg" }).then((e) => {
          console.log("Resized to ", newH, "x", newW);
          window.ipfs.add(prefix + base64.encode(e), (err, hash) => { // Upload image to IPFS
            if (err) {
              console.error(err)
              return setIsUploading(false);
            }

            let url = `https://ipfs.io/ipfs/${hash}`
            console.log(`Url --> ${url}`)
            setDisplayImageUrl(url);
            setDisplayImage(prefix + base64.encode(e));
            setIsUploading(false)
            return forceUpdate();
          })
        })
      }
      else {
        resizeImg(tempBuffer, { height: i.height, width: i.width, format: "jpg" }).then((e) => {
          console.log("Converted to .JPG");
          window.ipfs.add(prefix + base64.encode(e), (err, hash) => { // Upload image to IPFS
            if (err) {
              console.error(err)
              return setIsUploading(false);
            }

            let url = `https://ipfs.io/ipfs/${hash}`
            console.log(`Url --> ${url}`)
            setDisplayImageUrl(url);
            setDisplayImage(prefix + base64.encode(e));
            setIsUploading(false)
            return forceUpdate();
          })
        })
      };
    }

    i.src = src;
  }

  const uploadImage = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let file;
    file = e.target.files[0]
    const reader = new FileReader();
    reader.onloadend = (e) => {
      
      console.log(file)
      if (!file.type.includes("image")) {
        //setIsUploading(false)
        return swal({
          title: "Unsupported File Type",
          button: "Close"
        })
      }
      setIsUploading(true)
      const fileType = file.type;
      const prefix = `data:${fileType};base64,`;
      const buf = Buffer(reader.result);
      //const base64buf = prefix + base64.encode(buf);
      addImage(prefix, buf)
    }
    //const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
  }

  const handleHash = (ipfsHash, idxHash, ipfsObj) => {
    let ipfsB32 = window.utils.getBytes32FromIPFSHash(String(ipfsHash));
    _newRecord(ipfsB32, idxHash, ipfsObj)
  }

  const removeDisplayImage = () => {
    /*     let i = new Image();
    
        i.onload = function () {
          if (props.ps) {
            props.ps.element.scrollTop -= i.height
          } */
    setDisplayImageUrl("")
    setDisplayImage("")
    /*     };
    
        i.src = displayImage; */
  }

  const checkAsset = async () => {

    if (loginType === "" || loginManufacturer === "" || loginModel === "" || loginSerial === "" || loginFirst === "" || loginLast === "" || loginID === "" || loginPassword === "") {

      if (loginType === "") {
        setloginTypeState("error");
      }
      if (loginManufacturer === "") {
        setloginManufacturerState("error");
      }
      if (loginModel === "") {
        setloginModelState("error");
      }
      if (loginSerial === "") {
        setloginSerialState("error");
      }
      if (loginFirst === "") {
        setloginFirstState("error");
      }
      if (loginLast === "") {
        setloginLastState("error");
      }
      if (loginID === "") {
        setloginIDState("error");
      }
      if (loginPassword === "") {
        setloginPasswordState("error");
      }
      return;
    }

    let idxHash = window.web3.utils.soliditySha3(
      String(type).replace(/\s/g, ''),
      String(manufacturer).replace(/\s/g, ''),
      String(model).replace(/\s/g, ''),
      String(serial).replace(/\s/g, ''),
    )

    let ipfsObj;
    setShowHelp(false);

    if (nameTag !== "") {
      ipfsObj = { photo: {}, text: {}, urls: {}, name: String(nameTag) }
    }

    else {
      ipfsObj = { photo: {}, text: {}, urls: {}, name: "" }
    }

    if (description !== "") {
      ipfsObj.text.Description = description;
    }

    if (displayImage !== "") {
      ipfsObj.photo.DisplayImage = displayImageUrl;
    }

    let doesExist = await window.utils.checkAssetExistsBare(idxHash);

    if (doesExist) {
      return swal({
        title: "Asset already exists!",
        icon: "warning",
        button: "Close",
      })

    }

    setSubmittedIdxHash(idxHash)

    //setIpfsObj(ipfsObj)

    let payload = JSON.stringify(ipfsObj);
    let fileSize = Buffer.byteLength(payload, 'utf8')
    if (fileSize > 1000000) {
      return (
        swal({
          title: "Document size exceeds 1 MB limit! (" + String(fileSize) + "Bytes)",
          content: link,
          icon: "warning",
          button: "Close",
        })
      )
    }

    setIpfsActive(true);

    await window.ipfs.add(payload, (error, hash) => {
      if (error) {
        console.log("Something went wrong. Unable to upload to ipfs");
        setIpfsActive(false);
      } else {
        console.log("uploaded at hash: ", hash);
        handleHash(hash, idxHash, ipfsObj);
        setIpfsActive(false);
      }
    })

    //await window.utils.addIPFSJSONObject(ipfsObj).then((e)=>{console.log(e); handleHash(e, idxHash)})
    //setTimeout(_newRecord, 2000)
  }

  const thousandHashesOf = (varToHash) => {
    if(!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }
  
  

  const _newRecord = async (ipfs, idx, ipfsObj) => { //create a new asset record
    //console.log("assetClass: ", assetClass)

    const pageKey = thousandHashesOf(props.addr, props.winKey)

    let tempTxHash;
    var ipfsHash = ipfs;
    var rgtHashRaw, idxHash;

    let newAsset = {
      idxHash: idx,
      id: idx,
      ipfs: ipfs,
      photo: {DisplayImage: displayImage},
      photoUrls: {DisplayImage: displayImageUrl},
      text: ipfsObj.text,
      urls: ipfsObj.urls,
      name: ipfsObj.name,
      DisplayImage: displayImage,
      assetClass: assetClass,
      assetClassName: assetClassName,
      dBIndex: props.assetArr.length,
      countPair: [100000,100000],
      status: "Transferable",
      statusNum: 51,
      Description: ipfsObj.text.Description,
      note: "",
      identicon: [<Jdenticon value={idx} />],
      identiconLG: [<Jdenticon value={idx} />]
    }

    idxHash = idx; /* window.web3.utils.soliditySha3(
      String(type).replace(/\s/g, ''),
      String(manufacturer).replace(/\s/g, ''),
      String(model).replace(/\s/g, ''),
      String(serial).replace(/\s/g, ''),
    ) */

    rgtHashRaw = window.web3.utils.soliditySha3(
      String(first).replace(/\s/g, ''),
      String(middle).replace(/\s/g, ''),
      String(last).replace(/\s/g, ''),
      String(ID).replace(/\s/g, ''),
      String(password).replace(/\s/g, ''),
    )

    var rgtHash = window.web3.utils.soliditySha3(idxHash, rgtHashRaw);
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);
    //setResult("");
    setTransactionActive(true);
    console.log("idxHash", idxHash);
    console.log("New rgtRaw", rgtHashRaw);
    console.log("New rgtHash", rgtHash);
    console.log("addr: ", props.addr);
    console.log("AC: ", assetClass);

    //console.log("IPFS bs58: ", window.rawIPFSHashTemp);
    console.log("IPFS bytes32: ", ipfsHash);

    /* swal({
      title: "You are about to create asset: "+idxHash,
      text:  "Address: "+props.addr+"\nipfs: "+ipfsHash+"\nrgtHash: "+rgtHash+"\nac: "+assetClass,
      button: "Okay",
    }) */

    await window.contracts.APP_NC.methods
      .$newRecordWithDescription(
        idxHash,
        rgtHash,
        assetClass,
        "1000000",
        ipfsHash
      )
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setError(Object.values(_error)[0]);
        if (tempTxHash !== undefined) {
          swal({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swal({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
        clearForms();
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "Asset Created!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          refreshBalances()
          window.location.href = "/#/user/dashboard"
          window.replaceAssetData = {key: pageKey, newAsset: newAsset}
        })
      });

    setAssetClass("");
  }

  const goBack = () => {
    window.location.href="/#/user/dashboard";
  }

  const classes = useStyles();
  return (
    <>
      {window.contracts === undefined && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h3>
                Connecting to the blockchain<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {props.IDHolder === undefined && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h3>
                Getting Token Balances<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {window.contracts !== undefined && props.IDHolder !== undefined && (
        <GridContainer>
          {props.IDHolder === false && (
            <>
              {assetClass === "" && transactionActive && (
                <Card>
                  <CardHeader icon>
                    <CardIcon className="headerIconBack">
                      <Category />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
                  </CardHeader>
                  <CardBody>
                    <form>
                      <h3>
                        Creating ID<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                      </h3>
                    </form>
                  </CardBody>
                  <br />
                </Card>
              )}
              {assetClass === "" && !transactionActive && (
                <Card>
                  <CardHeader icon>
                    <CardIcon className="headerIconBack">
                      <Category />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
                  </CardHeader>
                  <CardBody>
                    <form>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                        >
                          Select Asset Class
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={simpleSelect}
                          onChange={(e) => { ACLogin(e) }}
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Select Asset Class
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="1000003"
                          >
                            Trinkets
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="1000004"
                          >
                            Personal Computers
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                  </CardBody>
                  <br />
                </Card>
              )}
            </>
          )}
          {props.IDHolder && (
            <>
              <input type="file" onChange={uploadImage} ref={fileInput} className="imageInput" />
              {assetClass === "" && (
                <Card>
                  <CardHeader icon>
                    <CardIcon className="headerIconBack">
                      <Category />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
                  </CardHeader>
                  <CardBody>
                    <form>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                        >
                          Select Asset Class
                      </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={simpleSelect}
                          onChange={(e) => { ACLogin(e) }}
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Select Asset Class
                        </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="1000003"
                          >
                            Trinkets
                        </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="1000004"
                          >
                            Personal Computers
                        </MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                  </CardBody>
                  <br />
                </Card>
              )}
              {assetClass !== "" && (
                <>
                  <GridItem xs={12} sm={12} md={6}>
                    <Card>
                      <CardHeader icon>
                        <CardIcon className="headerIconBack">
                          <DashboardOutlined />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Asset</h4>
                      </CardHeader>
                      <CardBody>
                        <form>
                          <>
                            {!transactionActive && (
                              <CustomInput
                                labelText="Asset Name"
                                id="assetName"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setNameTag(event.target.value.trim())
                                  },
                                }}
                              />
                            )}
                            {transactionActive && (
                              <CustomInput
                                labelText="Asset Name"
                                id="assetName"
                                disabled
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setNameTag(event.target.value.trim())
                                  },
                                }}
                              />
                            )}
                          </>
                          {/* <h4 className={classes.cardIconTitle}>(optional)</h4> */}
                          {displayImage === "" && isUploading &&(<>
                            <br />
                            <br />
                            <CardHeader image className={classes.cardHeaderHoverCustom}>
                              <div className="loadingImage">
                            <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                            </CardHeader>
                          </>)}
                          {displayImage !== "" && !isUploading &&(<>
                            <br />
                            <br />
                            <CardHeader image className={classes.cardHeaderHoverCustom}>
                              <img src={displayImage} />
                            </CardHeader>
                          </>)}
                          {!transactionActive && displayImage === "" && !isUploading &&(
                              <Button color="info" onClick={() => { handleClick() }}>Upload Display Image</Button>
                          )}
                          {!transactionActive && displayImage !== "" && !isUploading && (<>
                            <Button color="info" onClick={() => { handleClick() }}>Change Display Image</Button>
                            <Button color="danger" onClick={() => { removeDisplayImage() }}>Remove Image</Button>
                          </>)}
                          {transactionActive && displayImage !== "" && (
                              <Button disabled> ... </Button>
                          )}
                          {!transactionActive && (
                            <>
                              <TextField
                                onChange={(e) => { setDescription(e.target.value) }}
                                id="outlined-multiline-static"
                                label="Asset Description:"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                              />
                            </>
                          )}
                          {transactionActive && description !== "" && (
                            <>
                              <TextField
                                id="outlined-multiline-static"
                                label="Asset Description:"
                                multiline
                                disabled
                                placeHolder={description}
                                rows={4}
                                variant="outlined"
                                fullWidth
                              />
                            </>
                          )}
                          {!transactionActive && (
                            <>
                              <CustomInput
                                success={loginManufacturerState === "success"}
                                error={loginManufacturerState === "error"}
                                labelText="Manufacturer *"
                                id="manufacturer"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setManufacturer(event.target.value.trim())
                                    if (event.target.value !== "") {
                                      setloginManufacturerState("success");
                                    } else {
                                      setloginManufacturerState("error");
                                    }
                                    setloginManufacturer(event.target.value);
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginTypeState === "success"}
                                error={loginTypeState === "error"}
                                labelText="Type *"
                                id="type"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setType(event.target.value.trim())
                                    if (event.target.value !== "") {
                                      setloginTypeState("success");
                                    } else {
                                      setloginTypeState("error");
                                    }
                                    setloginType(event.target.value);
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginModelState === "success"}
                                error={loginModelState === "error"}
                                labelText="Model *"
                                id="model"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setModel(event.target.value.trim())
                                    if (event.target.value !== "") {
                                      setloginModelState("success");
                                    } else {
                                      setloginModelState("error");
                                    }
                                    setloginModel(event.target.value);
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginSerialState === "success"}
                                error={loginSerialState === "error"}
                                labelText="Serial *"
                                id="serial"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setSerial(event.target.value.trim())
                                    if (event.target.value !== "") {
                                      setloginSerialState("success");
                                    } else {
                                      setloginSerialState("error");
                                    }
                                    setloginSerial(event.target.value);
                                  },
                                }}
                              />
                              <div className={classes.formCategory}>
                                <small>*</small> Required fields
              </div>
                            </>
                          )}
                          {transactionActive && (
                            <>
                              {assetName !== "" && (
                                <CustomInput
                                  labelText={assetName}
                                  id="assetName"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    disabled: true
                                  }}
                                />
                              )}
                              <CustomInput
                                labelText={manufacturer}
                                id="manufacturer"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={type}
                                id="type"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={model}
                                id="model"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={serial}
                                id="serial"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                            </>
                          )}
                          <h4>AC Selected: {assetClassName} (ID: {assetClass})</h4>
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Card>
                      <CardHeader icon>
                        <CardIcon className="headerIconBack">
                          <AccountBox />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Owner Information</h4>
                      </CardHeader>
                      <CardBody>
                        <form>
                          <>
                            {!transactionActive && (
                              <>
                                <CustomInput
                                  success={loginFirstState === "success"}
                                  error={loginFirstState === "error"}
                                  labelText="First Name *"
                                  id="firstName"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: event => {
                                      setFirst(event.target.value.trim())
                                      if (event.target.value !== "") {
                                        setloginFirstState("success");
                                      } else {
                                        setloginFirstState("error");
                                      }
                                      setloginFirst(event.target.value);
                                    },
                                  }}
                                />
                                <CustomInput
                                  labelText="Middle Name"
                                  id="middleName"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: event => {
                                      setMiddle(event.target.value.trim())
                                    },
                                  }}
                                />
                                <CustomInput
                                  success={loginLastState === "success"}
                                  error={loginLastState === "error"}
                                  labelText="Last Name *"
                                  id="lastName"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: event => {
                                      setLast(event.target.value.trim())
                                      if (event.target.value !== "") {
                                        setloginLastState("success");
                                      } else {
                                        setloginLastState("error");
                                      }
                                      setloginLast(event.target.value);
                                    },
                                  }}
                                />
                                <CustomInput
                                  success={loginIDState === "success"}
                                  error={loginIDState === "error"}
                                  labelText="ID Number *"
                                  id="idNumber"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    onChange: event => {
                                      setID(event.target.value.trim())
                                      if (event.target.value !== "") {
                                        setloginIDState("success");
                                      } else {
                                        setloginIDState("error");
                                      }
                                      setloginID(event.target.value);
                                    },
                                  }}
                                />
                                <CustomInput
                                  success={loginPasswordState === "success"}
                                  error={loginPasswordState === "error"}
                                  labelText="Password *"
                                  id="password"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type: "password",
                                    onChange: event => {
                                      setPassword(event.target.value.trim())
                                      if (event.target.value !== "") {
                                        setloginPasswordState("success");
                                      } else {
                                        setloginPasswordState("error");
                                      }
                                      setloginPassword(event.target.value);
                                    },
                                  }}
                                />
                                <div className={classes.formCategory}>
                                  <small>*</small> Required fields
                    </div>
                              </>
                            )}
                            {transactionActive && (
                              <>
                                <CustomInput
                                  labelText={first}
                                  id="first"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    disabled: true
                                  }}
                                />
                                <CustomInput
                                  labelText={middle}
                                  id="middle"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    disabled: true
                                  }}
                                />
                                <CustomInput
                                  labelText={last}
                                  id="last"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    disabled: true
                                  }}
                                />
                                <CustomInput
                                  labelText={ID}
                                  id="ID"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    disabled: true
                                  }}
                                />
                                <CustomInput
                                  labelText={password}
                                  id="password"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    type: "password",
                                    disabled: true
                                  }}
                                />
                              </>
                            )}
                          </>
                          {!transactionActive && !isUploading &&(
                            <>
                            <h4>Cost to create asset in AC: ü{NRCost}</h4>
                            <div className="MLBGradientSubmit">
                              <Button color="info" className="MLBGradient" onClick={() => checkAsset()}>Create New Asset</Button>
                            </div>
                            </>
                          )}
                          {!transactionActive && ipfsActive && (
                            <h3>
                              Uploading IPFS Data<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                            </h3>
                          )}
                          {!ipfsActive && transactionActive && (
                            <h3>
                              Creating Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                            </h3>
                          )}
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem>
                </>
              )}
            </>
          )}
        </GridContainer>
      )}
    </>
  );
}
