import React from "react";
import "../../assets/css/custom.css";
import swal from "sweetalert";
import base64 from "base64-arraybuffer";
import Jdenticon from "react-jdenticon";
//import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf'
import { isMobile } from "react-device-detect";
import placeholder from "../../assets/img/placeholder.jpg";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

// @material-ui/icons
import Category from "@material-ui/icons/Category";
import { DashboardOutlined } from "@material-ui/icons";

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
// import extStyles from 'assets/jss/material-dashboard-pro-react/views/extendedFormsStyle'

import ARweavePNG from "../../assets/img/arweave.png";
import IPFSPNG from "../../assets/img/ipfs.png";

const useStyles = makeStyles(styles);
// const useExtStyles = makeStyles(extStyles)

export default function NewRecord(props) {
  if (!window.sentPacket) window.sentPacket = {}

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [showHelp, setShowHelp] = React.useState(false);
  const [rootSelect, setRootSelect] = React.useState("");
  const [classSelect, setClassSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  // const [IDtransactionActive, setIDtransactionActive] = React.useState(false);
  const [ipfsActive, setIpfsActive] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  const [nodeId, setNodeId] = React.useState("");
  const [nodeName, setNodeName] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [submittedIdxHash, setSubmittedIdxHash] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [NRCost, setNRCost] = React.useState("~");
  // const [mintedID, setMintedID] = React.useState(false);
  const [selectedRootID, setSelectedRootID] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [publicNode, setPublicNode] = React.useState(true);
  // eslint-disable-next-line no-unused-vars
  const [contentUrl, setContentUrl] = React.useState("");

  //const [ipfsObj, setIpfsObj] = React.useState("");

  // eslint-disable-next-line no-unused-vars
  const [assetName, setAssetName] = React.useState("");
  // const [make, setMake] = React.useState("");
  // const [type, setType] = React.useState("");
  const [model, setModel] = React.useState("");
  const [serial, setSerial] = React.useState("");
  const [nameTag, setNameTag] = React.useState("");
  const [engraving, setEngraving] = React.useState("");
  const [displayImage, setDisplayImage] = React.useState("");
  const [displayImageUrl, setDisplayImageUrl] = React.useState("");
  const [fileMetaData, setFileMetaData] = React.useState("");
  const [rawFile, setRawFile] = React.useState();
  const [storageProvider, setStorageProvider] = React.useState("");

  const [loginMake, setloginMake] = React.useState("");
  const [loginType, setloginType] = React.useState("");
  const [loginModel, setloginModel] = React.useState("");
  const [loginSerial, setloginSerial] = React.useState("");
  const [loginMakeState, setloginMakeState] = React.useState("");
  const [loginTypeState, setloginTypeState] = React.useState("");
  const [loginModelState, setloginModelState] = React.useState("");
  const [loginSerialState, setloginSerialState] = React.useState("");

  const [first, setFirst] = React.useState("");
  const [middle, setMiddle] = React.useState("");
  const [last, setLast] = React.useState("");
  const [ID, setID] = React.useState("");
  const [PDF, setPDF] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginFirst, setloginFirst] = React.useState("");
  const [loginLast, setloginLast] = React.useState("");
  const [loginID, setloginID] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");

  const [loginFirstState, setloginFirstState] = React.useState("");
  const [loginLastState, setloginLastState] = React.useState("");
  const [loginIDState, setloginIDState] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");

  // eslint-disable-next-line no-unused-vars
  const [nodeExtendedData, setNodeExtendedData] = React.useState();

  // eslint-disable-next-line no-unused-vars
  const [txHash, setTxHash] = React.useState("");

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const maxImageSize = 1000;
  const assetArr = Object.values(props.assetObj)
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const link = document.createElement("div");
  const resizeImg = require("resize-img");

  let fileInput = React.createRef();
  let pdfDoc = React.createRef();

  React.useEffect(() => {
    let element = pdfDoc
    console.log(element)
    //setDisplayImage(element.current.toDataURL())
  }, [PDF])

  React.useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, []);

  const postToArweave = async (data, metaData, idxHash, ipfsObj) => {

    let dataTransaction = await props.arweaveClient.createTransaction({ data: data });

    console.log(
      "pre-tags",
      dataTransaction.tags,
      "Size:",
      Buffer.from(JSON.stringify(dataTransaction.tags)).length
    );

    if (metaData) {
      dataTransaction.addTag("Primary-Content", `https://arweave.net/${dataTransaction.id}`)
      const vals = Object.values(metaData);
      const keys = Object.keys(metaData);

      for (let i = 0; i < keys.length; i++) {
        dataTransaction.addTag(String(keys[i]), String(vals[i]));
      }
    }

    console.log(
      "post-tags",
      dataTransaction.tags,
      "Size:",
      Buffer.from(JSON.stringify(dataTransaction.tags)).length
    );

    console.log(dataTransaction);

    // eslint-disable-next-line react/prop-types
    await props.arweaveClient.transactions.sign(
      dataTransaction
    );
    // eslint-disable-next-line react/prop-types
    const statusBeforePost = await props.arweaveClient.transactions.getStatus(
      dataTransaction.id
    );
    console.log(statusBeforePost); // this will return 404

    ///console.log(statusAfterPost); // this will return 202
    mineTx(dataTransaction).then(async () => {
      // eslint-disable-next-line react/prop-types

      setIpfsActive(false);

      ipfsObj.displayImage = `https://arweave.net/${dataTransaction.id}`

      handleHash(
        dataTransaction.id,
        window.web3.utils.utf8ToHex(dataTransaction.id),
        idxHash,
        ipfsObj
      );
    });
  };

  const mineTx = async (tx) => {
    let uploader = await props.arweaveClient.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
  }
  const rootLogin = (e) => {
    if (!e.target.value) return setRootSelect("");
    // eslint-disable-next-line react/prop-types
    // if (!props.IDHolder && !mintedID) {
    //   IDHolderPrompt();
    // } else {
      setRootSelect(e.target.value);
      setSelectedRootID(e.target.value);
    // }
  };

  const nodeLogin = (event) => {
    document.body.style.cursor = 'wait'
    console.log(event.target.value);
    props.prufClient.get
      // eslint-disable-next-line react/prop-types
      .node.record(event.target.value.id)
      .then(e => {
        setNodeExtendedData(e);
        setStorageProvider(e.storageProvider);
        if(e.storageProvider === "2") {
          window.dispatchEvent(props.connectArweave)
        }
      })
    setNodeName(
      event.target.value.name
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
          letter.toUpperCase()
        )
    );
    // console.log(nodeData)
    setNodeId(event.target.value.id);
    setClassSelect(event.target.value.id);
    document.body.style.cursor = 'auto',
      props.prufClient.get.node
        // eslint-disable-next-line react/prop-types
        .invoiceForOperation(event.target.value.id, "1")
        .then(e => {
          setNRCost(e.total);
        });
  };

  // const IDHolderPrompt = () => {
    // // eslint-disable-next-line react/prop-types
    // if (!props.addr) {
    //   return swal({
    //     title: "Could not get user address",
    //     icon: "warning",
    //     text: "Please connect to an Ethereum provider and try again.",
    //     buttons: {
    //       close: {
    //         text: "close",
    //         value: "close",
    //       },
    //     },
    //   });
    // }
    // let tempTxHash;

    // swal({
    //   title: "In order to mint asset tokens, you must first have an ID token.",
    //   icon: "warning",
    //   text: "If you would like to mint an ID token, please select Yes",
    //   buttons: {
    //     yes: {
    //       text: "Yes",
    //       value: "yes",
    //     },
    //     no: {
    //       text: "No",
    //       value: "no",
    //     },
    //   },
    // }).then((value) => {
    //   switch (value) {
    //     case "yes":
    //       setIDTransactionActive(true);
    //       props.prufClient.do
    //         .getId()
    //         // eslint-disable-next-line react/prop-types
    //         .send({ from: props.addr })
    //         .on("error", function (_error) {
    //           setIDTransactionActive(false);
    //           setTxStatus(false);
    //           setTxHash(Object.values(_error)[0].transactionHash);
    //           tempTxHash = Object.values(_error)[0].transactionHash;
    //           let str1 =
    //             "Check out your TX <a href='https://kovan.etherscan.io/tx/";
    //           let str2 = "' target='_blank'>here</a>";
    //           link.innerHTML = String(str1 + tempTxHash + str2);
    //           if (tempTxHash !== undefined) {
    //             swal({
    //               title: "Something went wrong!",
    //               content: link,
    //               icon: "warning",
    //               button: "Close",
    //             });
    //           }
    //           if (tempTxHash === undefined) {
    //             swal({
    //               title: "Something went wrong!",
    //               icon: "warning",
    //               button: "Close",
    //             });
    //           }
    //         })
    //         .on("receipt", (receipt) => {
    //           setIDTransactionActive(false);
    //           setTxStatus(receipt.status);
    //           tempTxHash = receipt.transactionHash;
    //           let str1 =
    //             "Check out your TX <a href='https://kovan.etherscan.io/tx/";
    //           let str2 = "' target='_blank'>here</a>";
    //           link.innerHTML = String(str1 + tempTxHash + str2);
    //           swal({
    //             title: "ID Token Minted!",
    //             content: link,
    //             icon: "success",
    //             button: "Close",
    //           }).then(() => {
    //             window.replaceAssetData.refreshBals = true
    //             window.dispatchEvent(props.refresh)
    //             setMintedID(true);
    //             forceUpdate();
    //           });
    //         });

    //       break;

    //     case "no":
    //       break;

    //     default:
    //       break;
    //   }
    // });
  // };

  const handleClick = () => {
    setIsUploading(true)
    setPDF("")
    setRawFile("")
    fileInput.current.value = "";
    fileInput.current.click();
  };

  const clearForms = () => {
    setDisplayImage("");
    setDisplayImageUrl("");
    setMake("");
    setType("");
    setModel("");
    setSerial("");
    setFirst("");
    setMiddle("");
    setLast("");
    setID("");
    setPassword("");

    setloginMakeState("");
    setloginTypeState("");
    setloginModelState("");
    setloginSerialState("");
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");
    setloginPasswordState("");
    setloginPasswordState("");

    setNodeId("");
    console.log("clearing forms");
  };

  const addToIpfs = async (prefix, buffer) => {
    if (!buffer) return;
    console.log(`Adding file with base64 prefix: ${prefix}`);
    let tempBuffer = buffer;
    let src = prefix + base64.encode(tempBuffer);

      window.ipfs.add(src).then((hash) => {
        if (!hash) {
          console.error("ERROR UPLOADING TO IPFS")
          return setIsUploading(false);
        } else {
          let url = `https://ipfs.io/ipfs/${hash.cid}`;
          console.log(`Url --> ${url}`);
          if (prefix.includes("image")){
            setDisplayImageUrl(url);
            setDisplayImage(src);
            setContentUrl(url)
          } else if (prefix.includes("pdf")) {
            setDisplayImage(placeholder);
            setContentUrl(url)
          } else if (prefix.includes("zip")) {
            setDisplayImage(placeholder);
            setContentUrl(url)
          }
          setIsUploading(false);
        }
      });
  };

  const uploadImage = (e) => {
    e.preventDefault();
    console.log(e)
    if (!e.target.files[0]) return;
    let file;
    file = e.target.files[0];
    const reader = new FileReader();

    if (storageProvider === "2") {
      console.log(`Reading file... SP2`)
      reader.onloadend = () => {
        setFileMetaData(file);
        const _fileType = file.type;
        const prefix = `data:${_fileType};base64,`;
        const buffer = Buffer(reader.result);
        setFileType(_fileType)
        setRawFile(reader.result);

        if (_fileType.includes("image")) {
          setDisplayImage(prefix + base64.encode(buffer))
          setIsUploading(false);
        }
        else if (_fileType.includes("pdf") || _fileType.includes("zip")) {
          setDisplayImage(placeholder);
          setIsUploading(false);
        } else  {
          swal(`File type '${_fileType}' not supported`)
          setIsUploading(false);
        }
      };

    } else if (storageProvider === "1") {

      reader.onloadend = () => {
        console.log(`Reading file... SP1`)
        console.log(file);
        setIsUploading(true);
        const _fileType = file.type;
        const prefix = `data:${_fileType};base64,`;
        const buffer = Buffer(reader.result);
        setFileType(_fileType)
        setRawFile(reader.result);
        if (_fileType.includes("pdf") || _fileType.includes("zip") || _fileType.includes("image")) {
          addToIpfs(prefix, buffer)
        } else {
          swal(`File type '${_fileType}' not supported`)
          setIsUploading(false);
        }
      };

    }
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
  };

  const handleHash = async (dataTransaction, extendedDataHash, idxHash, ipfsObj) => {
    if (storageProvider === "2") {
      let extDataA = String(extendedDataHash).substring(0, 66);
      
      let extDataB =
        "0x" +
        String(extendedDataHash).substring(66, String(extendedDataHash).length);
      _newRecord(dataTransaction, extDataA, extDataB, idxHash, ipfsObj);
    } else {
      props.prufClient.utils.ipfsToB32(
        String(extendedDataHash)
      ).then(e => {
        console.log(`b32 of ipfs bs58 hash: ${e}\n Asset id: ${idxHash}\n nonMutableStorage object: ${ipfsObj}\n Storage provider: ${storageProvider}`);
        _newRecord(
          dataTransaction,
          e,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          idxHash,
          ipfsObj
        );
      })
    }
  };

  const removedisplayImage = () => {
    setDisplayImageUrl("");
    setDisplayImage("");
    setRawFile();
  };

  const checkAsset = async () => {

    console.log(storageProvider)

    // if (
    //   loginType === "" ||
    //   loginMake === "" ||
    //   loginModel === "" ||
    //   loginSerial === "" ||
    //   loginFirst === "" ||
    //   loginLast === "" ||
    //   loginID === "" ||
    //   loginPassword === ""
    // ) {
    //   if (loginType === "") {
    //     setloginTypeState("error");
    //   }
    //   if (loginMake === "") {
    //     setloginMakeState("error");
    //   }
    //   if (loginModel === "") {
    //     setloginModelState("error");
    //   }
    //   if (loginSerial === "") {
    //     setloginSerialState("error");
    //   }
    //   if (loginFirst === "") {
    //     setloginFirstState("error");
    //   }
    //   if (loginLast === "") {
    //     setloginLastState("error");
    //   }
    //   if (loginID === "") {
    //     setloginIDState("error");
    //   }
    //   if (loginPassword === "") {
    //     setloginPasswordState("error");
    //   }
    //   return;
    // }
    // console.log(type, make, model, serial)
    console.log(model, serial)
    props.prufClient.utils.generateRawAssetID(
      {
        // type: type,
        // make: make,
        model: model,
        serial: serial
      }
    ).then(idxHash => {

      props.prufClient.get.asset.tokenExists(idxHash).then(doesExist => {

        if (doesExist) {
          return swal({
            title: "Asset already exists!",
            icon: "warning",
            button: "Close",
          });
        }
      })

      let ipfsObj;
      setShowHelp(false);

      if (nameTag !== "") {
        ipfsObj = {
          photo: {},
          text: {},
          urls: {},
          engraving: "",
          displayImage: "",
          PrimaryContent: contentUrl,
          ContentType: fileType,
          name: String(nameTag),
        };
      } else {
        ipfsObj = {
          photo: {},
          text: {},
          urls: {},
          engraving: "",
          displayImage: "",
          PrimaryContent: contentUrl,
          ContentType: fileType,
          name: "",
        };
      }

      if (engraving !== "") {
        ipfsObj.engraving = engraving;
      }

      if (displayImage !== "") {
        ipfsObj.displayImage = storageProvider === "1" ? displayImageUrl : "";
        ipfsObj.photo.displayImage = storageProvider === "1" ? displayImageUrl : "";
      }

      let payload = JSON.stringify(ipfsObj);
      let fileSize = Buffer.byteLength(payload, "utf8");

      if (fileSize > 50000000) {
        return swal({
          title:
            "Document size exceeds 50 MB limit! (" + String(fileSize) + "Bytes)",
          content: link,
          icon: "warning",
          button: "Close",
        });
      }

      setIpfsActive(true);

      if (storageProvider === "1") {
        window.ipfs.add(payload).then((hash) => {
          if (!hash) {
            console.log("Something went wrong. Unable to upload to ipfs");
            setIpfsActive(false);
          } else {
            console.log("uploaded at hash: ", hash.cid.string);
            console.log("idxHash: ", idxHash);
            console.log("ipfsObj: ", ipfsObj);
            handleHash("", hash.cid.string, idxHash, ipfsObj);
            setIpfsActive(false);
          }
        });
      } else if (storageProvider === "2") {
        let file = fileMetaData;
        let metaData = {
          engraving: ipfsObj.engraving,
          name: ipfsObj.name,
        };
        metaData["Content-Type"] = file.type;
        metaData["Size"] = file.size;
        metaData["FileName"] = file.name;
        metaData["Last-Modified"] = file.lastModified;

        postToArweave(rawFile, metaData, idxHash, ipfsObj);
      }
      
      setSubmittedIdxHash(idxHash);
    })
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
    }
    return tempHash;
  };

  const generateSubCatList = (arr) => {
    let subCatSelection = [
      <MenuItem
        disabled
        key={"keySelNode"}
        classes={{
          root: classes.selectMenuItem,
        }}
      >
        Select a Node
      </MenuItem>,
    ];

    for (let i = 0; i < arr.length; i++) {
      subCatSelection.push(
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          key={"key" + arr[i].name}
          value={{ name: arr[i].name, id: String(arr[i].id) }}
        >
          {arr[i].name}
        </MenuItem>
      );
    }
    return subCatSelection;
  };

  const generateRootList = (arr) => {
    // eslint-disable-next-line react/prop-types
    let rootNames = props.rootNames;
    let rootSelection = [
      <MenuItem
        disabled
        key={"keySelClass"}
        classes={{
          root: classes.selectMenuItem,
        }}
      >
        Select a Root
      </MenuItem>,
    ];

    arr.forEach(root => {
      rootSelection.push(
        <MenuItem
          key={"key" + String(root.id)}
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          value={String(root.id)}
        >
          {root.name}
        </MenuItem>
      );
    })

    return rootSelection;
  };

  const _newRecord = (dataTransaction, extDataA, extDataB, idx, ipfsObj) => {
    if (NRCost > props.pruf) {
      return swal({
        title: "Insufficient PRUF balance!",
        icon: "warning",
        button: "Close",
      });
    }
    console.log(extDataA, extDataB, idx, ipfsObj)
    var extendedDataHash, idxHash, rgtHash

    // eslint-disable-next-line react/prop-types
    const pageKey = thousandHashesOf(props.addr, props.winKey);

    if (storageProvider === "1") {
      console.log("Using ipfs");
      let tempTxHash;
      extendedDataHash = extDataA;

      let newAsset = {
        root: selectedRootID,
        nodeData: {
          storageProvider: "1",
          ipfs: extendedDataHash,
          root: selectedRootID,
          name: nodeName.substring(0, 1).toUpperCase() +
            nodeName.substring(1, nodeName.length).toLowerCase(),
          id: nodeId,
        },
        idxHash: window.web3.utils.soliditySha3({t: 'bytes32', v: idx}, {t: 'uint32', v: nodeId}), 
        currency: "0",
        id: idx,
        ipfs: extendedDataHash,
        displayImage: displayImage,
        photo: ipfsObj.photo,
        photoUrls: { displayImage: displayImageUrl },
        text: ipfsObj.text,
        urls: ipfsObj.urls,
        name: ipfsObj.name,
        nodeId: nodeId,
        nodeName:
          nodeName.substring(0, 1).toUpperCase() +
          nodeName.substring(1, nodeName.length).toLowerCase(),
        // eslint-disable-next-line react/prop-types
        dBIndex: assetArr.length,
        countPair: [100000, 100000],
        status: "Transferable",
        statusNum: "51",
        engraving: ipfsObj.engraving,
        nonMutableStorage: ipfsObj,
        identicon: [<Jdenticon value={idx} key="" />],
        identiconLG: [<Jdenticon value={idx} key="" />],
      };

      idxHash = window.web3.utils.soliditySha3({t: 'bytes32', v: idx}, {t: 'uint32', v: nodeId});
      console.log(first, middle, last, ID, password, idx)
      props.prufClient.utils.generateSecureRgt(
        idxHash,
        {
          first: "0",
          middle: "0",
          last: "0",
          id: "0",
          password: "0"
        }
      ).then(rgtHash => {

        setShowHelp(false);
        setTxStatus(false);
        setTxHash("");
        setError(undefined);
        //setResult("");
        setTransactionActive(true);
        console.log("idxHash", idxHash);
        console.log("New rgtHash", rgtHash);
        // eslint-disable-next-line react/prop-types
        console.log("addr: ", props.addr);
        console.log("AC: ", nodeId);

        //console.log("IPFS bs58: ", window.rawIPFSHashTemp);
        console.log("IPFS bytes32: ", extendedDataHash);
        props.prufClient.do.asset
          .mint(
            idx,
            rgtHash,
            nodeId,
            "1000000",
            extendedDataHash,
            extDataB,
            dataTransaction
          )
          // eslint-disable-next-line react/prop-types
          .send({ from: props.addr })
          .on("error", function (_error) {
            setTransactionActive(false);
            setTxStatus(false);
            setTxHash(Object.values(_error)[0].transactionHash);
            tempTxHash = Object.values(_error)[0].transactionHash;
            let str1 =
              "Check out your TX <a href='https://kovan.etherscan.io/tx/";
            let str2 = "' target='_blank'>here</a>";
            link.innerHTML = String(str1 + tempTxHash + str2);
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
            tempTxHash = receipt.transactionHash;
            let str1 =
              "Check out your TX <a href='https://kovan.etherscan.io/tx/";
            let str2 = "' target='_blank'>here</a>";
            link.innerHTML = String(str1 + tempTxHash + str2);
            setTxHash(receipt.transactionHash);
            swal({
              title: "Asset Created!",
              content: link,
              icon: "success",
              button: "Close",
            }).then(() => {
              //refreshBalances()
              window.location.href = "/#/user/dashboard";
              window.replaceAssetData.key = pageKey
              window.replaceAssetData.getAsset = {id: idxHash}
              window.dispatchEvent(props.refresh)
            });
          });
      });
    } else if (storageProvider === "2") {
      console.log("Using arweave");
      let tempTxHash;
      extendedDataHash = extDataA + extDataB;

      let newAsset = {
        root: selectedRootID,
        nodeData: {
          storageProvider: "2",
          ipfs: "",
          root: selectedRootID,
          name: nodeName.substring(0, 1).toUpperCase() +
            nodeName.substring(1, nodeName.length).toLowerCase(),
          id: nodeId,
        },
        idxHash: idx,
        id: idx,
        currency: "0",
        storageProvider: "2",
        ipfs: extendedDataHash,
        PrimaryContent: `https://arweave.net/${dataTransaction}`,
        photo: ipfsObj.photo,
        photoUrls: { displayImage: `https://arweave.net/${dataTransaction}` },
        text: ipfsObj.text,
        urls: ipfsObj.urls,
        name: ipfsObj.name,
        displayImage: `https://arweave.net/${dataTransaction}`,
        nodeId: nodeId,
        nodeName:
          nodeName.substring(0, 1).toUpperCase() +
          nodeName.substring(1, nodeName.length).toLowerCase(),
        // eslint-disable-next-line react/prop-types
        dBIndex: assetArr.length,
        countPair: [100000, 100000],
        status: "Transferable",
        statusNum: "51",
        engraving: ipfsObj.engraving,
        nonMutableStorage: ipfsObj,
        identicon: [<Jdenticon value={idx} key="" />],
        identiconLG: [<Jdenticon value={idx} key="" />],
      };

      idxHash = window.web3.utils.soliditySha3({t: 'bytes32', v: idx}, {t: 'uint32', v: nodeId})
      props.prufClient.utils.generateSecureRgt(
        idxHash,
        {
          first: "0",
          middle: "0",
          last: "0",
          id: "0",
          password: "0"
        }
      ).then(rgtHash => {

        setShowHelp(false);
        setTxStatus(false);
        setTxHash("");
        setError(undefined);
        //setResult("");
        setTransactionActive(true);
        console.log("idxHash", idxHash);
        console.log("New rgtHash", rgtHash);
        // eslint-disable-next-line react/prop-types
        console.log("addr: ", props.addr);
        console.log("AC: ", nodeId);

        //console.log("IPFS bs58: ", window.rawIPFSHashTemp);
        console.log("IPFS bytes32: ", extendedDataHash);

        props.prufClient.do.asset
          .mint(
            idx,
            rgtHash,
            nodeId,
            "1000000",
            extDataA,
            extDataB,
            dataTransaction
          )
          // eslint-disable-next-line react/prop-types
          .send({ from: props.addr })
          .on("error", function (_error) {
            setTransactionActive(false);
            setTxStatus(false);
            setTxHash(Object.values(_error)[0].transactionHash);
            tempTxHash = Object.values(_error)[0].transactionHash;
            let str1 =
              "Check out your TX <a href='https://kovan.etherscan.io/tx/";
            let str2 = "' target='_blank'>here</a>";
            link.innerHTML = String(str1 + tempTxHash + str2);
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
            tempTxHash = receipt.transactionHash;
            let str1 =
              "Check out your TX <a href='https://kovan.etherscan.io/tx/";
            let str2 = "' target='_blank'>here</a>";
            link.innerHTML = String(str1 + tempTxHash + str2);
            setTxHash(receipt.transactionHash);
            swal({
              title: "Asset Created!",
              content: link,
              icon: "success",
              button: "Close",
            }).then(() => {
              //refreshBalances()
              window.location.href = "/#/user/dashboard";
      
              window.replaceAssetData.key = pageKey
              window.replaceAssetData.getAsset = {id: idxHash}
              window.dispatchEvent(props.refresh)
            });
          });
      });
    }
  };

  // const goBack = () => {
  //   window.location.href = "/#/user/dashboard";
  // }

  const classes = useStyles();
  // const extClasses = useExtStyles()

  return (
    <>
      {props.prufClient === undefined && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Node Selection</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h3>
                Connecting to the blockchain
                <div className="lds-ellipsisIF">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </h3>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {/* eslint-disable-next-line react/prop-types */}
      {props.prufClient !== undefined && !props.nodes &&(
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Node Selection</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h3>
                Getting Token Balances
                <div className="lds-ellipsisIF">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </h3>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {/* eslint-disable-next-line react/prop-types */}
      {props.prufClient !== undefined &&
        // eslint-disable-next-line react/prop-types
        props.nodeSets === undefined && (
          <Card>
            <CardHeader icon>
              <CardIcon className="headerIconBack">
                <Category />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Node Selection</h4>
            </CardHeader>
            <CardBody>
              <form>
                <h3>
                  Getting Node Data
                  <div className="lds-ellipsisIF">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </h3>
              </form>
            </CardBody>
            <br />
          </Card>
        )}
      {props.prufClient !== undefined &&
        // eslint-disable-next-line react/prop-types
        props.nodeSets !== undefined && (
          <GridContainer>
            <>
              <input
                type="file"
                onChange={uploadImage}
                ref={fileInput}
                className="imageInput"
              />
              {nodeId === "" && !transactionActive && (
                <Card>
                  <CardHeader icon>
                    <CardIcon className="headerIconBack">
                      <Category />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      Node Selection
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <form>
                      {publicNode && (
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel>Select Root Node</InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu,
                            }}
                            classes={{
                              select: classes.select,
                            }}
                            value={rootSelect}
                            onChange={(e) => {
                              rootLogin(e);
                            }}
                            inputProps={{
                              name: "rootSelect",
                              id: "root-select",
                            }}
                          >
                            {/* eslint-disable-next-line react/prop-types */}
                            {generateRootList(
                              // eslint-disable-next-line react/prop-types
                              props.roots
                            )}
                          </Select>
                        </FormControl>
                      )}
                      {!publicNode && (
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel>Select Node</InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu,
                            }}
                            classes={{
                              select: classes.select,
                            }}
                            value={rootSelect}
                            // onChange={(e) => { nodeLogin(e) }}
                            inputProps={{
                              name: "rootSelect",
                              id: "root-select",
                            }}
                          >
                            <MenuItem
                              disabled
                              key={"N/A"}
                              classes={{
                                node: classes.selectMenuItem,
                              }}
                            >
                              Currently Unavailable
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                      <br></br>
                      {selectedRootID !== "" && (
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <>
                            <InputLabel>Select Node</InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu,
                              }}
                              classes={{
                                select: classes.select,
                              }}
                              value={classSelect}
                              onChange={(e) => {
                                nodeLogin(e);
                              }}
                              inputProps={{
                                name: "classSelect",
                                id: "class-select",
                              }}
                            >
                              {generateSubCatList(
                                // eslint-disable-next-line react/prop-types
                                props.nodeSets[selectedRootID]
                              )}
                            </Select>
                          </>
                        </FormControl>
                      )}
                    </form>
                  </CardBody>
                  <br />
                </Card>
              )}
              {/* {nodeId === "" && IDtransactionActive && (
                <Card>
                  <CardHeader icon>
                    <CardIcon className="headerIconBack">
                      <Category />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                      Select Node
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <form>
                      <h3>
                        Creating ID
                        <div className="lds-ellipsisIF">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </h3>
                    </form>
                  </CardBody>
                  <br />
                </Card>
              )} */}
              {nodeId !== "" && (
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
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setNameTag(event.target.value.trim());
                                  },
                                }}
                              />
                            )}
                            {transactionActive && !ipfsActive && (
                              <CustomInput
                                labelText={nameTag}
                                id="assetName"
                                disabled
                                formControlProps={{
                                  fullWidth: true,
                                }}
                              />
                            )}
                            {!transactionActive && ipfsActive && (
                              <CustomInput
                                labelText={nameTag}
                                id="assetName"
                                disabled
                                formControlProps={{
                                  fullWidth: true,
                                }}
                              />
                            )}
                          </>
                          {isUploading && (
                            <>
                              <br />
                              <br />
                              <CardHeader
                                image
                                className={classes.cardHeaderHoverCustom}
                              >
                                <div className="loadingImage">
                                  <div className="lds-default">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                  </div>
                                </div>
                              </CardHeader>
                            </>
                          )}
                          {displayImage !== "" && !isUploading && (
                            <>
                              <br />
                              <br />
                              <CardHeader
                                image
                                className={classes.cardHeaderHoverCustom}
                              >
                                <img src={displayImage} alt="" className="newDisplayImage" />
                              </CardHeader>
                            </>
                          )}
                          {!transactionActive &&
                            displayImage === "" &&
                            !isUploading && (
                              <Button
                                color="info"
                                onClick={() => {
                                  handleClick();
                                }}
                              >
                                Upload Token Content
                              </Button>
                            )}
                          {!transactionActive &&
                            displayImage !== "" &&
                            !isUploading && (
                              <>
                                <Button
                                  color="info"
                                  onClick={() => {
                                    handleClick();
                                  }}
                                >
                                  Change Token Content
                                </Button>
                                <Button
                                  color="danger"
                                  onClick={() => {
                                    removedisplayImage();
                                  }}
                                >
                                  Remove Content
                                </Button>
                              </>
                            )}
                          {transactionActive && displayImage !== "" && (
                            <Button disabled> ... </Button>
                          )}
                          {!transactionActive && ipfsActive && (
                            <Button disabled> ... </Button>
                          )}
                          {!transactionActive && (
                            <>
                              <TextField
                                onChange={(e) => {
                                  setEngraving(e.target.value);
                                }}
                                id="outlined-multiline-static"
                                label="Asset Engraving:"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                className="bottomSpace"
                              />
                            </>
                          )}
                          {transactionActive && engraving !== "" && (
                            <>
                              <TextField
                                id="outlined-multiline-static"
                                // label="Asset engraving:"
                                multiline
                                disabled
                                placeholder={engraving}
                                rows={4}
                                variant="outlined"
                                fullWidth
                                className="bottomSpace"
                              />
                            </>
                          )}
                          {!transactionActive && ipfsActive && (
                            <>
                              <TextField
                                id="outlined-multiline-static"
                                // label="Asset engraving:"
                                multiline
                                disabled
                                placeholder={engraving}
                                rows={4}
                                variant="outlined"
                                fullWidth
                                className="bottomSpace"
                              />
                            </>
                          )}
                          {!transactionActive && !ipfsActive && (
                            <>
                              {/* <CustomInput
                                success={loginMakeState === "success"}
                                error={loginMakeState === "error"}
                                labelText="Make *"
                                id="make"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setMake(event.target.value.trim());
                                    if (event.target.value !== "") {
                                      setloginMakeState("success");
                                    } else {
                                      setloginMakeState("error");
                                    }
                                    setloginMake(event.target.value);
                                  },
                                }}
                              /> */}
                              {/* <CustomInput
                                success={loginTypeState === "success"}
                                error={loginTypeState === "error"}
                                labelText="Type *"
                                id="type"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setType(event.target.value.trim());
                                    if (event.target.value !== "") {
                                      setloginTypeState("success");
                                    } else {
                                      setloginTypeState("error");
                                    }
                                    setloginType(event.target.value);
                                  },
                                }}
                              /> */}
                              <CustomInput
                                success={loginModelState === "success"}
                                error={loginModelState === "error"}
                                labelText="Model *"
                                id="model"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setModel(event.target.value.trim());
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
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setSerial(event.target.value.trim());
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
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                              )}
                              {/* <CustomInput
                                labelText={make}
                                id="make"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              /> */}
                              {/* <CustomInput
                                labelText={type}
                                id="type"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              /> */}
                              <CustomInput
                                labelText={model}
                                id="model"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                              <CustomInput
                                labelText={serial}
                                id="serial"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                            </>
                          )}
                          {!transactionActive && ipfsActive && (
                            <>
                              {assetName !== "" && (
                                <CustomInput
                                  labelText={assetName}
                                  id="assetName"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                              )}
                              {/* <CustomInput
                                labelText={make}
                                id="make"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              /> */}
                              {/* <CustomInput
                                labelText={type}
                                id="type"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              /> */}
                              <CustomInput
                                labelText={model}
                                id="model"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                              <CustomInput
                                labelText={serial}
                                id="serial"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                            </>
                          )}
                          <h4>
                            Node Selected: {nodeName} (ID: {nodeId})
                          </h4>
                          {storageProvider === "2" ? (
                            <h6 className="storageProviderText">
                              Permanent data storage by{" "}
                              <a
                                href="https://www.arweave.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={ARweavePNG}
                                  className="ARweave"
                                  alt=""
                                ></img>
                              </a>
                            </h6>
                          ) : (
                            <h6 className="storageProviderText">
                              Asset data stored using{" "}
                              <a
                                href="https://ipfs.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={IPFSPNG}
                                  className="IPFS"
                                  alt=""
                                ></img>
                              </a>
                            </h6>
                          )}
                          {!transactionActive && !isUploading && !ipfsActive && (
                            <>
                              <h4 className="costsText">Cost: ü{NRCost}</h4>
                              <div className="MLBGradientSubmit">
                                <Button
                                  color="info"
                                  className="MLBGradient"
                                  onClick={() => checkAsset()}
                                >
                                  Create New Asset
                                </Button>
                              </div>
                            </>
                          )}
                          {!transactionActive && ipfsActive && (
                            <h3>
                              Sending extended data to
                              {storageProvider === "2"
                                ? ` Arweave`
                                : storageProvider === "1"
                                  ? ` IPFS`
                                  : ` Unknown Client`}
                              <div className="lds-ellipsisIF">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </h3>
                          )}
                          {!ipfsActive && transactionActive && (
                            <h3>
                              Minting Asset Token
                              <div className="lds-ellipsisIF">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </h3>
                          )}
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem>
                  {/* <GridItem xs={12} sm={12} md={6}>
                    <Card>
                      <CardHeader icon>
                        <CardIcon className="headerIconBack">
                          <AccountBox />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>
                          Owner Information
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <form>
                          <>
                            {!transactionActive && !ipfsActive && (
                              <>
                                <CustomInput
                                  success={loginFirstState === "success"}
                                  error={loginFirstState === "error"}
                                  labelText="First Name *"
                                  id="firstName"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    onChange: (event) => {
                                      setFirst(event.target.value.trim());
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
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    onChange: (event) => {
                                      setMiddle(event.target.value.trim());
                                    },
                                  }}
                                />
                                <CustomInput
                                  success={loginLastState === "success"}
                                  error={loginLastState === "error"}
                                  labelText="Last Name *"
                                  id="lastName"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    onChange: (event) => {
                                      setLast(event.target.value.trim());
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
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    onChange: (event) => {
                                      setID(event.target.value.trim());
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
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    type: "password",
                                    onChange: (event) => {
                                      setPassword(event.target.value.trim());
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
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={middle}
                                  id="middle"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={last}
                                  id="last"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={ID}
                                  id="ID"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={password}
                                  id="password"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    type: "password",
                                    disabled: true,
                                  }}
                                />
                              </>
                            )}
                            {!transactionActive && ipfsActive && (
                              <>
                                <CustomInput
                                  labelText={first}
                                  id="first"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={middle}
                                  id="middle"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={last}
                                  id="last"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={ID}
                                  id="ID"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                  }}
                                />
                                <CustomInput
                                  labelText={password}
                                  id="password"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    type: "password",
                                    disabled: true,
                                  }}
                                />
                              </>
                            )}
                          </>
                          {!transactionActive && !isUploading && !ipfsActive && (
                            <>
                              <h4 className="costsText">Cost: ü{NRCost}</h4>
                              <div className="MLBGradientSubmit">
                                <Button
                                  color="info"
                                  className="MLBGradient"
                                  onClick={() => checkAsset()}
                                >
                                  Create New Asset
                                </Button>
                              </div>
                            </>
                          )}
                          {!transactionActive && ipfsActive && (
                            <h3>
                              Sending extended data to
                              {storageProvider === "2"
                                ? ` Arweave`
                                : storageProvider === "1"
                                  ? ` IPFS`
                                  : ` Unknown Client`}
                              <div className="lds-ellipsisIF">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </h3>
                          )}
                          {!ipfsActive && transactionActive && (
                            <h3>
                              Minting Asset Token
                              <div className="lds-ellipsisIF">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </h3>
                          )}
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem> */}
                </>
              )}
            </>
          </GridContainer>
        )}
    </>
  );
}
