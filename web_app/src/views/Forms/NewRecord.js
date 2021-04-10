import React from "react";
import "../../assets/css/custom.css";
import swal from 'sweetalert';
import swalReact from '@sweetalert/with-react';
import base64 from 'base64-arraybuffer';
import Jdenticon from 'react-jdenticon';
import { Component } from "react";
import { setConstantValue } from "typescript";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

// @material-ui/icons
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";
import { DashboardOutlined, Description } from "@material-ui/icons";
import Icon from '@material-ui/core/Icon';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import extStyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle";
import { keys } from "@material-ui/core/styles/createBreakpoints";

import ARweavePNG from "../../assets/img/arweave.png";
import IPFSPNG from "../../assets/img/ipfs.png";
import fileUpload from "../../assets/img/fileUpload.png";

const useStyles = makeStyles(styles);
const useExtStyles = makeStyles(extStyles);

export default function NewRecord(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [rootSelect, setRootSelect] = React.useState("");
  const [classSelect, setClassSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [ipfsActive, setIpfsActive] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [assetClass, setAssetClass] = React.useState("");
  const [assetClassName, setAssetClassName] = React.useState("");
  const [classSelection, setClassSelection] = React.useState(null);
  const [rootSelection, setRootSelection] = React.useState(null);
  const [submittedIdxHash, setSubmittedIdxHash] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [NRCost, setNRCost] = React.useState("~");
  const [mintedID, setMintedID] = React.useState(false);
  const [selectedRootID, setSelectedRootID] = React.useState("");
  const [publicNode, setPublicNode] = React.useState(true);
  const [file, setFile] = React.useState(null);


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
  const [fileMetaData, setFileMetaData] = React.useState("");
  const [rawFile, setRawFile] = React.useState()
  const [storageProvider, setStorageProvider] = React.useState("2");


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
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    //postToArweave("String to upload", {name: "Beans", size: "Also beans"})
  }, [])

  const postToArweave = async (data, metaData, idxHash, ipfsObj) => {
    let dataTransaction = await props.arweaveClient.createTransaction({
      data,
    }, props.testWeave.rootJWK)

    console.log("pre-tags", dataTransaction.tags, "Size:", Buffer.from(JSON.stringify(dataTransaction.tags)).length);

    if(metaData){

      const vals = Object.values(metaData);
      const keys = Object.keys(metaData);

      for (let i = 0; i < keys.length; i++) {
        dataTransaction.addTag(String(keys[i]), String(vals[i]))
      }

    }

    console.log("post-tags", dataTransaction.tags, "Size:", Buffer.from(JSON.stringify(dataTransaction.tags)).length)
    
    console.log(dataTransaction);

    await props.arweaveClient.transactions.sign(dataTransaction, props.testWeave.rootJWK)
    const statusBeforePost = await props.arweaveClient.transactions.getStatus(dataTransaction.id)
    console.log(statusBeforePost); // this will return 404
    await props.arweaveClient.transactions.post(dataTransaction)
    const statusAfterPost = await props.arweaveClient.transactions.getStatus(dataTransaction.id)
    console.log(statusAfterPost); // this will return 202
    //await testWeave.mine();
    mineTx().then(async ()=>{
      const statusAfterMine = await props.arweaveClient.transactions.getStatus(dataTransaction.id);
      console.log(statusAfterMine);
      setIpfsActive(false)
      handleHash(window.web3.utils.utf8ToHex(dataTransaction.id), idxHash, ipfsObj);
    });
  }

  const mineTx = async () => {
    await props.testWeave.mine(); 
    await props.testWeave.mine()
    await props.testWeave.mine() 
    return
  }

  const rootLogin = (e) => {

    if (!e.target.value) return setRootSelect("")
    if (!props.IDHolder && !mintedID) {
      IDHolderPrompt()
    }

    else {
      setRootSelect(e.target.value)
      setSelectedRootID(e.target.value)
    }
  }

  const ACLogin = (event) => {

      setAssetClass(event.target.value);
      setClassSelect(event.target.value);
      console.log(event.target.value);
      try {
        window.utils.resolveACFromID(event.target.value).then((e) => {
          let str = e.substring(0, 1).toUpperCase() + e.substring(1, e.length).toLowerCase();
          setAssetClassName(str)
          window.utils.retreiveCosts(6, event.target.value).then((e) => {
            setNRCost(e.cost1.totalCost)
          })
          setStorageProvider("2");
        })
      }
      catch {
        swal({
          title: "Could not find asset class",
          icon: "warning",
          text: "Please try again.",
          buttons: {
            close: {
              text: "close",
            }
          },
        })
      }
  };

  const refreshBalances = async () => {
    if (!window.web3.eth) return

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
          else { window.replaceAssetData = { assets: result, ether, pruf } }
          forceUpdate()
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

            const pageKey = thousandHashesOf(props.addr, props.winKey)

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
                }).then(() => {
                  window.replaceAssetData = { IDHolder: true }
                  setMintedID(true)
                  forceUpdate()
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

  const handleFileChange = e => {
    // e.preventDefault();
    let reader = new FileReader();
    let newFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(newFile);
    };
    if (newFile) {
      reader.readAsDataURL(newFile);
    }
    console.log("newFile:", e.target.files[0])
  };

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
          window.ipfs.add(prefix + base64.encode(e)).then((hash) => {
            if (!hash) {
              //console.error(err)
              return setIsUploading(false);
            }
            else {
              let url = `https://ipfs.io/ipfs/${hash.cid}`
              console.log(`Url --> ${url}`)
              setDisplayImageUrl(url);
              setDisplayImage(prefix + base64.encode(e));
              setIsUploading(false)
              return forceUpdate();
            }
          })
        })
      }
      else {
        resizeImg(tempBuffer, { height: i.height, width: i.width, format: "jpg" }).then((e) => {
          console.log("Converted to .JPG");
          window.ipfs.add(prefix + base64.encode(e)).then((hash) => {
            if (!hash) {
              //console.error(err)
              return setIsUploading(false);
            }
            else {
              let url = `https://ipfs.io/ipfs/${hash.cid}`
              console.log(`Url --> ${url}`)
              setDisplayImageUrl(url);
              setDisplayImage(prefix + base64.encode(e));
              setIsUploading(false)
              return forceUpdate();
            }
          })
        })
      };
    }

    i.src = src;
  }
  const uploadOther = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let file;
    file = e.target.files[0]
    const reader = new FileReader();

    reader.onloadend = (e) => {
      setFileMetaData(file);
      const prefix = `data:${file.type};base64,`;
      const buf = Buffer(reader.result)
      setRawFile(reader.result)
      setDisplayImage(prefix+base64.encode(buf))
    }

    reader.readAsArrayBuffer(file); // Read Provided File
  } 

  const uploadImage = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let file;
    file = e.target.files[0]

    if(storageProvider === "2"){
      return uploadOther(e)
    }

    else if (!file.type.includes("image")){
      return
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {

      console.log(file)
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

  const handleHash = (extendedDataHash, idxHash, ipfsObj) => {
    if(storageProvider === "2"){
      let extDataA = String(extendedDataHash).substring(0, 66)
      let extDataB = "0x"+String(extendedDataHash).substring(66, String(extendedDataHash).length)
      _newRecord(extDataA, extDataB, idxHash, ipfsObj)
    }

    else {
      let ipfsB32 = window.utils.getBytes32FromIPFSHash(String(extendedDataHash));
      _newRecord(ipfsB32, "", idxHash, ipfsObj)
    }
  }

  const removeDisplayImage = () => {
    /*     let i = new Image();
    
        i.onload = function () {
          if (props.ps) {
            props.ps.element.scrollTop -= i.height
          } */
    setDisplayImageUrl("")
    setDisplayImage("")
    setRawFile()
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
      ipfsObj = { photo: {}, text: {}, urls: {}, Description: "", DisplayImage: "", name: String(nameTag) }
    }

    else {
      ipfsObj = { photo: {}, text: {}, urls: {}, Description: "", DisplayImage: "", name: "" }
    }

    if (description !== "") {
      ipfsObj.Description = description;
    }

    if (displayImage !== "") {
      ipfsObj.DisplayImage = displayImageUrl;
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

    if(storageProvider === "1"){
      window.ipfs.add(payload).then((hash) => {
        if (!hash) {
          console.log("Something went wrong. Unable to upload to ipfs");
          setIpfsActive(false);
        }
        else {
          console.log("uploaded at hash: ", hash.cid.string);
          handleHash(String(hash.cid), idxHash, ipfsObj);
          setIpfsActive(false);
        }
      })
    }

    else if (storageProvider === "2"){
      let file = fileMetaData;
      let metaData = {maker: manufacturer, type: type, series: model, serial: serial, nodeKey: assetClassName, Description: ipfsObj.Description, name: ipfsObj.name}
      metaData["Content-Type"] = file.type
      metaData["Size"] = file.size
      metaData["FileName"] = file.name
      metaData["Last-Modified"] = file.lastModified
 
      postToArweave(rawFile, metaData, idxHash, ipfsObj)
    }
    
  }

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const generateSubCatList = (arr) => {
    let subCatSelection = [
      <MenuItem
        disabled
        key={"keySelSubClass"}
        classes={{
          root: classes.selectMenuItem
        }}
      >
        Select a Subclass
      </MenuItem>
    ];
    for (let i = 0; i < arr.length; i++) {
      subCatSelection.push(
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          key={"key" + arr[i].name}
          value={String(arr[i].id)}
        >
          {arr[i].name}
        </MenuItem>
      );
    }
    //console.log(arr)
    return subCatSelection
  }

  const generateRootList = (arr) => {
    let rootNames = props.rootNames
    let rootSelection = [
      <MenuItem
        disabled
        key={"keySelClass"}
        classes={{
          root: classes.selectMenuItem
        }}
      >
        Select a Class
      </MenuItem>
    ];

    for (let i = 0; i < arr.length; i++) {
      rootSelection.push(
        <MenuItem
          key={"key" + String(arr[i])}
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={String(arr[i])}
        >
          {rootNames[i]}
        </MenuItem>
      );

    }

    return rootSelection;

  }

  const generateNodeList = (arr) => {
    if (!arr || arr === null) return
    let nodeNames = props.rootNames
    let nodeSelection = [
      <MenuItem
        disabled
        key={"keySelClass"}
        classes={{
          node: classes.selectMenuItem
        }}
      >
        Select a Class
      </MenuItem>
    ];

    for (let i = 0; i < arr.length; i++) {
      nodeSelection.push(
        <MenuItem
          key={"key" + String(arr[i])}
          classes={{
            node: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={String(arr[i])}
        >
          {nodeNames[i]}
        </MenuItem>
      );

    }

    return nodeSelection;

  }



  const _newRecord = async (extDataA, extDataB, idx, ipfsObj) => { //create a new asset record
    //console.log("assetClass: ", assetClass)
    swalReact({
      content:
        <div className="picture-container">
          <img src={ARweavePNG} className="ARweave" />
          <h4>Please upload your Arweave key file</h4>
          <div className="picture">
            <img src={fileUpload} className="uploadFile" />
            <input type="file" onChange={e => handleFileChange(e)} />
          </div>
          {file === null && (
            <h6 className="description">Choose File</h6>
          )}
          {file !== null && (
            <h6 className="description">{file}</h6>
          )}
        </div>,
      buttons: "close"
    })

    const pageKey = thousandHashesOf(props.addr, props.winKey)

    if(storageProvider === "1"){
      console.log('Using ipfs')
      let tempTxHash;
      var extendedDataHash = extDataA;
      var rgtHashRaw, idxHash;
  
      let newAsset = {
        root: selectedRootID,
        idxHash: idx,
        id: idx,
        storageProvider: "1",
        ipfs: extendedDataHash,
        DisplayImage: displayImage,
        photo:  ipfsObj.photo,
        photoUrls: { DisplayImage: displayImageUrl },
        text: ipfsObj.text,
        urls: ipfsObj.urls,
        name: ipfsObj.name,
        DisplayImage: displayImage,
        assetClass: assetClass,
        assetClassName: assetClassName.substring(0, 1).toUpperCase() + assetClassName.substring(1, assetClassName.length).toLowerCase(),
        dBIndex: props.assetArr.length,
        countPair: [100000, 100000],
        status: "Transferable",
        statusNum: 51,
        Description: ipfsObj.Description,
        engraving: ipfsObj,
        identicon: [<Jdenticon value={idx} />],
        identiconLG: [<Jdenticon value={idx} />]
      }
  
      idxHash = idx;
  
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
      console.log("IPFS bytes32: ", extendedDataHash);
  
      /* swal({
        title: "You are about to create asset: "+idxHash,
        text:  "Address: "+props.addr+"\nipfs: "+extendedDataHash+"\nrgtHash: "+rgtHash+"\nac: "+assetClass,
        button: "Okay",
      }) */
  
      await window.contracts.APP_NC.methods
        .newRecordWithNote(
          idxHash,
          rgtHash,
          assetClass,
          "1000000",
          extendedDataHash,
          ""
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
          }).then(() => {
            //refreshBalances()
            //window.replaceAssetData = { pruf: props.pruf-NRCost }
            window.location.href = "/#/user/dashboard"
            window.replaceAssetData = { key: pageKey, newAsset: newAsset }
          })
        });
    }

    else if (storageProvider === "2") {
      console.log('Using arweave')
      let tempTxHash;
      var extendedDataHash = extDataA + extDataB;
      var rgtHashRaw, idxHash;
  
      let newAsset = {
        root: selectedRootID,
        idxHash: idx,
        id: idx,
        storageProvider: "2",
        ipfs: extendedDataHash,
        photo:  ipfsObj.photo,
        photoUrls: { DisplayImage: displayImageUrl },
        text: ipfsObj.text,
        urls: ipfsObj.urls,
        name: ipfsObj.name,
        DisplayImage: `http://localhost:1984/${extendedDataHash}`,
        assetClass: assetClass,
        assetClassName: assetClassName.substring(0, 1).toUpperCase() + assetClassName.substring(1, assetClassName.length).toLowerCase(),
        dBIndex: props.assetArr.length,
        countPair: [100000, 100000],
        status: "Transferable",
        statusNum: 51,
        Description: ipfsObj.Description,
        engraving: ipfsObj,
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
      console.log("IPFS bytes32: ", extendedDataHash);
  
      /* swal({
        title: "You are about to create asset: "+idxHash,
        text:  "Address: "+props.addr+"\nipfs: "+extendedDataHash+"\nrgtHash: "+rgtHash+"\nac: "+assetClass,
        button: "Okay",
      }) */
  
      await window.contracts.APP_NC.methods
        .newRecordWithNote(
          idxHash,
          rgtHash,
          assetClass,
          "1000000",
          extDataA,
          extDataB
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
          }).then(() => {
            //refreshBalances()
            //window.replaceAssetData = { pruf: props.pruf-NRCost }
            window.location.href = "/#/user/dashboard"
            window.replaceAssetData = { key: pageKey, newAsset: newAsset }
          })
        });
    }

    setAssetClass("");
  }

  const goBack = () => {
    window.location.href = "/#/user/dashboard";
  }

  const classes = useStyles();
  const extClasses = useExtStyles();
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
      {props.IDHolder === undefined && window.contracts !== undefined && (
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
      {props.IDHolder !== undefined && window.contracts !== undefined && props.assetClassSets === undefined && (
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
                Getting Asset Class Data<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {window.contracts !== undefined && props.IDHolder !== undefined && props.assetClassSets !== undefined && (
        <GridContainer>
          <>
            <input type="file" onChange={uploadImage} ref={fileInput} className="imageInput" />
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
                    {publicNode && (
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
                          value={rootSelect}
                          onChange={(e) => { rootLogin(e) }}
                          inputProps={{
                            name: "rootSelect",
                            id: "root-select"
                          }}
                        >
                          {generateRootList(props.roots)}
                        </Select>
                      </FormControl>
                    )}
                    {!publicNode && (
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
                          value={rootSelect}
                          // onChange={(e) => { ACLogin(e) }}
                          inputProps={{
                            name: "rootSelect",
                            id: "root-select"
                          }}
                        >

                          <MenuItem
                            disabled
                            key={"N/A"}
                            classes={{
                              node: classes.selectMenuItem
                            }}
                          >
                            Currently Unavailable
                          </MenuItem>
                          {/* {generateNodeList(props.nodeList)} */}
                        </Select>
                      </FormControl>
                    )}
                    <br></br>
                    {/* {selectedRootID !== "" && !publicNode && ( */}
                    {selectedRootID !== "" && (
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <>
                          <InputLabel
                          >
                            Select Asset Subclass
                      </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={classSelect}
                            onChange={(e) => { ACLogin(e) }}
                            inputProps={{
                              name: "classSelect",
                              id: "class-select"
                            }}
                          >
                            {generateSubCatList(props.assetClassSets[selectedRootID])}
                          </Select>
                        </>
                      </FormControl>
                    )}
                    {/* {!transactionActive && (
                      <div className={extClasses.block}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={publicNode}
                              onChange={event => setPublicNode(!publicNode)}
                              value="publicNode"
                              classes={{
                                switchBase: extClasses.switchBase,
                                checked: extClasses.switchChecked,
                                thumb: extClasses.switchIcon,
                                track: extClasses.switchBar
                              }}
                            />
                          }
                          classes={{
                            label: extClasses.label
                          }}
                          label="Select Public Node"
                        />
                      </div>
                    )} */}
                  </form>
                </CardBody>
                <br />
              </Card>
            )}
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
                              labelText={nameTag}
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
                        {displayImage === "" && isUploading && (<>
                          <br />
                          <br />
                          <CardHeader image className={classes.cardHeaderHoverCustom}>
                            <div className="loadingImage">
                              <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                          </CardHeader>
                        </>)}
                        {displayImage !== "" && !isUploading && (<>
                          <br />
                          <br />
                          <CardHeader image className={classes.cardHeaderHoverCustom}>
                            <img src={displayImage} />
                          </CardHeader>
                        </>)}
                        {!transactionActive && displayImage === "" && !isUploading && (
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
                              placeholder={description}
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
                        {storageProvider === "2"
                        ? <h6 className="storageProviderText">Permanent data storage by <a href='https://www.arweave.org/' target='_blank'><img src={ARweavePNG} className="ARweave"></img></a></h6>
                        :<h6 className="storageProviderText">Asset data stored using  <a href='https://ipfs.io/' target='_blank'><img src={IPFSPNG} className="IPFS"></img></a></h6>
                        }
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
                        {!transactionActive && !isUploading && (
                          <>
                            <h4 className="costsText">Cost: ü{NRCost}</h4>
                            <div className="MLBGradientSubmit">
                              <Button color="info" className="MLBGradient" onClick={() => checkAsset()}>Create New Asset</Button>
                            </div>
                          </>
                        )}
                        {!transactionActive && ipfsActive && (
                          <h3>
                            Sending extended data to {`Arweave`}<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                          </h3>
                        )}
                        {!ipfsActive && transactionActive && (
                          <h3>
                            Minting Asset Token<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                          </h3>
                        )}
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            )}
          </>
          {/* )} */}
        </GridContainer>
      )}
    </>
  );
}
